import { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  RadioGroup,
  Radio,
  FormControlLabel,
  LinearProgress
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const Container = styled(Box)({
  maxWidth: '1200px',
  margin: '24px auto',
  display: 'grid',
  gridTemplateColumns: '1fr 360px',
  gap: '32px',
  padding: '0 24px'
});

const QRPreview = styled(Paper)({
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '1',
  width: '240px',
  backgroundColor: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  margin: '0 auto'
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fff',
    '&:hover fieldset': {
      borderColor: '#e0e7ff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1a237e',
    }
  }
});

const StyledAccordion = styled(Accordion)({
  '&.MuiAccordion-root': {
    borderRadius: '8px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    '&:before': {
      display: 'none',
    }
  }
});

const UploadButton = styled('label')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '8px',
  border: '2px dashed #ccc',
  cursor: 'pointer',
  marginTop: '16px',
  backgroundColor: '#f8f9fa',
  '&:hover': {
    backgroundColor: '#f0f0f0'
  }
});

const FrameOption = styled(Paper)({
  width: '48px',
  height: '48px',
  cursor: 'pointer',
  border: '2px solid transparent',
  '&.selected': {
    borderColor: '#1a237e'
  }
});

const ColorOption = styled(Box)({
  width: '32px',
  height: '32px',
  borderRadius: '4px',
  cursor: 'pointer',
  border: '2px solid transparent',
  '&.selected': {
    borderColor: '#1a237e'
  }
});

const QR_FRAMES = [
  { id: 0, style: {} },
  { 
    id: 1, 
    style: { 
      borderRadius: '16px',
      padding: '16px',
      backgroundColor: '#f8f9fa' 
    } 
  },
  { 
    id: 2, 
    style: { 
      border: '2px solid #e2e8f0',
      padding: '16px',
      borderRadius: '8px' 
    } 
  },
  { 
    id: 3, 
    style: { 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '16px',
      borderRadius: '4px' 
    } 
  },
  { 
    id: 4, 
    style: { 
      background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '5px 5px 15px #d1d1d1, -5px -5px 15px #ffffff'
    } 
  }
];

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [selectedShape, setSelectedShape] = useState('square');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [dotScale, setDotScale] = useState(1);
  const [logo, setLogo] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [logoSize, setLogoSize] = useState(30);
  const qrRef = useRef<HTMLDivElement>(null);

  const colors = ['#000000', '#3b82f6', '#f59e0b', '#10b981', '#e11d48'];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0]);
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    
    const file = event.target.files[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress((e.loaded / e.total) * 100);
      }
    };
    
    reader.onload = () => {
      const result = reader.result as string;
      setFileContent(result);
      setText(result);
      setUploadProgress(0);
    };
    
    reader.readAsDataURL(file);
  }, []);

  const getQRCodeOptions = () => {
    const baseOptions = {
      value: text || fileContent || '',
      size: 200,
      level: 'H' as const,
      includeMargin: true,
      fgColor: selectedColor,
      style: {
        width: '100%',
        height: '100%',
        ...(selectedShape === 'rounded' && {
          borderRadius: '16px'
        }),
        ...(selectedShape === 'dots' && {
          borderRadius: '50%'
        })
      }
    };

    if (logo) {
      return {
        ...baseOptions,
        imageSettings: {
          src: URL.createObjectURL(logo),
          width: (200 * logoSize) / 100,
          height: (200 * logoSize) / 100,
          excavate: true
        }
      };
    }

    return baseOptions;
  };

  const downloadQR = async (format: 'jpg' | 'svg') => {
    if (!qrRef.current || !text) return;
    
    try {
      if (format === 'jpg') {
        const svgElement = qrRef.current.querySelector('svg');
        if (!svgElement) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          const link = document.createElement('a');
          link.download = 'qr-code.jpg';
          link.href = canvas.toDataURL('image/jpeg', 1.0);
          link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      } else {
        const svgElement = qrRef.current.querySelector('svg');
        if (!svgElement) return;
        
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(svgBlob);
        link.download = 'qr-code.svg';
        link.click();
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  return (
    <Container>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
          Enter your text
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Your QR code will be generated automatically
        </Typography>
        
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Enter your text or URL"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mt: 3, mb: 3 }}
        />

        <UploadButton>
          <CloudUploadIcon />
          <Typography>
            Upload any file (jpg, pdf, xlsx, docx, pptx)
          </Typography>
          <input type="file" hidden onChange={handleFileUpload} />
        </UploadButton>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        <QRPreview 
          elevation={0} 
          ref={qrRef}
          sx={{
            ...QR_FRAMES[selectedFrame].style,
            transition: 'all 0.3s ease',
            mt: 4 // Adding margin-top of 32px (4 * 8px in MUI's spacing system)
          }}
        >
          {text && (
            <QRCodeSVG {...getQRCodeOptions()} />
          )}
        </QRPreview>
      </Box>

      <Box>
        <StyledAccordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Frame</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {QR_FRAMES.map((frame) => (
                <FrameOption
                  key={frame.id}
                  className={selectedFrame === frame.id ? 'selected' : ''}
                  onClick={() => setSelectedFrame(frame.id)}
                  sx={frame.style}
                />
              ))}
            </Box>
          </AccordionDetails>
        </StyledAccordion>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Shape & Color</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" gutterBottom>
              Shape Style
            </Typography>
            <RadioGroup
              row
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value)}
            >
              <FormControlLabel value="square" control={<Radio />} label="Square" />
              <FormControlLabel value="rounded" control={<Radio />} label="Rounded" />
              <FormControlLabel value="dots" control={<Radio />} label="Dots" />
            </RadioGroup>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Colors
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {colors.map((color) => (
                <ColorOption
                  key={color}
                  sx={{ backgroundColor: color }}
                  className={selectedColor === color ? 'selected' : ''}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Dot Scale
            </Typography>
            <Slider
              value={dotScale}
              min={0.5}
              max={1.5}
              step={0.1}
              onChange={(_, value) => setDotScale(value as number)}
              valueLabelDisplay="auto"
            />
          </AccordionDetails>
        </StyledAccordion>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Logo</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Upload your logo to add to the center of the QR code
            </Typography>
            <UploadButton>
              <CloudUploadIcon />
              <Typography>
                {logo ? logo.name : 'Upload logo (PNG, JPG)'}
              </Typography>
              <input
                type="file"
                hidden
                accept="image/png,image/jpeg"
                onChange={handleLogoUpload}
              />
            </UploadButton>
            {logo && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Logo Size
                </Typography>
                <Slider
                  value={logoSize}
                  onChange={(_, value) => setLogoSize(value as number)}
                  min={10}
                  max={50}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                />
              </Box>
            )}
          </AccordionDetails>
        </StyledAccordion>

        <Box sx={{ display: 'flex', gap: 2, marginTop: 3 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: '#3b82f6' }}
            onClick={() => downloadQR('jpg')}
            disabled={!text && !fileContent}
          >
            JPG
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ backgroundColor: '#f59e0b' }}
            onClick={() => downloadQR('svg')}
            disabled={!text && !fileContent}
          >
            SVG/PNG
          </Button>
        </Box>
      </Box>
    </Container>
  );
}