import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/api/user-info/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setUserInfo(res.data.user);
        setError(null);
      })
      .catch(err => {
        setError('获取用户信息失败');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
        个人信息
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {userInfo && (
        <>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 100 }} color="text.secondary">用户名</Typography>
              <Typography>{userInfo.username}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 100 }} color="text.secondary">公司</Typography>
              <Typography>{userInfo.company}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 100 }} color="text.secondary">手机号</Typography>
              <Typography>{userInfo.phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 100 }} color="text.secondary">会员等级</Typography>
              <Typography>{userInfo.membership_level}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 100 }} color="text.secondary">会员有效期</Typography>
              <Typography>
                {userInfo.membership_start ? new Date(userInfo.membership_start).toLocaleString() : '无'}
                {' ~ '}
                {userInfo.membership_end ? new Date(userInfo.membership_end).toLocaleString() : '无'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 100 }} color="text.secondary">会员状态</Typography>
              <Typography color={userInfo.is_membership_active ? 'green' : 'red'}>
                {userInfo.is_membership_active ? '有效' : '无效'}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}