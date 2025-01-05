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

    useEffect(() => {
      if (webcamRef.current) {
        setIsWebcamReady(true);
      } else {
        setIsWebcamReady(false);
      }
    }, [webcamRef]);

  return (
    <>
      <Webcam
        audio={false}
        ref={(webcamInstance) => {
          setWebcamRef(webcamInstance);
          if (ref) ref.current = webcamInstance;
        }}
        screenshotQuality={1}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        disablePictureInPicture={true}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        {...props}
      />

      <Skeleton variant="rectangular" width={"100%"} height={"100%"} animation="wave"/>
    </>
  );
});

export default CameraView;
