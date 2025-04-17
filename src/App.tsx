import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Sidebar from './components/sidebar/Sidebar';
import QRCodeGenerator from './components/main/QRCodeGenerator';

const AppContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f5f7fb'
});

const MainContent = styled(Box)({
  flexGrow: 1,
  padding: '24px',
  marginLeft: '80px'
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    background: {
      default: '#f5f7fb',
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContainer>
        <Sidebar />
        <MainContent>
          <QRCodeGenerator />
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
