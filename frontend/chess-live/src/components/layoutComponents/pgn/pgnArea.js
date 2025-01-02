import React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useChess } from "../../../chessGame/chessGame";

export default function ChessPGNBreadcrumbs() {
  const { getPgn, isAnalysisMode, goToMove } = useChess();

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
      
        backgroundColor: "#f9f9f9",
        height: "100%",
        width: "100%"
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
          backgroundColor: "#f9f9f9",
          zIndex: "1",
          paddingTop: "20px",
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
                      color="textSecondary"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      {moveNumber}.
                    </Typography>
                    {/* White vove */}
                    <Link
                      color={isAnalysisMode ? "primary" : "inherit"}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMoveClick(index);
                      }}
                      sx={{
                        textDecoration: isAnalysisMode ? "underline" : "none",
                        cursor: isAnalysisMode ? "pointer" : "default",
                        "&:hover": {
                          color: isAnalysisMode ? "secondary.main" : "inherit",
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
                      color={isAnalysisMode ? "primary" : "inherit"}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMoveClick(index);
                      }}
                      sx={{
                        textDecoration: isAnalysisMode ? "underline" : "none",
                        cursor: isAnalysisMode ? "pointer" : "default",
                        "&:hover": {
                          color: isAnalysisMode ? "secondary.main" : "inherit",
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
    </div>
  );
}
