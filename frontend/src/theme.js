import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:   { main: '#1976d2' }, // indeed mavi tonuna yakın
    secondary: { main: '#ffb300' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
