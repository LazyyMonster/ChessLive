from fastapi import FastAPI, UploadFile, HTTPException, File, Form
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
import json

import numpy as np
import matplotlib.pyplot as plt
from shapely.geometry import Polygon
import cv2
from typing import Dict, List

from ultralytics import YOLO


class CornersBody(BaseModel):
    corners: Dict[str, List[float]]
    pieces_conf: float


app = FastAPI()

corner_model = YOLO("models/best_corners.pt")
pieces_model = YOLO("models/best_pieces_real_plus_synth.pt")


allowed_origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def detect_pieces(image, confidence):

    results = pieces_model.predict(source = image, conf = confidence, save=False)
    detections = []

    boxes = results[0].boxes
    detections = boxes.xyxy.numpy()

    return detections, boxes


def make_grid(image):
    height, width = image.shape[:2]

    corners = np.array([
        [0, 0], 
        [width, 0], 
        [0, height], 
        [width, height]
    ])

    plt.figure(figsize=(10, 10), dpi=80)

    TL = corners[0]
    BL = corners[2]
    TR = corners[1]
    BR = corners[3]

    def interpolate(xy0, xy1):
        x0,y0 = xy0
        x1,y1 = xy1
        dx = (x1-x0) / 8
        dy = (y1-y0) / 8
        pts = [(x0+i*dx,y0+i*dy) for i in range(9)]
        return pts

    ptsT = interpolate( TL, TR )
    ptsL = interpolate( TL, BL )
        
    return ptsT, ptsL


def calculateIoU(box1, box2):
    poly1 = Polygon(box1)
    poly2 = Polygon(box2)
    iou = poly1.intersection(poly2).area / poly1.union(poly2).area
    return iou


def connect_detection_to_square(detections, boxes, square):
    
    pieceLetter = {0: 'P', 1: 'R', 2: 'N',
      3: 'B', 4: 'Q', 5: 'K', 
      6: 'p', 7: 'r', 8: 'n',
      9: 'b', 10: 'k', 11: 'q'}

    list_of_iou=[]
    
    for i in detections:

        box_x1 = i[0]
        box_y1 = i[1]

        box_x2 = i[2]
        box_y2 = i[1]

        box_x3 = i[2]
        box_y3 = i[3]

        box_x4 = i[0]
        box_y4 = i[3]
                
        if box_y4 - box_y1 > 60:
            box_complete = np.array([[box_x1,box_y1+40], [box_x2, box_y2+40], [box_x3, box_y3], [box_x4, box_y4]])
        else:
            box_complete = np.array([[box_x1,box_y1], [box_x2, box_y2], [box_x3, box_y3], [box_x4, box_y4]])

        list_of_iou.append(calculateIoU(box_complete, square))

    num = list_of_iou.index(max(list_of_iou))

    piece = boxes.cls[num].tolist()
    
    if max(list_of_iou) > 0.15:
        piece = boxes.cls[num].tolist()
        return pieceLetter[piece]
    
    else:
        piece = ""
        return piece
    

def make_fen(pieces, boxes, image):
    import numpy as np

    ptsT, ptsL = make_grid(image)

    x_coords = [ptsT[i][0] for i in range(9)]
    y_coords = [ptsL[i][1] for i in range(9)]

    FEN_annotation = []

    for i in range(8):
        row = []
        for j in range(8):
            square = np.array([
                [x_coords[j], y_coords[i]],
                [x_coords[j+1], y_coords[i]],
                [x_coords[j+1], y_coords[i+1]],
                [x_coords[j], y_coords[i+1]],
            ])
            row.append(square)
        FEN_annotation.append(row)

    board_FEN = []

    for line in FEN_annotation:
        line_to_FEN = []
        for square in line:
            piece_on_square = connect_detection_to_square(pieces, boxes, square)
            line_to_FEN.append(piece_on_square)
        board_FEN.append(line_to_FEN)

    # Replace empty squares with their count
    complete_board_FEN = []
    for line in board_FEN:
        fen_line = ""
        empty_count = 0
        for square in line:
            if square == "":
                empty_count += 1
            else:
                if empty_count > 0:
                    fen_line += str(empty_count)
                    empty_count = 0
                fen_line += square
        if empty_count > 0:
            fen_line += str(empty_count)
        complete_board_FEN.append(fen_line)

        to_FEN = '/'.join(complete_board_FEN)

    return to_FEN


