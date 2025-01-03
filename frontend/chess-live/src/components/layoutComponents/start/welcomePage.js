import React from "react";
import { useTheme } from "@mui/material/styles";

export default function WelcomePage() {
  const theme = useTheme();

  return (
    <div
      style={{
        textAlign: "center",
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        padding: "200px",
        borderRadius: "8px",
      }}
    >
      <h1>Welcome to ChessLive!</h1>
      <p>
        Make sure to give the browser permission for your webcam! You can play 2
        players offline or join a Lichess game after logging in to your Lichess
        account.
      </p>
    </div>
  );
}