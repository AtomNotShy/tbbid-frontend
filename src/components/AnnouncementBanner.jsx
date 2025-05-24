import React, { useState } from 'react';
import { Box, Typography, IconButton, Fade, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useQueryClient } from '@tanstack/react-query';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setIsVisible(false);
  };

  // 获取缓存状态 - 只在开发环境显示
  const getCacheInfo = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    const activeQueries = queries.filter(q => q.getObserversCount() > 0);
    const cachedQueries = queries.filter(q => q.state.data !== undefined);
    
    return { total: queries.length, active: activeQueries.length, cached: cachedQueries.length };
  };

  const cacheInfo = getCacheInfo();

  return (
    <Fade in={isVisible}>
      <Box
        sx={{
          background: 'linear-gradient(90deg, #4a4a4a 0%, #777777 50%, #4a4a4a 100%)',
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
          
          {/* 开发环境缓存状态 */}
          {cacheInfo && (
            <Chip
              label={`缓存: ${cacheInfo.cached}/${cacheInfo.total}`}
              size="small"
              sx={{
                height: 20,
                fontSize: 11,
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiChip-label': { px: 1 }
              }}
            />
          )}
          
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