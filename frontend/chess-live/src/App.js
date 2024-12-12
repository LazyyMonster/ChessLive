import React from "react";
import './App.css';
import ResponsiveAppBar from "./components/navbar/navbar";
import PlayContainer from "./components/mainContent/playContainer";
import { CaptureProvider } from './components/camera/captureContext';
import { ChessProvider } from "./chessLogic/chessGame";
import { SettingsProvider } from "./components/settings/settings";
import ConfidenceInput from "./components/settings/modelConfidence/confidenceInput";
import UpdateGame from "./backendAPI/updateGame";


function App() {

  return (
    <div className="App">
      <SettingsProvider>
        <CaptureProvider>
          <ChessProvider>
            <ResponsiveAppBar></ResponsiveAppBar>
            <div className="content">
              <PlayContainer/>
            </div>
            <ConfidenceInput></ConfidenceInput>
            <UpdateGame />
          </ChessProvider>
        </CaptureProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;