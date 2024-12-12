import React, { useState } from "react";
import CustomChessboard from "./chessboard";
import ChessPGNBreadcrumbs from "../pgn/pgnArea";
import Button from "@mui/material/Button";
import { useChess } from "../../chessLogic/chessGame";
import { Chess } from 'chess.js';

export default function ChessGameController() {
  const { getFen, getPgn } = useChess();
  const [analysisMode, setAnalysisMode] = useState(false);
  const [currentFen, setCurrentFen] = useState(getFen());

  const handleMoveClick = (moveIndex) => {
    const pgn = getPgn();
    const moves = pgn.split(" ").filter((token) => !/^\d+\.$/.test(token));
    const movesUntilClicked = moves.slice(0, moveIndex).join(" ");
    const tempGame = new Chess();
    tempGame.loadPgn(movesUntilClicked);
    setCurrentFen(tempGame.fen());
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setAnalysisMode(!analysisMode)}
        sx={{ marginBottom: "16px" }}
      >
        {analysisMode ? "Disable Analysis Mode" : "Enable Analysis Mode"}
      </Button>

      <CustomChessboard fen={currentFen} />
      <ChessPGNBreadcrumbs
        onMoveClick={handleMoveClick}
        analysisMode={analysisMode}
      />
    </div>
  );
}
