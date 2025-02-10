from ultralytics import YOLO

corner_model = YOLO("models/best_corners.pt")
pieces_model = YOLO("models/best_pieces_real_plus_synth.pt")

# pieces_model = YOLO("models/best_pieces_real_only.pt")
# pieces_model = YOLO("models/best.pt")


def detect_corners(image, confidence):
    results = corner_model.predict(source=image, conf=confidence, save=False)
    detections = [
        [result.xywh[0][0], result.xywh[0][1]] 
        for result in results[0].boxes
    ]
    return detections


def detect_pieces(image, confidence):
    results = pieces_model.predict(source=image, conf=confidence, save=False)
    detections = results[0].boxes.xyxy.numpy()
    return detections, results[0].boxes
