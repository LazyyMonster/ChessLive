import axios from "axios";
import { showSnackbar } from "../components/alerts/customSnackbar";
import { BACKEND_URL } from "../components/settings/constants";

let isCornersRequestInProgress = false;
// flaga zapobiegajaca wielokrotnemu wysylaniu zapytania w tym samym czasie
let isFENRequestInProgress = false;

export const fenRequest = async (image, detectedCorners, piecesConf, setFenDetected) => {

    // sprawdzenie flagi
    if (isFENRequestInProgress) return;
    isFENRequestInProgress = true;
    
    try {
        // wyslanie zapytania POST do serwera z obrazem, polozeniem rogow i progiem detekcji figur
        const response = await axios.post(`${BACKEND_URL}/fen/`, {
            image,
            corners: detectedCorners,
            pieces_conf: piecesConf,
        });
        // pobranie odpowiedzi z serwera i zachowanie zapisu FEN
        const fenDetected = response.data.fen;
        setFenDetected(fenDetected);

    } catch (err) {
        // wyswietlenie komunikatu o bledzie 
        showSnackbar("Failed to detect pieces.", "error");
    } finally {
        // umozliwienie wysylania kolejnych zapytan 
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
            showSnackbar("Try again detecting corners!", "error");
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
