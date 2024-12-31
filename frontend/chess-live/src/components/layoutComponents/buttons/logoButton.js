import React from 'react';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";
import ChessRookIcon from '../../icons/chessRookIcon';

export default function LogoButton() {
    return (
        <Button
            component={Link}
            to="/"
            sx={{
                color: 'white',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '.3rem',
                textTransform: 'none',
            }}
        >
            <ChessRookIcon />
            ChessLive
        </Button>
    );
}