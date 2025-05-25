import React, { useContext, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Stack, 
  Button, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (href) => {
    setMobileOpen(false);
    navigate(href);
  };

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
  };

  // 移动端抽屉菜单内容
  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight={700} color="primary">投标云</Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ px: 1, py: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick(item.href)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ fontWeight: 500, fontSize: 15 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      <List sx={{ px: 1, py: 2 }}>
        {user ? (
          <>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick('/profile')}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AccountCircleIcon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2" fontWeight={500}>
                    {user.username || '个人信息'}
                  </Typography>
                  {user.membership_level && (
                    <Typography variant="caption" color="text.secondary">
                      会员：{user.membership_level}
                    </Typography>
                  )}
                </ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{ borderRadius: 2, py: 1.5, color: 'error.main' }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <LogoutIcon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="退出登录" 
                  primaryTypographyProps={{ fontWeight: 500, fontSize: 15 }}
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick('/login')}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LoginIcon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="登录" 
                  primaryTypographyProps={{ fontWeight: 500, fontSize: 15 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavClick('/register')}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonAddIcon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="注册" 
                  primaryTypographyProps={{ fontWeight: 500, fontSize: 15 }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={1} 
        sx={{ 
          bgcolor: 'background.paper', 
          color: 'text.primary', 
          borderBottom: 1, 
          borderColor: 'divider', 
          backdropFilter: 'blur(8px)', 
          zIndex: 1300 
        }}
      >
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Box sx={{ 
            width: '100%', 
            maxWidth: 1200, 
            mx: 'auto', 
            px: { xs: 1, sm: 2 }, 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            {/* 移动端汉堡菜单按钮 */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Link 
              to="/" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none', 
                color: 'inherit', 
                marginRight: isMobile ? 'auto' : 24 
              }}
            >
              <BusinessIcon sx={{ fontSize: { xs: 24, sm: 28 }, mr: 1 }} />
              <Typography 
                variant="h6" 
                fontWeight={700}
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                投标云
              </Typography>
            </Link>

            {/* 桌面端导航菜单 */}
            {!isMobile && (
              <>
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

                {/* 桌面端用户菜单 */}
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
                      <Button 
                        component={Link} 
                        to="/login" 
                        sx={{ 
                          color: 'text.secondary', 
                          fontSize: 15, 
                          textTransform: 'none', 
                          fontWeight: 500, 
                          '&:hover': { color: 'primary.main', bgcolor: 'transparent' } 
                        }}
                      >
                        登录
                      </Button>
                      <Typography color="text.secondary">/</Typography>
                      <Button 
                        component={Link} 
                        to="/register" 
                        sx={{ 
                          color: 'text.secondary', 
                          fontSize: 15, 
                          textTransform: 'none', 
                          fontWeight: 500, 
                          '&:hover': { color: 'primary.main', bgcolor: 'transparent' } 
                        }}
                      >
                        注册
                      </Button>
                    </>
                  )}
                </Stack>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 移动端侧边抽屉 */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // 更好的移动端性能
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
}