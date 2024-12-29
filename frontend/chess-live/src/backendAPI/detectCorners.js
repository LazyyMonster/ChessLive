import React, { useCallback, useState } from "react";
import axios from "axios";
import { useCapture } from "../components/camera/captureContext";
import CanvasOverlay from "../components/camera/canvasOverlay";
import { useSettings } from "../components/settings/settings";
import CameraView from "../components/camera/cameraView";
import Button from "@mui/material/Button";
import { showSnackbar } from "../components/alerts/customSnackbar";

export default function DetectCorners() {
  const { capture, setWebcamRef } = useCapture();
  const { cornersConf, setDetectedCorners } = useSettings();
  const [error, setError] = useState(null);

  const handleCapture = () => {
    const image = capture();
    if (image) {
      sendReq(image);
    }
  };

  const sendReq = useCallback(
    async (imageSrc) => {
      try {
        if (!imageSrc) {
          setError("No image captured to send.");
          return;
        }

        const base64Data = imageSrc.split(",")[1];
        const binary = atob(base64Data);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: "image/jpeg" });

        const file = new File([blob], "detect_corners.jpg", { type: "image/jpeg" });

        const formData = new FormData();
        formData.append("file", file);

        const url = `http://127.0.0.1:8000/detect_corners/?corner_conf=${cornersConf}`;
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const detectedCorners = response.data.corners || [];
        const cornerKeys = Object.keys(detectedCorners);
        if (cornerKeys.length !== 4) {
          showSnackbar("Try again detecting corners!", "error");
        }
        else {
          showSnackbar("Succesfully detected 4 corners!", "success");
        }
        setError(null);

        setDetectedCorners(detectedCorners);
      } catch (err) {
        setError(
          err.response?.data?.error ||
          "An error occurred while processing the image."
        );
      }
    },
    [cornersConf, setDetectedCorners]
  );

  return (
    <div style={{ flexDirection: "column" }}>
      <div style={{ position: "relative" }}>
        <CameraView ref={setWebcamRef} />
        <CanvasOverlay />
      </div>

      <Button
        variant="contained"
        onClick={handleCapture}
        style={{
          marginTop: "10px",
          display: "block",
          margin: "0 auto",
        }}
      >
        Detect Corners
      </Button>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </div>
  );
}
