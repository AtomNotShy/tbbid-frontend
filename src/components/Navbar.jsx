import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, Stack, Button } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { name: '首页', href: '/', icon: <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} /> },
  { name: '总价模拟器', href: '/price-simulator', icon: <CalculateIcon sx={{ mr: 0.5, fontSize: 20 }} /> },
  { name: '清单模拟器', href: '/list-simulator', icon: <ListAltIcon sx={{ mr: 0.5, fontSize: 20 }} /> },
  { name: '企业搜索', href: '/company-search', icon: <SearchIcon sx={{ mr: 0.5, fontSize: 20 }} /> },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider', backdropFilter: 'blur(8px)', zIndex: 1300 }}>
      <Toolbar disableGutters sx={{ minHeight: 56 }}>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 2, display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', marginRight: 24 }}>
            <BusinessIcon sx={{ fontSize: 28, mr: 1 }} />
            <Typography variant="h6" fontWeight={700}>投标云</Typography>
          </Link>
          <Box component="nav" sx={{ flex: 1 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              {navItems.map(item => {
                const isActive = location.pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    to={item.href}
                    startIcon={item.icon}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: 500,
                      fontSize: 15,
                      textTransform: 'none',
                      px: 1.5,
                      transition: 'color 0.2s',
                      '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                    }}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </Stack>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {user ? (
              <>
                <Button color="inherit" onClick={() => navigate('/profile')}>
                  {user.membership_level ? `会员：${user.membership_level}` : ''}
                </Button>
                <Button color="inherit" onClick={() => navigate('/profile')}>
                  {user.username || '个人信息'}
                </Button>
                <Button color="inherit" onClick={logout}>
                  退出
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" sx={{ color: 'text.secondary', fontSize: 15, textTransform: 'none', fontWeight: 500, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}>登录</Button>
                <Typography color="text.secondary">/</Typography>
                <Button component={Link} to="/register" sx={{ color: 'text.secondary', fontSize: 15, textTransform: 'none', fontWeight: 500, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}>注册</Button>
              </>
            )}
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
}