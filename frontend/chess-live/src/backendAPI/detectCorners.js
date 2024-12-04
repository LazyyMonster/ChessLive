import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function DetectCorners() {
  const webcamRef = useRef(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [cornerConf, setCornerConf] = useState(0.5); // Confidence parameter for corners
  const [img, setImg] = useState(null);


  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // console.log("Captured image src:", imageSrc); // Ensure it's a valid image
    if (imageSrc) {
      const imgElement = new Image();
      imgElement.onload = () => {
        console.log(`Captured image size: ${imgElement.width}x${imgElement.height}`);
      };
      imgElement.src = imageSrc;
    
      sendReq(imageSrc);
    }
  }, [webcamRef]);

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
  
  

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "environment",
  };

  return (
    <div className="Container">
      {/* Webcam Component */}
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />

      {/* Confidence Parameters */}
      <div>
        <label>
          Corner Confidence:
          <input
            type="number"
            value={cornerConf}
            onChange={(e) => setCornerConf(e.target.value)}
            step="0.1"
            min="0"
            max="1"
          />
        </label>
      </div>
  

      {/* Submit Button */}
      <button onClick={capture}>Detect Corners</button>

      {/* Display Errors */}
      {error && <div className="error">{error}</div>}

      {/* Display Response */}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}

      <img src={img}></img>
    </div>
  );
}
