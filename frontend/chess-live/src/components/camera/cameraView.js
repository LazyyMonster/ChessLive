import React, { forwardRef } from "react";
import Webcam from "react-webcam";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "../settings/constants";
import { useCapture } from "./captureContext";

const CameraView = forwardRef((props, ref) => {
  const { setWebcamRef } = useCapture(); // Access the context function to set the webcam reference

  const videoConstraints = {
    width: { ideal: VIDEO_WIDTH },
    height: { ideal: VIDEO_HEIGHT },
    facingMode: "environment",
  };

  return (
    <Webcam
      audio={false}
      ref={(webcamInstance) => {
        setWebcamRef(webcamInstance); // Pass the ref to the context function
        if (ref) ref.current = webcamInstance; // Handle forwarded ref, if provided
      }}
      screenshotQuality={1}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
      disablePictureInPicture={true}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
      }}
      {...props} // Pass through any additional props
    />
  );
});

export default CameraView;
