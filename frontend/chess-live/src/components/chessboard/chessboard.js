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
    toggleAnalysisMode,
    analysisMode,
    goToNextMove,
    goToPreviousMove,
  } = useChess();

  const [fenDetected, setFenDetected] = useState("");

  const handleKeyDown = (e) => {
    if (!analysisMode) return;

    if (e.key === "ArrowRight") {
      goToNextMove();
    } else if (e.key === "ArrowLeft") {
      goToPreviousMove();
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [analysisMode]);

  return (
    <>
      <div className="CustomBoard">
        <h1>{analysisMode ? "Analysis Mode" : "Live Position"}</h1>
        <Chessboard position={fen} boardWidth={500} />
        <Stack direction="row" spacing={2} sx={{ marginTop: "16px" }}>
          <Button
            variant="contained"
            onClick={toggleAnalysisMode}
          >
            {analysisMode ? "Return To Live Mode" : "Enable Analysis Mode"}
          </Button>
          {!analysisMode && <UpdateGame setFenDetected={setFenDetected} />}
          {analysisMode && (
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
      </div>
    </>
  );
}
