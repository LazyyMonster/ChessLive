from fastapi import APIRouter, UploadFile, Form, HTTPException, File
from src.services.detection import detect_pieces
from src.services.transformation import cut_chessboard
from src.services.fen_generator import make_fen
import json
import cv2
import numpy as np

router = APIRouter()

@router.post("/")
async def fen_from_image(file: UploadFile = File(...), data: str = Form(...)):
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

        # Handle case where no pieces are detected
        if len(pieces) == 0:
            return {"fen": "8/8/8/8/8/8/8/8"}  # Return empty board FEN

        fen = make_fen(pieces, boxes, transformed_image)
        return {"fen": fen}

    except (KeyError, json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
