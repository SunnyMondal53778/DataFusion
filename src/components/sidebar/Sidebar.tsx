import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  QrCode as QrCodeIcon,
  Image as ImageIcon,
  TextFields as TextFieldsIcon,
  Wifi as WifiIcon,
  Settings as SettingsIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const SidebarContainer = styled(Box)({
  position: 'fixed',
  left: 0,
  top: 0,
  width: '80px',
  height: '100vh',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 0',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)'
});

const IconButton = styled(Box)({
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  marginBottom: '16px',
  cursor: 'pointer',
  color: '#666',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    color: '#1a237e'
  },
  '&.active': {
    backgroundColor: '#1a237e',
    color: '#fff'
  }
});

const Logo = styled(Box)({
  width: '40px',
  height: '40px',
  marginBottom: '40px',
  '& img': {
    width: '100%',
    height: '100%'
  }
});

export default function Sidebar() {
  return (
    <SidebarContainer>
      <Logo>
        <img src="/vite.svg" alt="DataFusion Logo" />
      </Logo>
      <IconButton className="active">
        <QrCodeIcon />
      </IconButton>
      <IconButton>
        <ImageIcon />
      </IconButton>
      <IconButton>
        <TextFieldsIcon />
      </IconButton>
      <IconButton>
        <WifiIcon />
      </IconButton>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton>
        <SettingsIcon />
      </IconButton>
      <IconButton>
        <InfoIcon />
      </IconButton>
    </SidebarContainer>
  );
}