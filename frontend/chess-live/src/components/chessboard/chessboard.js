import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { useChess } from "../../chessLogic/chessGame";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import UpdateGame from "../../backendAPI/updateGame";
import LiveChessboard from "./detectedBoard";


export default function CustomChessboard() {
  const {
    fen,
    lastMove,
    toggleAnalysisMode,
    isAnalysisMode,
    goToNextMove,
    goToPreviousMove,
    resetGame,
    loadPreviewGame,
  } = useChess();

  const [fenDetected, setFenDetected] = useState("");

  const highlightLastMove = () => {
    if (!lastMove) return {};
    const { from, to } = lastMove;
    return {
      [from]: { backgroundColor: "rgba(255, 190, 0, 0.5)" },
      [to]: { backgroundColor: "rgba(255, 190, 0, 0.5)" },
    };
  };

  return (
    <>
      <div className="CustomBoard">
        <h1>{isAnalysisMode ? "Analysis Mode" : "Live Position"}</h1>
        <Chessboard position={fen} boardWidth={500} customSquareStyles={highlightLastMove()} />
        <Stack direction="row" spacing={2} sx={{ marginTop: "16px" }}>
          <Button
            variant="contained"
            onClick={toggleAnalysisMode}
          >
            {isAnalysisMode ? "Return To Live Mode" : "Enable Analysis Mode"}
          </Button>
          {!isAnalysisMode && <UpdateGame setFenDetected={setFenDetected} />}
          {isAnalysisMode && (
            <>
              <Button
                variant="outlined"
                onClick={goToPreviousMove}
              >
                Previous Move
              </Button>
              <Button
                variant="outlined"
                onClick={goToNextMove}
              >
                Next Move
              </Button>
            </>
          )}
        </Stack>
      </div>
      <div className="LiveBoard">
        <LiveChessboard fenDetected={fenDetected} />
        <Button
          variant="outlined"
          onClick={resetGame}
        >
          Reset Game
        </Button>
        <Button
          variant="outlined"
          onClick={loadPreviewGame}
        >
          Load Preview Game
        </Button>
      </div>
    </>
  );
}
