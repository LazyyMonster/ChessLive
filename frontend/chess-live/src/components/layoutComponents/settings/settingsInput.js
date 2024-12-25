import React from "react";
import { useSettings } from "../../settings/settings";
import "./settingsInput.css";

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
    <div className="settings-input-container">
      <div className="settings-input-group">
        <label className="settings-input-label">Corner Confidence:</label>
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
          className="settings-input-field"
        />
      </div>
      <div className="settings-input-group">
        <label className="settings-input-label">Pieces Confidence:</label>
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
          className="settings-input-field"
        />
      </div>
      <div className="settings-input-group">
        <label className="settings-input-label">Detect Frequency (ms):</label>
        <input
          type="number"
          value={detectFrequency || 2000}
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
