from fastapi import APIRouter, UploadFile, HTTPException
from src.services.detection import detect_corners
from src.services.transformation import order_corners
import numpy as np
import cv2

router = APIRouter()

@router.post("/")
async def detect_corners_endpoint(file: UploadFile, corner_conf: float):
    try:
        image_bytes = await file.read()
        image = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        detections = detect_corners(image, corner_conf)

        num_corners = len(detections)
        if num_corners != 4:
            return {"error": f"Four corners are required to crop the chessboard. Detected {num_corners} corners."}
        corners = order_corners(detections)

        corner_names = ["A1", "A8", "H8", "H1"]
        corners_with_names = {corner_names[i]: corners[i].tolist() for i in range(4)}

        return {"corners": corners_with_names}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error when detecting corners: {str(e)}")
