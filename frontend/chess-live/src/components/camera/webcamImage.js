import Webcam from "react-webcam";
import React, { useState, useRef, useCallback } from "react";

export default function WebcamImage() {
  const webcamRef = useRef(null);
  const [img, setImg] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const imgElement = new Image();
      imgElement.onload = () => {
        console.log(`Captured image size: ${imgElement.width}x${imgElement.height}`);
      };
      imgElement.src = imageSrc; // Set the source to the captured base64 image
    }
    setImg(imageSrc);
  }, [webcamRef]);

  const videoConstraints = {
    width: 4000,
    height: 2250,
    facingMode: "environment",
  };

  return (
    <div className="Container">
      {img === null ? (
        <>
          <Webcam
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            audio={false}
            ref={webcamRef}
          />
          <button onClick={capture}>Capture photo</button>
        </>
      ) : (
        <>
          <img src={img} alt="screenshot" />
          <button onClick={() => setImg(null)}>Recapture</button>
        </>
      )}
    </div>
  );
}