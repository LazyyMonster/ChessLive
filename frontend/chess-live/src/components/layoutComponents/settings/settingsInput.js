import React from "react";
import { useSettings } from '../../settings/settings';

export default function SettingsInput() {
  const {
    cornerConf,
    setCornerConf,
    piecesConf,
    setPiecesConf,
    resetConfidences,
    detectFrequency,
    setDetectFrequency,
    resetDetectFrequency,
  } = useSettings();

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
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Detect Frequency (ms):
        </label>
        <input
          type="number"
          value={detectFrequency || 1000}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) setDetectFrequency(value);
          }}
          step="100"
          min="100"
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
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "0.5rem"
          }}
        >
          Reset Confidences
        </button>
        <button
          onClick={resetDetectFrequency}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "0.5rem"
          }}
        >
          Reset Frequency
        </button>
        <button
          onClick={() => {
            resetConfidences();
            resetDetectFrequency();
          }}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#ffc107",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
