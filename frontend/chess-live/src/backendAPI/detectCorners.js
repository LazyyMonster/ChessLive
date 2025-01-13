import React, { useState } from "react";
import { useCapture } from "../components/camera/captureContext";
import CanvasOverlay from "../components/camera/canvasOverlay";
import { useSettings } from "../components/settings/settings";
import CameraView from "../components/camera/cameraView";
import Button from "@mui/material/Button";
import { showSnackbar } from "../components/alerts/customSnackbar";
import { cornersRequest } from "./apiUtils";
import { useGlobalVariables } from "../globalVariables/globalVariables";

export default function DetectCorners() {
  const { capture, setWebcamRef } = useCapture();
  const { cornersConf } = useSettings();
  const { setDetectedCorners } = useGlobalVariables();
  const [loading, setLoading] = useState(false);


  const handleCapture = async () => {
    const image = capture();
    if (!image) {
      showSnackbar("No image captured to send.", "error");
      return;
    }
    if (image) {
      setLoading(true);
      await cornersRequest(image, cornersConf, setDetectedCorners);
      setLoading(false);
    }
    else {
      showSnackbar("Enable camera to detect corners!", "info");
    }
  };


  return (
    <div style={{ flexDirection: "column", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <CameraView ref={setWebcamRef} />
        <CanvasOverlay />
      </div>

      <Button
        variant="contained"
        onClick={handleCapture}
        color="secondary"
        disabled={loading}
        sx={{
          // marginTop: "10px",
          width: "100%",
        }}
      >
        {loading ? "Detecting..." : "Detect Corners"}
      </Button>

    </div>
  );
}
