from fastapi import APIRouter, HTTPException
from src.services.detection import detect_pieces
from src.services.transformation import cut_chessboard
from src.services.fen_generator import make_fen
import cv2
import numpy as np
import base64

router = APIRouter()

# punkt zwracający wykrytą pozycję w postaci FEN
@router.post("/")
async def fen_from_image(data: dict):
    try:
        # pobranie przekazanych danych
        image_base64 = data.get("image")
        corners = data.get("corners")
        pieces_conf = data.get("pieces_conf")

        # sprawdzenie obecności wszystkich argumentów
        if not image_base64:
            raise HTTPException(
                status_code=400, detail="Missing image."
            )
        if not corners:
            raise HTTPException(
                status_code=400, detail="Missing corners."
            )
        if not pieces_conf:
            raise HTTPException(
                status_code=400, detail="Missing pieces_conf."
            )

        # konwersja obrazu z base64 do formatu obrazu openCV
        image_base64 = image_base64.split(",")[1]
        image_bytes = base64.b64decode(image_base64)
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)

        # uporządkowanie rogów szachownicy w odpowiedniej kolejności
        ordered_corners = [
            corners["A1"],
            corners["A8"],
            corners["H8"],
            corners["H1"]
        ]

        # wycięcie szachownicy z obrazu
        transformed_image = cut_chessboard(image, ordered_corners)

        # detekcja figur na wyciętym obrazie
        pieces, boxes = detect_pieces(transformed_image, pieces_conf)

        # brak wykrytych figur, zwracana pusta szachownica
        if len(pieces) == 0:
            return {"fen": "8/8/8/8/8/8/8/8"}

        # generowanie i zwracanie notacji FEN 
        fen = make_fen(pieces, boxes, transformed_image)
        return {"fen": fen}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error when generating FEN: {str(e)}")
