import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import ResponsiveAppBar from "./components/layoutComponents/navbar/navbar";
import SettingsInput from "./components/layoutComponents/settings/settingsInput";
import { CaptureProvider } from './components/camera/captureContext';
import { ChessProvider } from "./chessGame/chessGame";
import { SettingsProvider } from "./components/settings/settings";
import AppSnackbarProvider from "./components/alerts/customSnackbar";
import WelcomePage from "./components/layoutComponents/start/welcomePage";
import PlayContainer from "./components/layoutComponents/main/playContainer";
import { GlobalVariablesProvider } from "./globalVariables/globalVariables";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from "./themes/theme";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <GlobalVariablesProvider>
          <AppSnackbarProvider>
            <SettingsProvider>
              <CaptureProvider>
                <ChessProvider>
                  <ResponsiveAppBar className="navbar" />
                  <div className="content">
                    <Routes>
                      <Route path="/" element={<WelcomePage />} />
                      <Route path="/offline" element={<PlayContainer />} />
                      <Route path="/lichess" element={<PlayContainer />} />
                      <Route path="/settings" element={<SettingsInput />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </div>
                </ChessProvider>
              </CaptureProvider>
            </SettingsProvider>
          </AppSnackbarProvider>
        </GlobalVariablesProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;