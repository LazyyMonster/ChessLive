import React from "react";
import { useSettings } from '../settings';


export default function ConfidenceInput() {
  const { cornerConf, setCornerConf, piecesConf, setPiecesConf, resetConfidences } = useSettings();

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Corner Confidence:
          <input
            type="number"
            value={cornerConf || 0.5}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value >= 0 && value <= 1) setCornerConf(value);
            }}
            step="0.1"
            min="0"
            max="1"
          />
        </label>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Pieces Confidence:
          <input
            type="number"
            value={piecesConf || 0.5}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value >= 0 && value <= 1) setPiecesConf(value);
            }}
            step="0.1"
            min="0"
            max="1"
          />
        </label>
      </div>
      <div>
        <button onClick={resetConfidences} style={{ marginTop: "1rem" }}>
          Reset to Defaults
        </button>
      </div>
    </>
  );
}
