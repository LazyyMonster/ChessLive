import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useChess } from "../../chessLogic/chessGame";
import { Chess } from 'chess.js';

export default function ChessPGNBreadcrumbs() {
  const { getPgn, analysisMode, updatePosition } = useChess();

  const pgn = getPgn();
  const moves = pgn
    .split(" ")
    .filter((token) => !/^\d+\.$/.test(token))
    .filter(Boolean);

  const handleMoveClick = (index) => {
    if (!analysisMode) return;

    const movesUntilClicked = moves.slice(0, index + 1).join(" ");
    const tempGame = new Chess();
    tempGame.loadPgn(movesUntilClicked);
    updatePosition(tempGame.fen());
  };

  return (
    <div>
      <h1>PGN</h1>
      <Breadcrumbs className="pgnArea" aria-label="chess moves" separator="">
        {moves.map((move, index) => {
          const isWhiteMove = index % 2 === 0;
          const moveNumber = Math.floor(index / 2) + 1;

          return (
            <React.Fragment key={index}>
              {isWhiteMove && (
                <Typography
                  color="textPrimary"
                  sx={{ display: "inline", marginRight: "4px" }}
                >
                  {moveNumber}.
                </Typography>
              )}
              <Link
                color="inherit"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleMoveClick(index);
                }}
                sx={{
                  textDecoration: analysisMode ? "underline" : "none",
                  cursor: analysisMode ? "pointer" : "default",
                }}
              >
                {move}
              </Link>
            </React.Fragment>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}