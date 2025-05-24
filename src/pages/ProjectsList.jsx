import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, TextField, 
  InputAdornment, Pagination, CircularProgress, Alert, Button
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import truncate from '../utils/util.js';
import { useProjectsList } from '../hooks/useApiData';
import { useDebounce } from '../hooks/useDebounce';

export default function ProjectsList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('search') || '';

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const PAGE_SIZE = 10;

  // 搜索防抖
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 使用 React Query 获取项目数据
  const { 
    data: projectsData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useProjectsList(page, debouncedSearchQuery, PAGE_SIZE);

  // 当搜索查询变化时重置页码
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery, searchQuery]);

  // 初始加载时从URL读取搜索参数
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // 处理响应数据
  const projects = projectsData?.results || projectsData || [];
  const totalCount = projectsData?.count || (Array.isArray(projectsData) ? projectsData.length : 0);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>项目列表</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="搜索项目名称..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {isLoading && projects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert 
            severity="error" 
            action={
              <Button size="small" onClick={() => refetch()}>重试</Button>
            }
          >
            加载失败: {error?.message || '未知错误'}
          </Alert>
        ) : projects.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>暂无匹配项目</Typography>
        ) : (
          <>
            <List>
              {projects.map(project => (
                <ListItem
                  button
                  component={Link}
                  to={`/project/${project.project_id}`}
                  state={{ project }}
                  key={project.project_id}
                  sx={{ borderRadius: 2, mb: 1, alignItems: 'flex-start', '&:hover': { bgcolor: '#f5f5f7' } }}
                >
                  <ListItemText
                    primary={<Typography fontSize={17} fontWeight={500} title={project.title}>{project.title}</Typography>}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5, color: '#666', fontSize: 15 }}>
                        <span>区域：{project.district_show}</span>
                        <span>金额：{project.classify_show}</span>
                        <span>发布时间：{dayjs(project.open_time).format('YYYY-MM-DD HH:mm')}</span>
                      </Box>
                    }
                  />
                  <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                    <ArrowForwardIosIcon fontSize="small" sx={{ color: '#888' }} />
                  </ListItemIcon>
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
            
            {isLoading && projects.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
} 