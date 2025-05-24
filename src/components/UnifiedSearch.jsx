import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  ToggleButtonGroup, 
  ToggleButton, 
  Button, 
  Paper,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate } from 'react-router-dom';

export default function UnifiedSearch() {
  const [searchType, setSearchType] = useState('project');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSearchType(newType);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // 根据不同的搜索类型，导航到不同的页面并传递搜索参数
    switch (searchType) {
      case 'company':
        navigate(`/company-search?query=${encodeURIComponent(searchQuery)}`);
        break;
      case 'project':
        navigate(`/projects-list?search=${encodeURIComponent(searchQuery)}`);
        break;
      case 'bid':
        navigate(`/bids-list?search=${encodeURIComponent(searchQuery)}`);
        break;
      case 'bid_result':
        navigate(`/bid-results-list?search=${encodeURIComponent(searchQuery)}`);
        break;
      default:
        navigate(`/projects-list?search=${encodeURIComponent(searchQuery)}`);
    }
    
    setIsSearching(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getPlaceholder = () => {
    switch (searchType) {
      case 'company':
        return '输入公司名称、统一社会信用代码或法定代表人...';
      case 'project':
        return '输入项目名称或关键词...';
      case 'bid':
        return '输入标段名称或关键词...';
      case 'bid_result':
        return '输入项目名字、企业名称或关键词...';
      default:
        return '输入搜索关键词...';
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        width: '100%', 
        maxWidth: 800, 
        mx: 'auto',
        mb: 6,
        borderRadius: 2
      }}
    >
      <Typography 
        variant="h5" 
        component="h2" 
        align="center" 
        gutterBottom 
        fontWeight={600}
        sx={{ mb: 2 }}
      >
        建筑行业大数据搜索服务
      </Typography>

      <ToggleButtonGroup
        value={searchType}
        exclusive
        onChange={handleTypeChange}
        aria-label="search type"
        sx={{ 
          mb: 3, 
          width: '100%',
          display: 'flex',
          '& .MuiToggleButtonGroup-grouped': {
            flex: 1
          }
        }}
      >
        <ToggleButton 
          value="project" 
          aria-label="项目"
          sx={{
            color: 'text.secondary',
            transition: 'color 0.2s',
            '&.Mui-selected': {
              color: 'primary.main',
              backgroundColor: 'transparent',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent',
              }
            },
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'transparent'
            }
          }}
        >
          <DescriptionIcon sx={{ mr: 1 }} />
          项目
        </ToggleButton>
        <ToggleButton 
          value="bid" 
          aria-label="标段"
          sx={{
            color: 'text.secondary',
            transition: 'color 0.2s',
            '&.Mui-selected': {
              color: 'primary.main',
              backgroundColor: 'transparent',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent',
              }
            },
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'transparent'
            }
          }}
        >
          <FormatListNumberedIcon sx={{ mr: 1 }} />
          标段
        </ToggleButton>
        <ToggleButton 
          value="bid_result" 
          aria-label="中标结果"
          sx={{
            color: 'text.secondary',
            transition: 'color 0.2s',
            '&.Mui-selected': {
              color: 'primary.main',
              backgroundColor: 'transparent',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent',
              }
            },
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'transparent'
            }
          }}
        >
          <EmojiEventsIcon sx={{ mr: 1 }} />
          中标结果
        </ToggleButton>
        <ToggleButton 
          value="company" 
          aria-label="公司"
          sx={{
            color: 'text.secondary',
            transition: 'color 0.2s',
            '&.Mui-selected': {
              color: 'primary.main',
              backgroundColor: 'transparent',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent',
              }
            },
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'transparent'
            }
          }}
        >
          <BusinessIcon sx={{ mr: 1 }} />
          公司
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ display: 'flex', width: '100%' }}>
        <TextField
          fullWidth
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              height: '56px'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          sx={{ 
            height: '56px',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            px: 4,
            fontSize: 16,
            minWidth: 120
          }}
        >
          {isSearching ? <CircularProgress size={24} color="inherit" /> : '搜索'}
        </Button>
      </Box>
    </Paper>
  );
} 