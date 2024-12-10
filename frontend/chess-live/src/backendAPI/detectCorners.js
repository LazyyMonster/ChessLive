import React, { useCallback, useState } from "react";
import axios from "axios";
import { useCapture } from "../components/camera/captureContext";
import CanvasOverlay from "../components/camera/canvasOverlay";
import { useSettings } from "../components/settings/settings";
import CameraView from "../components/camera/cameraView";

export default function DetectCorners() {
  const { capture, setWebcamRef } = useCapture(); // Capture context
  const { cornerConf, setDetectedCorners } = useSettings(); // Settings context
  const [error, setError] = useState(null);

  const handleCapture = () => {
    console.log("handleCapture called. webcamRef:", setWebcamRef);
    const image = capture(); // Capture image from webcam
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

        // Convert base64 image to a blob
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

        const url = `http://127.0.0.1:8000/detect_corners/?corner_conf=${cornerConf}`;
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const detectedCorners = response.data.corners || [];
        setError(null);

        console.log("Detected corners in DetectCorners:", detectedCorners);
        setDetectedCorners(detectedCorners);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "An error occurred while processing the image."
        );
      }
    },
    [cornerConf, setDetectedCorners]
  );

  return (
    <div style={{ flexDirection: "column" }}>
      <div style={{ position: "relative" }}>
        {/* Pass setWebcamRef to CameraView */}
        <CameraView ref={setWebcamRef} />
        <CanvasOverlay />
      </div>

      <button
        onClick={handleCapture}
        style={{
          marginTop: "10px",
          display: "block",
          margin: "0 auto",
        }}
      >
        Detect Corners
      </button>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </div>
  );
}
