import React from "react";
import { Chessboard } from "react-chessboard";
import { useChess } from "../../chessLogic/chessGame";

const parseFen = (fen) => {
  const rows = fen.split(" ")[0].split("/");
  const board = [];
  rows.forEach((row) => {
    const parsedRow = [];
    for (let char of row) {
      if (isNaN(char)) {
        parsedRow.push(char);
      } else {
        for (let i = 0; i < parseInt(char); i++) {
          parsedRow.push(null);
        }
      }
    }
    board.push(parsedRow);
  });
  return board;
};

const findDifferences = (fen1, fen2) => {
  const board1 = parseFen(fen1);
  const board2 = fen2 ? parseFen(fen2) : Array(8).fill(Array(8).fill(null));
  const differences = {};

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board1[r][c] !== board2[r][c]) {
        const square = `${String.fromCharCode(97 + c)}${8 - r}`;
        differences[square] = { backgroundColor: "rgba(255, 0, 0, 0.5)" };
      }
    }
  }

  return differences;
};

export default function LiveChessboard({ fenDetected }) {
  const { getFen } = useChess();
  const actualFen = getFen().split(" ")[0];
  const squareStyles = findDifferences(actualFen, fenDetected);

  return (
    <>
      <h1>Detected Pieces</h1>
      <Chessboard
        position={fenDetected || "8/8/8/8/8/8/8/8"}
        boardWidth={250}
        arePiecesDraggable={false}
        animationDuration={200}
        customSquareStyles={squareStyles}
      />
    </>
  );
}