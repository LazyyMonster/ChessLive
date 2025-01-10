from fastapi import APIRouter, HTTPException
from src.services.detection import detect_pieces
from src.services.transformation import cut_chessboard
from src.services.fen_generator import make_fen
import cv2
import numpy as np
import base64

router = APIRouter()

@router.post("/")
async def fen_from_image(data: dict):
    try:
        image_base64 = data.get("image")
        corners = data.get("corners")
        pieces_conf = data.get("pieces_conf")

        if not image_base64 or not corners or pieces_conf is None:
            raise HTTPException(
                status_code=400, detail="Missing 'image', 'corners', or 'pieces_conf'."
            )

        if image_base64.startswith("data:image"):
            image_base64 = image_base64.split(",")[1]
            image_bytes = base64.b64decode(image_base64)
            image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)

            ordered_corners = [
                corners["A1"],
                corners["A8"],
                corners["H8"],
                corners["H1"]
            ]

        transformed_image = cut_chessboard(image, ordered_corners)

        pieces, boxes = detect_pieces(transformed_image, pieces_conf)

        # Handle case where no pieces are detected
        if len(pieces) == 0:
            return {"fen": "8/8/8/8/8/8/8/8"}  # Return empty board FEN

        fen = make_fen(pieces, boxes, transformed_image)
        return {"fen": fen}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
