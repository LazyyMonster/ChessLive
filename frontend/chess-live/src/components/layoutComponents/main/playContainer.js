import React from "react";
import { Box, Paper } from "@mui/material";
import CustomChessboard from "../../chessboard/chessboard";
import ChessPGNBreadcrumbs from "../pgn/pgnArea";
import DetectCorners from "../../../backendAPI/detectCorners";
import { LichessProvider } from "../../../lichessAPI/lichessGame";
import { useTheme } from "@mui/material/styles";

export default function PlayContainer({ setDetectedCorners }) {
  const theme = useTheme();

  return (
    <LichessProvider>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          height: "90%",
          width: "95%",
          margin: "auto",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            flex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "25px",
          }}
        >
          <CustomChessboard />
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            gap: "25px",
          }}
        >
          {/* PGN Section */}
          <Paper
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2px",
              color: "#b3b3b3",
            }}
            elevation={3}
          >
            <ChessPGNBreadcrumbs />
          </Paper>

          <Paper
            sx={{
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              padding: "2px",
              color: "#b3b3b3",
              width: "100%",
            }}
            elevation={3}
          >
          <DetectCorners setDetectedCorners={setDetectedCorners} />
            
          </Paper>

        </Box>
      </Box>
    </LichessProvider>
  );
}
