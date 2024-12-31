import React from 'react';
import { Button } from '@mui/material';

export default function CustomWhiteButton({ handleClick, fontStyles, text }) {
    return (
        <Button
            onClick={handleClick}
            sx={{
                my: 2,
                display: 'block',
                textTransform: 'none',
                border: '1px solid white',
                ml: 2,
                ...fontStyles
            }}
        >
            {text}
        </Button>
    );
}