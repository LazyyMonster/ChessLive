import { createTheme } from '@mui/material/styles';


const theme = createTheme({
    palette: {
      primary: {
        light: '#337f83',
        main: '#006064',
        dark: '#004346',
        contrastText: '#fff',
      },
      secondary: {
        light: '#33abb8',
        main: '#0097a7',
        dark: '#006974',
        contrastText: '#fff',
      },
    },
  });

export default theme;
