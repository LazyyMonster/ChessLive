import React from "react";
import Webcam from "react-webcam";


export default function CameraView() {

  const videoConstraints = {
    facingMode: { exact: "environment" }
  };

  return (
    <Webcam 
    style={{
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "cover",
    }}
    />
  );
}