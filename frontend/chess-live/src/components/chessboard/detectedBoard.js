import React from "react";
import { Chessboard } from "react-chessboard";


export default function LiveChessboard({ fenDetected }) {

  return (
    <>
      <h1>Detected Pieces</h1>
      <Chessboard position={fenDetected} boardWidth={250} arePiecesDraggable={false} animationDuration={200} />
    </>
  );
}