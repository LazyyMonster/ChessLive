import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import LichessOAuth from '../../../lichessAPI/lichessOAuth.js';
import { useChess } from '../../../chessGame/chessGame.js';
import LogoButton from '../buttons/logoButton.js';
import CustomWhiteButton from '../buttons/customWhiteButton.js';

const pages = [
  { name: "Follow game offline", path: "/offline", isOnline: false },
  { name: "Play with Lichess", path: "/lichess", isOnline: true },
  { name: "Settings", path: "/settings" }
];

export default function ResponsiveAppBar() {
  const { isAuthorized, username, profileUrl, lichessLogin, lichessLogout } = LichessOAuth();
  const { setIsPlayingOnline } = useChess();

  const handleButtonClick = (isOnline) => {
    setIsPlayingOnline(isOnline);
  };

  const fontStyles = {
    fontSize: '0.9rem',
    color: 'white',
    fontWeight: 700,
    textDecoration: 'none',
  };

  const alignmentStyles = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar >
          <LogoButton />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, mr: 2, ml: 2}}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={() => handleButtonClick(page.isOnline)}
                sx={{ my: 2, display: 'block', ...fontStyles }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ ...alignmentStyles }}>
            {isAuthorized ? (
              <>
                <Box sx={{ mr: 2 }}>
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...fontStyles }}
                  >
                    Welcome, {username}!
                  </a>
                </Box>
                <CustomWhiteButton text={"Logout"} fontStyles={fontStyles} handleClick={lichessLogout}></CustomWhiteButton>
              </>
            ) : (
              <CustomWhiteButton text={"Login with Lichess"} fontStyles={fontStyles} handleClick={lichessLogin}></CustomWhiteButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}