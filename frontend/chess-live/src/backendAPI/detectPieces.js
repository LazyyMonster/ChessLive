import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useSettings } from "../components/settings/settings";
import { useChess } from "../chessLogic/chessGame";
import { useLichess } from "../lichessAPI/lichessGame";
import { showSnackbar } from "../components/alerts/customSnackbar";

export default function DetectPieces({ image, setFenDetected, onCornersError }) {
    const { detectedCorners, piecesConf } = useSettings();
    const [error, setError] = useState(null);
    const { makeMove, returnAndMakeMove, findMove, isPlayingOnline, playerColor, getFen, lastMove } = useChess();
    const { sendMove } = useLichess();

    const sendReq = async (image) => {
        if (!detectedCorners) {
            showSnackbar(`Before starting the game, you must detect 4 corners.`, "error");
            setError("Corners not detected.");
            onCornersError();
            return;
        }

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
            setFenDetected(fenDetected);
            setError(null);

            if (!isPlayingOnline) {
                const detectedMove = findMove(fenDetected);
                if (detectedMove) {
                    makeMove(detectedMove);
                }
                return;
            }

            const prevTurn = getFen().split(" ")[1];
            const isPlayerTurn =
                (playerColor === "white" && prevTurn === "w") ||
                (playerColor === "black" && prevTurn === "b");

            console.log("Player color:", playerColor);
            console.log("is my turn:", isPlayerTurn);
            
            if (isPlayerTurn) {
                const detectedMove = findMove(fenDetected);
                if (detectedMove) {
                    const playerMove = returnAndMakeMove(detectedMove);
                    sendMove(playerMove);
                }
            }

            handleMove(fenDetected);
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setError(err.response?.data?.detail || "An error occurred while detecting pieces.");
        }
    };

    const handleMove = useCallback((fenDetected) => {
        if (!isPlayingOnline) {
            const detectedMove = findMove(fenDetected);
            if (detectedMove) {
                makeMove(detectedMove);
            }
            return;
        }

        const prevTurn = getFen().split(" ")[1];
        const isPlayerTurn =
            (playerColor === "white" && prevTurn === "w") ||
            (playerColor === "black" && prevTurn === "b");

        if (isPlayerTurn) {
            const detectedMove = findMove(fenDetected);
            if (detectedMove) {
                const playerMove = returnAndMakeMove(detectedMove);
                sendMove(playerMove);
            }
        }
    }, [isPlayingOnline, findMove, makeMove, getFen, playerColor, sendMove, returnAndMakeMove]);

    useEffect(() => {
        if (image) {
            sendReq(image);
        }
    }, [image, detectedCorners, piecesConf]);

    return error ? <p className="error">{error}</p> : null;
}
