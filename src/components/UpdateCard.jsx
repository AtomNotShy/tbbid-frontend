import React from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';

export default function UpdateCard({ title, updateCount, description, children, sx }) {
  return (
    <Card
      sx={{
        mb: { xs: 2, md: 0 },
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: { xs: 1, md: 3 },
        minHeight: 0,
        height: '100%',
        maxWidth: '100%',
        ...sx,
      }}
    >
      <CardHeader
        title={
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Typography 
              variant="h6" 
              component="span" 
              sx={{ 
                flex: 1,
                minWidth: 0,
                wordBreak: 'break-word',
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
            <Typography variant="caption" color="primary" sx={{ 
              fontSize: '0.75rem',
              bgcolor: 'primary.main',
              color: 'white',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontWeight: 500,
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}>
              今日 +{updateCount}
            </Typography>
          </Box>
        }
        subheader={
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              wordBreak: 'break-word',
              lineHeight: 1.3
            }}
          >
            {description}
          </Typography>
        }
        sx={{ 
          pb: 1,
          '& .MuiCardHeader-content': {
            overflow: 'visible',
            minWidth: 0
          }
        }}
      />
      <CardContent
        sx={{ 
          flex: 1, 
          minHeight: 0, 
          p: { xs: 1, md: 2 },
          pt: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '&:last-child': {
            pb: { xs: 1, md: 2 }
          }
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}
