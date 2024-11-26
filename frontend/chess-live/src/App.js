import React, { useState } from "react";
import axios from "axios";
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js'

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cornerConf, setCornerConf] = useState(0.6);
  const [piecesConf, setPiecesConf] = useState(0.6);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const [error, setError] = useState(null);
  

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
      <div>
        <h1>Chessboard FEN Generator</h1>
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <label>
            Corner Confidence:
            <input
              type="number"
              value={cornerConf}
              onChange={(e) => setCornerConf(parseFloat(e.target.value))}
              step="0.1"
              min="0"
              max="1"
            />
          </label>
        </div>
        <div>
          <label>
            Pieces Confidence:
            <input
              type="number"
              value={piecesConf}
              onChange={(e) => setPiecesConf(parseFloat(e.target.value))}
              step="0.1"
              min="0"
              max="1"
            />
          </label>
        </div>
        <div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {fen && <pre>{JSON.stringify(fen, null, 2)}</pre>}
        </div>
        <div>
          <Chessboard position={fen} boardWidth={500}>

          </Chessboard>
        </div>
      </div>
      
    </div>
  );
}

export default App;
