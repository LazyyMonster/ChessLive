import React from "react";
import './playContainer.css'
import CustomChessboard from "../chessboard/chessboard";
import ChessPGNBreadcrumbs from "../pgn/pgnArea";
import DetectCorners from "../../backendAPI/detectCorners";
import { useChess } from "../../chessLogic/chessGame";


export default function PlayContainer({ game, fen, detectedCorners, setDetectedCorners }) {

  // React.useEffect(() => {
  //   console.log("Detected corners passed to PlayContainer:", detectedCorners);
  // }, [detectedCorners]);

  
  return (
    <div className="parent">
      <div className="left">
        <CustomChessboard></CustomChessboard>
      </div>

      <div className="right">
        <div className="pgn">
          <ChessPGNBreadcrumbs/>
        </div>

        <div className="webcam">
          <DetectCorners
            setDetectedCorners={setDetectedCorners}
          ></DetectCorners>
        </div>
      </div>
    </div>
  );
}
