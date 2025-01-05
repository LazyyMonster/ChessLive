import React, { useCallback, useState } from "react";
import axios from "axios";
import { useCapture } from "../components/camera/captureContext";
import CanvasOverlay from "../components/camera/canvasOverlay";
import { useSettings } from "../components/settings/settings";
import CameraView from "../components/camera/cameraView";
import Button from "@mui/material/Button";
import { showSnackbar } from "../components/alerts/customSnackbar";
import { BACKEND_URL } from "../components/settings/constants";

export default function DetectCorners() {
  const { capture, setWebcamRef } = useCapture();
  const { cornersConf, setDetectedCorners } = useSettings();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleCapture = async () => {
    const image = capture();
    if (image) {
      setLoading(true);
      await sendReq(image);
      setLoading(false);
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

        const url = `${BACKEND_URL}/detect_corners/?corner_conf=${cornersConf}`;
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
        color="secondary"
        disabled={loading} // Disable the button during loading
        sx={{
          // marginTop: "10px",
          width: "100%",
        }}
      >
        {loading ? "Detecting..." : "Detect Corners"}
      </Button>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </div>
  );
}
