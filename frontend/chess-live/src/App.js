import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import ResponsiveAppBar from "./components/layoutComponents/navbar/navbar";
import SettingsInput from "./components/layoutComponents/settings/settingsInput";
import { CaptureProvider } from './components/camera/captureContext';
import { ChessProvider } from "./chessLogic/chessGame";
import { SettingsProvider } from "./components/settings/settings";
import AppSnackbarProvider from "./components/alerts/customSnackbar";
import WelcomePage from "./components/layoutComponents/start/welcomePage";
import PlayContainer from "./components/layoutComponents/main/playContainer";


function App() {
  return (
    <Router>
      <AppSnackbarProvider>
        <SettingsProvider>
          <CaptureProvider>
            <ChessProvider>
              <ResponsiveAppBar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/play" element={<PlayContainer />} />
                  <Route path="/playLichess" element={<PlayContainer />} />
                  <Route path="/settings" element={<SettingsInput />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </ChessProvider>
          </CaptureProvider>
        </SettingsProvider>
      </AppSnackbarProvider>
    </Router>
  );
}

export default App;