import numpy as np
import cv2

def cut_chessboard(image: np.ndarray, corners: list) -> np.ndarray:
    if len(corners) != 4:
        raise ValueError("Corners must contain exactly 4 points.")

    corners = np.array(corners, dtype="float32")

    a1, a8, h8, h1 = corners

    width_top = np.linalg.norm(h1 - a1)
    width_bottom = np.linalg.norm(h8 - a8)
    max_width = int(max(width_top, width_bottom))

    height_left = np.linalg.norm(a8 - a1)
    height_right = np.linalg.norm(h8 - h1)
    max_height = int(max(height_left, height_right))

    dst = np.array([
        [0, 0],
        [max_width - 1, 0],
        [max_width - 1, max_height - 1],
        [0, max_height - 1]
    ], dtype="float32")

    transform_matrix = cv2.getPerspectiveTransform(corners, dst)
    warped = cv2.warpPerspective(image, transform_matrix, (max_width, max_height))

    return warped


def order_corners(pts):
    pts = np.array(pts, dtype="float32")

    sorted_by_y = pts[np.argsort(pts[:, 1])]

    top_points = sorted_by_y[:2]
    bottom_points = sorted_by_y[2:]

    top_left, top_right = top_points[np.argsort(top_points[:, 0])]
    bottom_left, bottom_right = bottom_points[np.argsort(bottom_points[:, 0])]

    return np.array([top_left, top_right, bottom_right, bottom_left], dtype="float32")
