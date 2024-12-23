import React from 'react';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

export const showSnackbar = (message, variant = 'default') => {
  enqueueSnackbar(message, { variant });
};

export default function AppSnackbarProvider({ children }) {
  return (
    <SnackbarProvider maxSnack={3}>
      {children}
    </SnackbarProvider>
  );
}