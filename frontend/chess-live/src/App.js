import React, { useState } from "react";
import axios from "axios";
import { Chess } from 'chess.js'
import './App.css';
import ResponsiveAppBar from "./components/navbar/navbar";
import WebcamImage from "./components/camera/webcamImage";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import PlayContainer from "./components/container/playContainer";


function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cornerConf, setCornerConf] = useState(0.6);
  const [piecesConf, setPiecesConf] = useState(0.6);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const [error, setError] = useState(null);
  const [pgn, setPgn] = useState(`1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7`)

  const [detectedCorners, setDetectedCorners] = useState(null);

  // const [moves, setMoves] = useState(null);
  // game.move('e4');
  // game.move('e5');
  // game.move('f4');
  // game.move('exf4');
 
  // console.log(game.moves());
  // game.move("e4")
  // game.move("e5");
  // game.move("f4");
  // game.move("exf4");
  // console.log(game.history());
  // game.loadPgn('1. e4 d5 2. e5 e6 3. d4 c5 4. Be3 Nc6 5. Bb5 Qa5+ 6. Nc3 cxd4 7. Bxd4 Bb4 8. Bxc6+ bxc6 9. Ne2 c5 10. Be3 d4 11. Bd2 dxc3 12. bxc3 Ba3 13. c4 Bb4 14. c3 Ba3 15. Qb3 Bd7 16. O-O Ne7 17. Rfe1 O-O 18. Ng3 Rab8 19. Qc2 Rb2 20. Qd3 Rd8 21. Bc1 Rb7 22. Bxa3 Qxa3 23. Reb1 Qa6 24. Rb3 Rdb8 25. Rxb7 Qxb7 26. h3 Ng6 27. Re1 Bc6 28. Qe3 Bxg2 29. Qxc5 Bf3 30. Qe3 Bc6 31. c5 Nh4 32. Qd4 Nf3+ 33. Kf1 Nxd4 34. cxd4 Qb5+ 35. Kg1 Qc4 36. Rd1 Qd5 37. Kf1 Rb2 38. Ke1 Qg2 39. Rd2 Qg1+ 40. Nf1 Rb1+ 41. Ke2 Qxf1+ 42. Ke3 Re1+ 43. Kf4 Qxh3 44. Rb2 Re4+ 45. Kg5 h6# 0-1')

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
      
      <div className="content">
        <PlayContainer game={game} fen={fen}></PlayContainer>
      </div>
      
    </div>
  );
}

export default App;
