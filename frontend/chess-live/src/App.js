import React, { useState } from "react";
import axios from "axios";
import { Chess } from 'chess.js'
import './App.css';
import Button from '@mui/material/Button';
import ResponsiveAppBar from "./components/navbar/navbar";
import CustomChessboard from "./components/chessboard/chessboard";
import CameraVideo from "./components/camera/camera";
import './components/camera/camera.css'
import Webcam from "react-webcam";
import WebcamImage from "./components/camera/webcamImage";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import ConfidenceInput from "./components/settings/modelConfidence/confidenceInput";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cornerConf, setCornerConf] = useState(0.6);
  const [piecesConf, setPiecesConf] = useState(0.6);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const [error, setError] = useState(null);
  

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const url = `http://127.0.0.1:8000/fen_from_image/?corner_conf=${cornerConf}&pieces_conf=${piecesConf}`;

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFen(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while fetching FEN.");
      setFen(null);
    }
  };

  return (
    <div className="App">
      <ResponsiveAppBar></ResponsiveAppBar>
      <div>
        <h1>Chessboard FEN Generator</h1>
        <div>
        <ConfidenceInput
            cornerConf={cornerConf}
            setCornerConf={setCornerConf}
            piecesConf={piecesConf}
            setPiecesConf={setPiecesConf}
          />
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange}
              multiple
            />
          </Button>
        </div>        
        <div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {fen && <pre>{JSON.stringify(fen, null, 2)}</pre>}
        </div>
        <CustomChessboard fen={fen}></CustomChessboard>
      </div>
      {/* <div className="CameraField">
        <CameraVideo></CameraVideo>
      </div> */}

      <div className="App">
      <Webcam />
    </div>
      
    </div>
  );
}

export default App;
