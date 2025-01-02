import React from "react";
import './playContainer.css';
import CustomChessboard from "../../chessboard/chessboard";
import ChessPGNBreadcrumbs from "../pgn/pgnArea";
import DetectCorners from "../../../backendAPI/detectCorners";
import { LichessProvider } from "../../../lichessAPI/lichessGame";

export default function PlayContainer({ setDetectedCorners }) {


  return (
    <LichessProvider>
      <div className="parent">
        <div className="left">
          <CustomChessboard />
        </div>

        <div className="right">
          <div className="pgn">
            <ChessPGNBreadcrumbs />
          </div>

          <div className="webcam">
            <DetectCorners
              setDetectedCorners={setDetectedCorners}
            ></DetectCorners>
          </div>
        </div>
      </div>
    </LichessProvider>
  );
}
