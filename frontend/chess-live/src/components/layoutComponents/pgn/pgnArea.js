import React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useChess } from "../../../chessGame/chessGame";
import { useTheme } from '@mui/material/styles';

export default function ChessPGNBreadcrumbs() {
  const { getPgn, isAnalysisMode, goToMove, result } = useChess();
  const theme = useTheme();

  const pgn = getPgn();
  const moves = pgn
    .split(" ")
    .filter((token) => !/^\d+\.$/.test(token))
    .filter(Boolean);

  const handleMoveClick = (index) => {
    goToMove(index);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.primary.dark,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 2,
          textAlign: "center",
          position: "sticky",
          top: "0",
          zIndex: "1",
          paddingTop: "20px",
          color: theme.palette.primary.contrastText,
        }}
      >
        PGN
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            flexWrap: "wrap",
            overflowY: "auto",
            maxHeight: "350px",
          }}
        >
          {moves.map((move, index) => {
            const moveNumber = Math.floor(index / 2) + 1;
            const isWhiteMove = index % 2 === 0;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {isWhiteMove ? (
                  <>
                    {/* Move number */}
                    <Typography
                      color="primary.contrastText"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      {moveNumber}.
                    </Typography>
                    {/* White move */}
                    <Link
                      color="primary.contrastText"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMoveClick(index);
                      }}
                      sx={{
                        textDecoration: isAnalysisMode ? "underline" : "none",
                        cursor: isAnalysisMode ? "pointer" : "default",
                        "&:hover": {
                          color: isAnalysisMode
                            ? theme.palette.primary.light
                            : theme.palette.primary.contrastText,
                        },
                      }}
                    >
                      {move}
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Black move */}
                    <Link
                      color="primary.contrastText"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMoveClick(index);
                      }}
                      sx={{
                        textDecoration: isAnalysisMode ? "underline" : "none",
                        cursor: isAnalysisMode ? "pointer" : "default",
                        "&:hover": {
                          color: isAnalysisMode
                            ? theme.palette.primary.light
                            : theme.palette.primary.contrastText,
                        },
                      }}
                    >
                      {move}
                    </Link>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

        {/* Result Footer */}
      {result !== "ongoing" && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            position: "sticky",
            bottom: "0",
            zIndex: "1",
            padding: "20px 0",
            color: theme.palette.primary.contrastText,
          }}
        >
          Result: {result}
        </Typography>
      )}
    </div>
  );
}
