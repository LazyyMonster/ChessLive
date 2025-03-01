import numpy as np
from shapely.geometry import Polygon
from app.src.services.grid import make_grid_pts

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

    list_of_iou = []
    
    for i in detections:
        box_complete = np.array([
            [i[0], i[1]], [i[2], i[1]],
            [i[2], i[3]], [i[0], i[3]]
        ])
        list_of_iou.append(calculateIoU(box_complete, square))

    num = list_of_iou.index(max(list_of_iou))

    if max(list_of_iou) > 0.15:
        return pieceLetter[boxes.cls[num].tolist()]
    else:
        return ""


def make_fen(pieces, boxes, image):
    ptsT, ptsL = make_grid_pts(image)
    fen_string = ""
    for i in range(8):
        empty_spaces = 0
        for j in range(8):
            square = np.array([
                [ptsT[j], ptsL[i]],
                [ptsT[j+1], ptsL[i]],
                [ptsT[j+1], ptsL[i+1]],
                [ptsT[j], ptsL[i+1]]
            ])
            piece_letter = connect_detection_to_square(pieces, boxes, square)
            if not piece_letter:
                empty_spaces += 1
            else:
                if empty_spaces > 0:
                    fen_string += str(empty_spaces)
                    empty_spaces = 0
                fen_string += piece_letter
        if empty_spaces > 0:
            fen_string += str(empty_spaces)
        fen_string += "/"

    return fen_string.rstrip("/")
