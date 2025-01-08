import React, { forwardRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "../settings/constants";
import { useCapture } from "./captureContext";
import { Skeleton } from "@mui/material";

const CameraView = forwardRef((props, ref) => {
  const { setWebcamRef, webcamRef } = useCapture();
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  const videoConstraints = {
    width: { ideal: VIDEO_WIDTH },
    height: { ideal: VIDEO_HEIGHT },
    facingMode: "environment",
  };

  const aspectRatio = VIDEO_WIDTH / VIDEO_HEIGHT;

  useEffect(() => {
    if (webcamRef?.current) {
      console.log("Webcam is ready");
    }
  }, [webcamRef]);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        paddingTop: `${100 / aspectRatio}%`,
        backgroundColor: "#000",
      }}
    >
      {/* Skeleton placeholder */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{ bgcolor: "grey.900" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Camera */}
      <Webcam
        audio={false}
        ref={(webcamInstance) => {
          setWebcamRef(webcamInstance);
          if (ref) {
            ref.current = webcamInstance;
            setIsWebcamReady(true);
          }
        }}
        screenshotQuality={1}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        disablePictureInPicture={true}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          objectFit: "cover", 
        }}
        {...props}
      />
    </div>
  );
});

export default CameraView;
