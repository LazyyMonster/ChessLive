import axios from "axios";
import { showSnackbar } from "../components/alerts/customSnackbar";
import { BACKEND_URL } from "../components/settings/constants";

let isFENRequestInProgress = false;
let isCornersRequestInProgress = false;

export const fenRequest = async (image, detectedCorners, piecesConf, setFenDetected) => {
    if (isFENRequestInProgress) return;
    isFENRequestInProgress = true;

    try {
        const response = await axios.post(`${BACKEND_URL}/fen/`, {
            image,
            corners: detectedCorners,
            pieces_conf: piecesConf,
        });

        const fenDetected = response.data.fen;
        setFenDetected(fenDetected);

    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to detect pieces.";
        showSnackbar(errorMessage, "error");
    } finally {
        isFENRequestInProgress = false;
    }
};


export const cornersRequest = async (image, cornersConf, setDetectedCorners) => {
    if (isCornersRequestInProgress) return;
    isCornersRequestInProgress = true;

    try {
        const response = await axios.post(`${BACKEND_URL}/corners/`, {
            image,
            corners_conf: cornersConf,
        });
        const detectedCorners = response.data.corners || [];
        const cornerKeys = Object.keys(detectedCorners);
        const lenCorners = cornerKeys.length;
        if (lenCorners !== 4) {
            setDetectedCorners(null);
            showSnackbar(`Detected ${lenCorners} Try again detecting corners!`, "error");
        }
        else {
            setDetectedCorners(detectedCorners);
            showSnackbar("Succesfully detected 4 corners!", "success");
        }

    } catch (err) {
        showSnackbar("Failed to send request to get corners!", "error");
    } finally {
        isCornersRequestInProgress = false;
    }
};
