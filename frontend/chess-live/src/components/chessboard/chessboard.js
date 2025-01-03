import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { useChess } from "../../chessGame/chessGame";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import UpdateGame from "../../backendAPI/updateGame";
import LiveChessboard from "./detectedBoard";
import MainControls from "../layoutComponents/buttons/mainControls";
import { ANIMATION_DURATION, BOARD_SIZE, HIGHLIGHTING_SQUARE_COLOR } from "../settings/constants";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";

export default function CustomChessboard() {
  const theme = useTheme();

  const {
    fen,
    lastMove,
    toggleAnalysisMode,
    isAnalysisMode,
    goToNextMove,
    goToPreviousMove,
    goToFirstMove,
    goToLastMove,
  } = useChess();

  const [fenDetected, setFenDetected] = useState("");

  const highlightLastMove = () => {
    if (!lastMove) return {};
    const { from, to } = lastMove;
    return {
      [from]: { backgroundColor: HIGHLIGHTING_SQUARE_COLOR },
      [to]: { backgroundColor: HIGHLIGHTING_SQUARE_COLOR },
    };
  };

  return (
    <>
      <div className="CustomBoard">
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.contrastText,
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {isAnalysisMode ? "Analysis Mode" : "Live Position"}
        </Typography>

        <Chessboard
          position={fen}
          boardWidth={BOARD_SIZE}
          customSquareStyles={highlightLastMove()}
          arePiecesDraggable={false}
          animationDuration={ANIMATION_DURATION}
        />
        <Stack direction="row" spacing={2} sx={{ marginTop: "16px" }}>
          <Button
            variant="contained"
            onClick={toggleAnalysisMode}
            color="secondary"
          >
            {isAnalysisMode ? "Return To Live" : "Enable Analysis"}
          </Button>
          {!isAnalysisMode && <UpdateGame setFenDetected={setFenDetected} />}
          {isAnalysisMode && (
            <>
              <Button
                variant="outlined"
                onClick={goToFirstMove}
                sx={{
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.contrastText,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                {"<<"}
              </Button>
              <Button
                variant="outlined"
                onClick={goToPreviousMove}
                sx={{
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.contrastText,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                {"<"}
              </Button>
              <Button
                variant="outlined"
                onClick={goToNextMove}
                sx={{
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.contrastText,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                {">"}
              </Button>
              <Button
                variant="outlined"
                onClick={goToLastMove}
                sx={{
                  color: theme.palette.primary.contrastText,
                  borderColor: theme.palette.primary.contrastText,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                {">>"}
              </Button>
            </>
          )}
        </Stack>
      </div>
      <div className="LiveBoard">
        <Stack direction="column" spacing={2} alignItems="center">
          <LiveChessboard fenDetected={fenDetected} />
          <MainControls />
        </Stack>
      </div>
    </>
  );
}
