import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSettings } from "../../settings/settings";
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
    <Box
      sx={{
        margin: "0 auto",
        padding: "100px",
        backgroundColor: "background.paper",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "16px", textAlign: "center" }}>
        Settings
      </Typography>

      <Box sx={{ marginBottom: "16px" }}>
        <TextField
          fullWidth
          type="number"
          label="Corners Confidence"
          value={cornersConf || CORNERS_CONFIDENCE}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 1) setCornersConf(value);
          }}
          inputProps={{ step: 0.05, min: 0.1, max: 1 }}
          variant="outlined"
          sx={{ marginBottom: "16px" }}
        />
      </Box>

      <Box sx={{ marginBottom: "16px" }}>
        <TextField
          fullWidth
          type="number"
          label="Pieces Confidence"
          value={piecesConf || PIECES_CONFIDENCE}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 1) setPiecesConf(value);
          }}
          inputProps={{ step: 0.05, min: 0.1, max: 1 }}
          variant="outlined"
          sx={{ marginBottom: "16px" }}
        />
      </Box>

      <Box sx={{ marginBottom: "16px" }}>
        <TextField
          fullWidth
          type="number"
          label="Detect Frequency (ms)"
          value={detectFrequency || DETECT_FREQUENCY}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0) setDetectFrequency(value);
          }}
          inputProps={{ step: 100, min: 1000 }}
          variant="outlined"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "16px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={resetConfidences}
          sx={{ width: "100%" }}
        >
          Reset Confidences
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={resetDetectFrequency}
          sx={{ width: "100%" }}
        >
          Reset Frequency
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            resetConfidences();
            resetDetectFrequency();
          }}
          sx={{ width: "100%" }}
        >
          Reset All
        </Button>
      </Box>
    </Box>
  );
}
