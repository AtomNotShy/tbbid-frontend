import React, { useState } from 'react';
import { Box, Typography, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <Fade in={isVisible}>
      <Box
        sx={{
          background: 'linear-gradient(90deg,rgb(100, 100, 100) 0%,rgb(75, 75, 75) 50%,rgb(25, 25, 25) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          py: 1.5,
          px: 2,
          display: isVisible ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'sticky',
          top: 56, // navbar高度
          zIndex: 1200,
          backdropFilter: 'blur(20px)',
          minHeight: 44,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            maxWidth: 1200,
            width: '100%',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <InfoOutlinedIcon 
            sx={{ 
              color: '#bbb', 
              fontSize: 16,
            }} 
          />
          <Typography
            variant="body2"
            sx={{
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 400,
              textAlign: 'center',
              letterSpacing: 0.2,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
            }}
          >
            此网站仅供内部学习交流使用，请勿外传
          </Typography>
          
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              position: 'absolute',
              right: 0,
              color: '#999',
              padding: 0.5,
              '&:hover': {
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </Fade>
  );
} 