import React from "react";
import { Chessboard } from "react-chessboard";
import { useChess } from "../../chessGame/chessGame";
import { ANIMATION_DURATION, DIFFERENT_SQUARE_COLOR, LIVE_BOARD_SIZE } from "../settings/constants";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const parseFen = (fen) => {
  const rows = fen.split(" ")[0].split("/");
  const board = [];
  rows.forEach((row) => {
    const parsedRow = [];
    for (let char of row) {
      if (isNaN(char)) {
        parsedRow.push(char);
      } else {
        for (let i = 0; i < parseInt(char); i++) {
          parsedRow.push(null);
        }
      }
    }
    board.push(parsedRow);
  });
  return board;
};

const findDifferences = (fen1, fen2) => {
  const board1 = parseFen(fen1);
  const board2 = fen2 ? parseFen(fen2) : Array(8).fill(Array(8).fill(null));
  const differences = {};

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board1[r][c] !== board2[r][c]) {
        const square = `${String.fromCharCode(97 + c)}${8 - r}`;
        differences[square] = { backgroundColor: DIFFERENT_SQUARE_COLOR };
      }
    }
  }

  return differences;
};

export default function LiveChessboard() {
  const theme = useTheme();
  const { getFen, fenDetected } = useChess();
  const actualFen = getFen().split(" ")[0];
  const squareStyles = findDifferences(actualFen, fenDetected);

  return (
    <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.primary.contrastText,
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        Detected Pieces
      </Typography>
      <Stack direction="column" spacing={2} alignItems="center">
        <Chessboard
          position={fenDetected || "8/8/8/8/8/8/8/8"}
          boardWidth={LIVE_BOARD_SIZE}
          arePiecesDraggable={false}
          animationDuration={ANIMATION_DURATION}
          customSquareStyles={squareStyles}
        />
      </Stack>
    </Box>
  );
}