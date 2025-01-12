from fastapi import APIRouter, UploadFile, HTTPException
from src.services.detection import detect_corners
from src.services.transformation import order_corners

import numpy as np
import base64
import cv2

router = APIRouter()

@router.post("/")
async def detect_corners_endpoint(data: dict):
    try:
        image_base64 = data.get("image")
        corners_conf = data.get("corners_conf")
        
        if not image_base64 or corners_conf is None:
            raise HTTPException(
                status_code=400, detail="Missing 'image' or 'corners_conf'."
            )

        if image_base64.startswith("data:image"):
            image_base64 = image_base64.split(",")[1]
            image_bytes = base64.b64decode(image_base64)
            image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)

        detections = detect_corners(image, corners_conf)

        num_corners = len(detections)
        if num_corners != 4:
            return {"error": f"Four corners are required to crop the chessboard. Detected {num_corners} corners."}
        corners = order_corners(detections)

        corner_names = ["A1", "A8", "H8", "H1"]
        corners_with_names = {corner_names[i]: corners[i].tolist() for i in range(4)}

        return {"corners": corners_with_names}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error when detecting corners: {str(e)}")
