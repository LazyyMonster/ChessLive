import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import ResponsiveAppBar from "./components/navbar/navbar";
import PlayContainer from "./components/mainContent/playContainer";
import ConfidenceInput from "./components/settings/modelConfidence/confidenceInput";
import { CaptureProvider } from './components/camera/captureContext';
import { ChessProvider } from "./chessLogic/chessGame";
import { SettingsProvider } from "./components/settings/settings";

function Welcome() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to ChessLive</h1>
      <p>Your go-to platform for live chess tracking and gameplay.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <SettingsProvider>
        <CaptureProvider>
          <ChessProvider>
            <ResponsiveAppBar />
            <div className="content">
              <Routes>
                {/* Default route redirects to Welcome */}
                <Route path="/" element={<Welcome />} />
                <Route path="/play" element={<PlayContainer />} />
                <Route path="/settings" element={<ConfidenceInput />} />
                {/* Fallback route */}
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