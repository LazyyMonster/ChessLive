import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useCapture } from './captureContext';


export default function DetectCorners() {
  const webcamRef = useRef(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [cornerConf, setCornerConf] = useState(0.5);

  const { capture, setWebcamRef } = useCapture()

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

      // Convert base64 to Blob
      const base64Data = imageSrc.split(",")[1];
      const binary = atob(base64Data);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      const blob = new Blob([new Uint8Array(array)], { type: "image/jpeg" });

      // Create a File from Blob
      const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);

      const url = `http://127.0.0.1:8000/detect_corners/`;
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResponse(response.data);
      setError(null);
      console.log(response);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while processing the image.");
      setResponse(null);
    }
  }, []);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotQuality={1} 
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment",
        }}
        disablePictureInPicture={true}
        style={{
          maxWidth: "100%",
          maxHeight: "100%"
        }}
      />

      <button onClick={handleCapture}>Detect Corners</button>
      {/* 
      {error && <div className="error">{error}</div>}

      {response && <pre>{JSON.stringify(response, null, 2)}</pre>} */}

    </div>
  );
}
