import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import ResponsiveAppBar from "./components/navbar/navbar";
import PlayContainer from "./components/mainContent/playContainer";
import ConfidenceInput from "./components/settings/modelConfidence/confidenceInput";
import { CaptureProvider } from './components/camera/captureContext';
import { ChessProvider } from "./chessLogic/chessGame";
import { SettingsProvider } from "./components/settings/settings";
import WelcomePage from "./components/mainContent/welcomePage";


function App() {
  return (
    <Router>
      <SettingsProvider>
        <CaptureProvider>
          <ChessProvider>
            <ResponsiveAppBar />
            <div className="content">
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/play" element={<PlayContainer />} />
                <Route path="/settings" element={<ConfidenceInput />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </ChessProvider>
        </CaptureProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;