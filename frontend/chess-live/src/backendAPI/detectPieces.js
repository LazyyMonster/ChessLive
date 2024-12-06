import axios from "axios";
import { useCapture } from '../components/camera/captureContext';
import React, { useState} from "react";


export default function DetectPieces({ corners, setFen }) {

    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [piecesConf, setPiecesConf] = useState(0.5);

    const {capture, setWebcamRef} = useCapture();


    const handleCapture = () => {

        const image = capture();
        if (image) {
            sendReq(image);
        }
    };

    const sendReq = async (imageSrc) => {
        if (!imageSrc) {
            setError("Please select a file before submitting.");
            return;
        }
    
        const blob = await (await fetch(imageSrc)).blob();
        const file = new File([blob], "chessboard.jpg", { type: blob.type });
    
        const formData = new FormData();
        formData.append("file", file);
    
        const body = {
            corners: corners,
            pieces_conf: piecesConf,
        };
        formData.append("data", JSON.stringify(body));
    
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/fen_from_image/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            console.log("Server Response:", response.data);
            setFen(response.data.fen);
            setError(null);
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setError(err.response?.data?.detail || "An error occurred while fetching FEN.");
            setFen(null);
        }
    };
 
    return (
        <button onClick={handleCapture}>Detect Pieces</button>
    );
}