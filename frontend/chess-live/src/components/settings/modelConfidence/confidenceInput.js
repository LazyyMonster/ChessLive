import React from "react";
import { useSettings } from '../settings';

export default function ConfidenceInput() {
  const { cornerConf, setCornerConf, piecesConf, setPiecesConf, resetConfidences } = useSettings();

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Corner Confidence:
        </label>
        <input
          type="number"
          value={cornerConf || 0.5}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 1) setCornerConf(value);
          }}
          step="0.05"
          min="0"
          max="1"
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "1rem",
            boxSizing: "border-box"
          }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Pieces Confidence:
        </label>
        <input
          type="number"
          value={piecesConf || 0.5}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 1) setPiecesConf(value);
          }}
          step="0.05"
          min="0"
          max="1"
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "1rem",
            boxSizing: "border-box"
          }}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          onClick={resetConfidences}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
