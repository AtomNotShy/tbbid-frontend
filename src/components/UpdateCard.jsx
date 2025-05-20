import React from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';

export default function UpdateCard({ title, updateCount, description, children }) {
  return (
    <Card sx={{ mb: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <CardHeader 
        title={
          <Box sx={{display:'flex', alignItems:'center'}}>
            <span>{title}</span>
            <Typography variant="caption" color="primary" sx={{ml:1}}>
              今日更新 {updateCount} 个
            </Typography>
          </Box>
        } 
        subheader={description} 
      />
      <CardContent sx={{ flex: 1 }}>
        {children}
      </CardContent>
    </Card>
  );
}
