import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSettings } from "../components/settings/settings";
import { useChess } from "../chessLogic/chessGame";
import { useLichess } from "../lichessAPI/lichessGame";

export default function DetectPieces({ image, setFenDetected }) {
    const { detectedCorners, piecesConf } = useSettings();
    const [error, setError] = useState(null);
    const { makeMove, returnAndMakeMove, findMove, isPlayingOnline, playerColor, getFen, lastMove } = useChess();
    const { sendMove } = useLichess();

    useEffect(() => {
        if (image) {
            sendReq(image);
        }
    }, [image]);

    const sendReq = async (image) => {
        if (!image) {
            setError("No image available for detection.");
            return;
        }

        try {
            const blob = await (await fetch(image)).blob();
            const file = new File([blob], "detect_pieces.jpg", { type: blob.type });

            const formData = new FormData();
            formData.append("file", file);

            const body = {
                corners: detectedCorners,
                pieces_conf: piecesConf,
            };
            formData.append("data", JSON.stringify(body));
            const response = await axios.post(
                `http://127.0.0.1:8000/fen_from_image/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const fenDetected = response.data.fen;
            console.log("Detected FEN:", fenDetected);
            setFenDetected(fenDetected);
            setError(null);

            if (!isPlayingOnline) {
                const detectedMove = findMove(fenDetected);
                if (detectedMove) {
                    console.log("Making move:", detectedMove);
                    makeMove(detectedMove);
                } else {
                    console.error("No valid move found.");
                }
                return;
            }

            const prevTurn = getFen().split(" ")[1];
            console.log('turn is ',prevTurn)
            const isPlayerTurn = (playerColor === "white" && prevTurn === "w") || 
                                 (playerColor === "black" && prevTurn === "b");

            if (!isPlayerTurn) {
                console.warn("Not your turn to move. Move skipped.");
                return;
            }

            const detectedMove = findMove(fenDetected);
            if (detectedMove) {
                console.log("Making move:", detectedMove);
                const playerMove = returnAndMakeMove(detectedMove);
                sendMove(playerMove);
            } else {
                console.error("No valid move found.");
            }
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setError(err.response?.data?.detail || "An error occurred while detecting pieces.");
        }
    };

    return error ? <p className="error">{error}</p> : null;
}
