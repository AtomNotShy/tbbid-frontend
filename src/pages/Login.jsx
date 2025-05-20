import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('请输入用户名和密码');
      return;
    }

    try {
      const res = await axios.post('/api/login/', { username, password });
      
      // Simple JWT returns access and refresh tokens
      if (res.data.access && res.data.refresh) {
        await login({ access: res.data.access, refresh: res.data.refresh });
        navigate('/');
      } else {
        throw new Error('Invalid token response');
      }
    } catch (e) {
      console.error('登录失败:', e);
      if (e.response?.status === 401) {
        alert('用户名或密码错误');
      } else if (e.response?.data?.detail) {
        alert(e.response.data.detail);
      } else {
        alert('登录失败，请稍后重试');
      }
    }
  };

 return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 360 }}>
        <Typography variant="h5" align="center" gutterBottom>
          登录
        </Typography>

        <TextField
          label="用户名"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="密码"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          登录
        </Button>
      </Paper>
    </Box>
  );
}