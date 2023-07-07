import './App.css'
import Router from './router/Router'
import {ThemeProvider, createTheme} from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router />
    </ThemeProvider>

  );
}

export default App;
