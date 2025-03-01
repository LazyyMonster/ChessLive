import numpy as np

def make_grid_pts(image):
    """
    Generate grid points for an 8x8 chessboard.
    """
    height, width = image.shape[:2]
    pts_top = np.linspace(0, width, num=9).astype(int) 
    pts_left = np.linspace(0, height, num=9).astype(int)
    return pts_top, pts_left
