
import Webcam from "react-webcam";


export default function CameraView(cameraId) {
  const videoConstraints = {
    // width: { min: 480 },
    // height: { min: 480 },
    facingMode: { exact: "environment" }
  };

  console.log("camera view id", cameraId);

  return (
    <Webcam width={240} height={240} videoConstraints={cameraId} />
  );
}
