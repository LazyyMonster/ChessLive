import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import ResponsiveAppBar from "./components/layoutComponents/navbar/navbar";
import SettingsInput from "./components/layoutComponents/settings/settingsInput";
import { CaptureProvider } from './components/camera/captureContext';
import { ChessProvider } from "./chessGame/chessGame";
import { SettingsProvider } from "./components/settings/settings";
import { DetectionProvider } from "./backendAPI/detectionContext";
import { ThemeProvider } from '@mui/material/styles';
import AppSnackbarProvider from "./components/alerts/customSnackbar";
import WelcomePage from "./components/layoutComponents/start/welcomePage";
import PlayContainer from "./components/layoutComponents/main/playContainer";
import { GlobalVariablesProvider } from "./globalVariables/globalVariables";
import CssBaseline from '@mui/material/CssBaseline';
import theme from "./themes/theme";


const compose = (providers) =>
  providers.reduce((Prev, Curr) => ({ children }) => (
      <Prev>
          <Curr>{children}</Curr>
      </Prev>
  ));

const Provider = compose([
  GlobalVariablesProvider,
  AppSnackbarProvider,
  SettingsProvider,
  CaptureProvider,
  ChessProvider,
  DetectionProvider,
])

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Provider>
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
        </Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;