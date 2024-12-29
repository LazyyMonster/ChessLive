import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ChessRookIcon from '../../icons/chessRookIcon.js';
import { Link } from "react-router-dom";
import LichessOAuth from '../../../lichessAPI/lichessOAuth.js';
import { useChess } from '../../../chessGame/chessGame.js';

const pages = [
  { name: "Follow game offline", path: "/play", isOnline: false },
  { name: "Play with Lichess", path: "/playLichess", isOnline: true },
  { name: "Settings", path: "/settings" }
];

export default function ResponsiveAppBar() {
  const { isAuthorized, username, profileUrl, lichessLogin, lichessLogout } = LichessOAuth();
  const { setIsPlayingOnline } = useChess();

  const handleButtonClick = (isOnline) => {
    setIsPlayingOnline(isOnline);
  };

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
                onClick={() => handleButtonClick(page.isOnline)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthorized ? (
              <>
                <Box sx={{ mr: 2, color: 'white', fontWeight: 600 }}>
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'white' }}
                  >
                    Welcome, {username}!
                  </a>
                </Box>
                <Button
                  onClick={lichessLogout}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    textTransform: 'none',
                    fontWeight: 600,
                    border: '1px solid white',
                    ml: 2
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={lichessLogin}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  textTransform: 'none',
                  fontWeight: 600,
                  border: '1px solid white',
                  ml: 2
                }}
              >
                Login with Lichess
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}