
import Webcam from "react-webcam";


function CameraVideo() {
    const videoConstraints = {
      width: { min: 480 },
      height: { min: 720 },
      facingMode: { exact: "environment" }
    };
  
    return (
      <div className="App">
        <Webcam width={480} height={720} videoConstraints={videoConstraints} />
      </div>
    );
  }

  export default CameraVideo;