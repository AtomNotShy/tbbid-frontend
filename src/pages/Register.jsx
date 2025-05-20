import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  InputAdornment
} from '@mui/material';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [smsMsg, setSmsMsg] = useState('');
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsCountdown, setSmsCountdown] = useState(0);
  const navigate = useNavigate();

  const isPhoneValid = phone => /^1\d{10}$/.test(phone);

  const handleSendCode = async () => {
    if (!phone) {
      setSmsMsg('请输入手机号');
      return;
    }
    if (!isPhoneValid(phone)) {
      setSmsMsg('手机号格式不正确');
      return;
    }
    setSmsLoading(true);
    setSmsMsg('');
    try {
      await axios.post('/api/send_sms_code/', { phone });
      setSmsMsg('验证码已发送');
      setSmsCountdown(60);
      let timer = setInterval(() => {
        setSmsCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e) {
      setSmsMsg('发送失败');
    }
    setSmsLoading(false);
  };

  const handleRegister = async () => {
    setError('');
    setMsg('');
    if (!isPhoneValid(phone)) {
      setError('手机号格式不正确');
      return;
    }
    if (!company) {
      setError('公司不能为空');
      return;
    }
    try {
      await axios.post('/api/register/', { username, password, phone, company, sms_code: smsCode });
      setMsg('注册成功，请登录');
      setTimeout(() => navigate('/login'), 1000);
    } catch (e) {
      setError(e.response?.data?.error || '注册失败');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 400, maxWidth: '90%' }}>
        <Typography variant="h5" align="center" gutterBottom>
          注册
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="用户名"
            variant="outlined"
            fullWidth
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            label="密码"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <TextField
            label="手机号"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <TextField
            label="公司"
            variant="outlined"
            fullWidth
            value={company}
            onChange={e => setCompany(e.target.value)}
          />
          <TextField
            label="验证码"
            variant="outlined"
            fullWidth
            value={smsCode}
            onChange={e => setSmsCode(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSendCode}
                    disabled={smsLoading || smsCountdown > 0}
                  >
                    {smsCountdown > 0 ? `${smsCountdown}s后重发` : '获取验证码'}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          {smsMsg && (
            <Typography color={smsMsg.includes('失败') ? 'error' : 'success.main'} variant="body2">
              {smsMsg}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegister}
            sx={{ mt: 1 }}
          >
            注册
          </Button>
          {msg && (
            <Typography color="success.main" align="center" sx={{ mt: 1 }}>
              {msg}
            </Typography>
          )}
          {error && (
            <Typography color="error" align="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              已有账号？ <a href="/login">登录</a>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
} 