import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function CaptureImage() {
  const webcamRef = useRef(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [cornerConf, setCornerConf] = useState(0.5);
  const [img, setImg] = useState(null);


  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot({width: 4000, height: 2250});
    if (imageSrc) {
      const imgElement = new Image();
      imgElement.onload = () => {
        console.log(`Captured image size: ${imgElement.width}x${imgElement.height}`);
      };
      imgElement.src = imageSrc;
    }
  }, [webcamRef]);
  

  const videoConstraints = {
    facingMode: "environment",
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotQuality= {1}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        disablePictureInPicture= {true}
        style={{
          maxWidth: "100%",
          maxHeight: "100%"
        }}
      />

      <button onClick={capture}>Detect Corners</button>
{/* 
      {error && <div className="error">{error}</div>}

      {response && <pre>{JSON.stringify(response, null, 2)}</pre>} */}

    </div>
  );
}
