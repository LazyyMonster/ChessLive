import React from "react";
import { useSettings } from "../../settings/settings";
import "./settingsInput.css";
import { CORNERS_CONFIDENCE, DETECT_FREQUENCY, PIECES_CONFIDENCE } from "../../settings/constants";

export default function SettingsInput() {
  const {
    cornersConf,
    setCornersConf,
    piecesConf,
    setPiecesConf,
    resetConfidences,
    detectFrequency,
    setDetectFrequency,
    resetDetectFrequency,
  } = useSettings();

  return (
    <div className="settings-input-container">
      <div className="settings-input-group">
        <label className="settings-input-label">Corners Confidence:</label>
        <input
          type="number"
          value={cornersConf || CORNERS_CONFIDENCE}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 1) setCornersConf(value);
          }}
          step="0.05"
          min="0"
          max="1"
          className="settings-input-field"
        />
      </div>
      <div className="settings-input-group">
        <label className="settings-input-label">Pieces Confidence:</label>
        <input
          type="number"
          value={piecesConf || PIECES_CONFIDENCE}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 1) setPiecesConf(value);
          }}
          step="0.05"
          min="0"
          max="1"
          className="settings-input-field"
        />
      </div>
      <div className="settings-input-group">
        <label className="settings-input-label">Detect Frequency (ms):</label>
        <input
          type="number"
          value={detectFrequency || DETECT_FREQUENCY}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) setDetectFrequency(value);
          }}
          step="100"
          min="100"
          className="settings-input-field"
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          onClick={resetConfidences}
          className="settings-input-button reset-confidences"
        >
          Reset Confidences
        </button>
        <button
          onClick={resetDetectFrequency}
          className="settings-input-button reset-frequency"
        >
          Reset Frequency
        </button>
        <button
          onClick={() => {
            resetConfidences();
            resetDetectFrequency();
          }}
          className="settings-input-button reset-all"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
