import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useChess } from "../../../../chessGame/chessGame";

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
    <div>
      <h1>PGN</h1>
      <Breadcrumbs className="pgnArea" aria-label="chess moves" separator="">
        {moves.map((move, index) => {
          const isWhiteMove = index % 2 === 0;
          const moveNumber = Math.floor(index / 2) + 1;

          return isWhiteMove ? (
            <span key={index}>
              <Typography
                color="textPrimary"
                sx={{ display: "inline", marginRight: "4px" }}
              >
                {moveNumber}.
              </Typography>
              <Link
                color="inherit"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMoveClick(index);
                }}
                sx={{
                  textDecoration: isAnalysisMode ? "underline" : "none",
                  cursor: isAnalysisMode ? "pointer" : "default",
                }}
              >
                {move}
              </Link>
            </span>
          ) : (
            <Link
              key={index}
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleMoveClick(index);
              }}
              sx={{
                textDecoration: isAnalysisMode ? "underline" : "none",
                cursor: isAnalysisMode ? "pointer" : "default",
              }}
            >
              {move}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