def cut_chessboard(image: np.ndarray, corners: List[List[float]]) -> np.ndarray:
    corners = np.array(corners, dtype="float32")
    if image is None or image.size == 0:
        raise ValueError("Input image is empty or invalid.")
    if len(corners) != 4:
        raise ValueError("Corners must contain exactly 4 points.")

    (a1, a8, h8, h1) = corners

    widthA = np.sqrt(((h8[0] - a1[0]) ** 2) + ((h1[1] - a1[1]) ** 2))
    widthB = np.sqrt(((h8[0] - a8[0]) ** 2) + ((h8[1] - a8[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))

    heightA = np.sqrt(((h8[0] - h1[0]) ** 2) + ((h8[1] - h1[1]) ** 2))
    heightB = np.sqrt(((a8[0] - a1[0]) ** 2) + ((a8[1] - a1[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))

    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")

    M = cv2.getPerspectiveTransform(corners, dst)
    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
    return warped


def order_corners(pts):    
    pts = np.array(pts, dtype="float32")

    sorted_by_y = pts[np.argsort(pts[:, 1])]
    
    top_points = sorted_by_y[:2]
    bottom_points = sorted_by_y[2:]

    top_left, top_right = top_points[np.argsort(top_points[:, 0])]

    bottom_left, bottom_right = bottom_points[np.argsort(bottom_points[:, 0])]

    rect = np.array([top_right, bottom_right, bottom_left, top_left])

    return rect

def make_fen_optimized(pieces, boxes, image):
    ptsT, ptsL = make_grid(image)
    x_coords = np.array([p[0] for p in ptsT])
    y_coords = np.array([p[1] for p in ptsL])

    board_FEN = []
    for i in range(8):
        fen_line = ""
        empty_count = 0
        for j in range(8):
            square = np.array([
                [x_coords[j], y_coords[i]],
                [x_coords[j+1], y_coords[i]],
                [x_coords[j+1], y_coords[i+1]],
                [x_coords[j], y_coords[i+1]],
            ])
            piece = connect_detection_to_square(pieces, boxes, square)
            if piece:
                if empty_count > 0:
                    fen_line += str(empty_count)
                    empty_count = 0
                fen_line += piece
            else:
                empty_count += 1
        if empty_count > 0:
            fen_line += str(empty_count)
        board_FEN.append(fen_line)
    return '/'.join(board_FEN)


@app.post("/fen_from_image/")
async def fen_from_image(
    file: UploadFile = File(...),
    data: str = Form(...)
):
    try:
        parsed_data = json.loads(data)
        corners = parsed_data.get("corners")
        pieces_conf = parsed_data.get("pieces_conf")
        if not corners or pieces_conf is None:
            raise HTTPException(status_code=400, detail="Missing 'corners' or 'pieces_conf' in data.")
        ordered_corners = [
            corners["A1"],
            corners["A8"],
            corners["H8"],
            corners["H1"]
        ]

        image_bytes = await file.read()
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
        transformed_image = cut_chessboard(image, ordered_corners)

        pieces, boxes = detect_pieces(transformed_image, pieces_conf)

        fen = make_fen(pieces, boxes, transformed_image)

        return {"fen": fen}

    except (KeyError, json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    

@app.post("/detect_corners/")
async def detect_corners(file: UploadFile, corner_conf: float):
    
    image_bytes = await file.read()
    image = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    results = corner_model.predict(source=image, conf=corner_conf, save=False)
    detections = []

    for result in results[0].boxes:
        if len(detections) < 4:
            x, y, width, height = result.xywh[0]
            detections.append([x, y])
        else:
            break

    num_corners = len(detections)

    if num_corners < 4:
        return {"error": f"Four corners are required to crop the chessboard. Detected {num_corners} corners."}
    corners = order_corners(detections)

    corner_names = ["A1", "A8", "H8", "H1"]
    corners_with_names = {corner_names[i]: corners[i].tolist() for i in range(4)}

    return {"corners": corners_with_names}

    
#TODO
#check file extension and save
@app.post("/corners_model_upload/")
async def corners_model(file: UploadFile):
    corner_model = file

    return 1


#TODO
#check file extension and save
@app.post("/pieces_model_upload/")
async def pieces_model_upload(file: UploadFile):
    pieces_model = file

    return 1


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}