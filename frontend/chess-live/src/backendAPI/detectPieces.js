import axios from "axios";
import React, { useEffect, useCallback } from "react";
import { useSettings } from "../components/settings/settings";
import { useChess } from "../chessGame/chessGame";
import { useLichess } from "../lichessAPI/lichessGame";
import { showSnackbar } from "../components/alerts/customSnackbar";
import { BACKEND_URL } from "../components/settings/constants";

export default function DetectPieces({ image, setFenDetected }) {
    const { detectedCorners, piecesConf } = useSettings();
    const { makeMove, returnAndMakeMove, findMove, isPlayingOnline, getFen, getHistory, result } = useChess();
    const { sendMove, playerColor } = useLichess();

    const sendReq = async () => {
        if (!detectedCorners) {
            showSnackbar(`Before starting following, you must detect 4 corners.`, "error");
            return;
        }

        if (!image) {
            showSnackbar("No image available for detection.", "error");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/fen/`, {
                image,
                corners: detectedCorners,
                pieces_conf: piecesConf,
            });

            const fenDetected = response.data.fen;
            setFenDetected(fenDetected);
            handleMove(fenDetected);
        } catch (err) {
            showSnackbar("Failed to detect pieces.", "error");
        }
    };

    const handleMove = useCallback((fenDetected) => {
        if (result !== "ongoing") {
            return;
        }

        if (!isPlayingOnline) {
            const detectedMove = findMove(fenDetected);
            if (detectedMove) {
                makeMove(detectedMove);
            }
            return;
        }

        const moves = getHistory();
        const isPlayerTurn =
            (playerColor === "white" && moves.length % 2 === 0) ||
            (playerColor === "black" && moves.length % 2 !== 0);

        if (isPlayerTurn) {
            const detectedMove = findMove(fenDetected);
            if (detectedMove) {
                const playerMove = returnAndMakeMove(detectedMove);
                sendMove(playerMove);
            }
        }
    }, [isPlayingOnline, findMove, makeMove, getFen, getHistory, playerColor, sendMove, returnAndMakeMove]);

    useEffect(() => {
        if (image) {
            sendReq(image);
        }
    }, [image, detectedCorners, piecesConf]);

}
