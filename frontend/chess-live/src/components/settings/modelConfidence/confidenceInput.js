import React from "react";

export default function ConfidenceInput({ cornerConf, setCornerConf, piecesConf, setPiecesConf }) {
  return (
    <>
      <div>
        <label>
          Corner Confidence:
          <input
            type="number"
            value={cornerConf} // Use the value from the prop
            onChange={(e) => setCornerConf(parseFloat(e.target.value))} // Update parent state
            step="0.1"
            min="0"
            max="1"
          />
        </label>
      </div>
      <div>
        <label>
          Pieces Confidence:
          <input
            type="number"
            value={piecesConf} // Use the value from the prop
            onChange={(e) => setPiecesConf(parseFloat(e.target.value))} // Update parent state
            step="0.1"
            min="0"
            max="1"
          />
        </label>
      </div>
    </>
  );
}
