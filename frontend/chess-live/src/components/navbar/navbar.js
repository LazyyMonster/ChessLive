import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ChessRookIcon from '../icons/chessRookIcon.js';
import SettingsIcon from '../icons/settingsIcon.js';


import { Link } from "react-router-dom";

const pages = [
  { name: "Follow game offline", path: "/play" },
  { name: "Play on Lichess", path: "/play" },
  { name: "Settings", path: "/settings" }
];

export default function ResponsiveAppBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Button
            component={Link}
            to="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textTransform: 'none'
            }}
          >
            <ChessRookIcon sx={{ mr: 1, fontSize: '2rem', color: 'white' }} />
            ChessLive
          </Button>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <SettingsIcon />
        </Toolbar>
      </Container>
    </AppBar>
  );
}