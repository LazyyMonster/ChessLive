import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useCapture } from './captureContext';
import CanvasOverlay from '../components/camera/canvasOverlay'

export default function DetectCorners() {
  const webcamRef = useRef(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [cornerConf, setCornerConf] = useState(0.5);

  const { capture, setWebcamRef } = useCapture();
  const [corners, setCorners] = useState([]);

  const capturedImageWidth = 3840;
  const capturedImageHeight = 2160;

  const videoWidth = 1920;
  const videoHeight = 1080;

  React.useEffect(() => {
    console.log("Setting webcamRef in context...");
    setWebcamRef(webcamRef);
  }, [setWebcamRef]);

  const handleCapture = () => {
    console.log("handleCapture called. webcamRef:", webcamRef.current);
    const image = capture();
    if (image) {
      sendReq(image);
    }
  };

  const sendReq = useCallback(async (imageSrc) => {
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

      const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);

      const url = `http://127.0.0.1:8000/detect_corners/?corner_conf=${cornerConf}`;
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(response.data);
      setCorners(response.data.corners || []);
      setError(null);
      console.log(response);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while processing the image.");
      setResponse(null);
    }
  }, []);

  return (
    <>
      <button onClick={handleCapture}>Detect Corners</button>

      <div style={{
        position: "relative"
      }}>

        <Webcam
          ref={webcamRef}
          screenshotQuality={1}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: { ideal: videoWidth },
            height: { ideal: videoHeight },
            facingMode: "environment",
          }}
          disablePictureInPicture={true}
          style={{
            maxWidth: "100%",
            maxHeight: "100%"
          }}
        />
        <CanvasOverlay
          corners={corners}
          videoWidth={videoWidth}
          videoHeight={videoHeight}
          capturedImageWidth={capturedImageWidth}
          capturedImageHeight={capturedImageHeight}
        />

        {/* 
      {error && <div className="error">{error}</div>}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>} */}
      </div>
    </>
  );
}