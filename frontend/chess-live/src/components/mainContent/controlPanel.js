import React from "react";
import './playContainer.css'

import DetectPieces from "../../backendAPI/detectPieces";


export default function ControlPanel({ game, detectedCorners, setFen }) {
  
  return (
    <div className="parent">
        <DetectPieces
            corners={detectedCorners}
            setFen={setFen}
          />
      
    </div>
  );
}
