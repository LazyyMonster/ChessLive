import React from "react";
import './playContainer.css'
import CustomChessboard from "../chessboard/chessboard";
import ChessPGNBreadcrumbs from "../pgn/pgnArea";
import DetectCorners from "../../backendAPI/detectCorners";


export default function PlayContainer({ game, fen}) {
  return (
    <div className="parent">
      <div className="left">
        <CustomChessboard fen={fen}></CustomChessboard>
      </div>

      <div className="right">
        <div className="pgn">
          <ChessPGNBreadcrumbs moves={game.history()} />
        </div>

        <div className="webcam">
          <DetectCorners></DetectCorners>
        </div>
      </div>
    </div>
  );
}
