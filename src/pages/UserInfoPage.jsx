import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserInfoPage() {
  const { user } = useContext(AuthContext);

  if (!user) return <Typography sx={{ m: 5 }}>请先登录</Typography>;

  return (
    <Box sx={{ 
      maxWidth: 600, 
      mx: 'auto', 
      mt: 4, 
      p: 3, 
      border: '1px solid', 
      borderColor: 'divider',
      borderRadius: 2 
    }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        个人信息
      </Typography>
      
      <Box sx={{ textAlign: 'center', my: 3 }}>
        <Avatar 
          src={user.avatar || "/default-avatar.png"}
          alt={user.username}
          sx={{ width: 80, height: 80, mx: 'auto' }}
        />
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ width: 100 }} color="text.secondary">用户名</Typography>
          <Typography>{user.username}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ width: 100 }} color="text.secondary">手机号</Typography>
          <Typography>{user.phone}</Typography>
        </Box>
      </Box>
    </Box>
  );
}