import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Box, Typography, Button, CircularProgress, Pagination } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import truncate from '../utils/util.js';
import { useHomeProjectsList } from '../hooks/useApiData';

export default function ProjectList({ limit = 5, showAll = false }) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const STAGE = {'1':'招标','2':'已完成'}

  // 使用 React Query hook
  const { 
    data: projectsData, 
    isLoading, 
    isError, 
    error 
  } = useHomeProjectsList(page, limit);

  // 处理响应数据
  const projects = projectsData?.results || projectsData || [];
  const totalCount = projectsData?.count || (Array.isArray(projectsData) ? projectsData.length : 0);
  const totalPages = Math.ceil(totalCount / limit);

  // 添加状态样式获取函数
  const getStageStyle = (stage) => {
    switch(stage) {
      case 1:
      case '1':
        return {
          color: '#fff',
          backgroundColor: '#4caf50',
          px: 1,
          py: 0.25,
          borderRadius: 1,
          fontSize: '11px',
          fontWeight: 500
        };
      case 2:
      case '2':
        return {
          color: '#fff',
          backgroundColor: '#2196f3',
          px: 1,
          py: 0.25,
          borderRadius: 1,
          fontSize: '11px',
          fontWeight: 500
        };
      default:
        return {
          color: '#666',
          fontSize: '12px'
        };
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleViewMore = () => {
    navigate('/projects-list');
  };

  if (isLoading && projects.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
        {error?.message || '加载失败'}
      </Typography>
    );
  }
  
  if (!projects.length) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        暂无项目
      </Typography>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      minHeight: 0 
    }}>
      <List sx={{ 
        flex: 1, 
        py: 0,
        '& .MuiListItem-root': {
          px: 0
        }
      }}>
        {projects.map(project => (
          <ListItem
            button
            component={Link}
            to={`/project/${project.project_id}`}
            state={{ project }}
            key={project.project_id}
            sx={{ 
              borderRadius: 1, 
              mb: 0.5, 
              mx: 0,
              py: 1.5,
              alignItems: 'flex-start', 
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
              '&:last-child': { mb: 0 }
            }}
          >
            <ListItemText
              primary={
                <Typography 
                  fontSize={16}
                  fontWeight={500} 
                  title={project.title}
                  sx={{ 
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {project.title}
                </Typography>
              }
              secondary={
                <Box component="span" sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 0.25, 
                  mt: 0.5, 
                  color: 'text.secondary', 
                  fontSize: 12 
                }}> 
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    状态：
                    <Box 
                      component="span" 
                      sx={getStageStyle(project.stage)}
                    >
                      {STAGE[project.stage] || '—'}
                    </Box>
                  </Box>
                  <span>来源：{project.platform_name || '—'}</span>
                  <span>发布：{dayjs(project.time_show).format('YYYY-MM-DD HH:mm')}</span>
                </Box>
              }
              sx={{ m: 0 }}
            />
            <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
              <ArrowForwardIosIcon fontSize="small" sx={{ color: '#999', fontSize: 12 }} />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      
      {showAll && totalPages > 1 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary"
            size="small"
          />
        </Box>
      ) : !showAll && totalCount > limit ? (
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          <Button 
            onClick={handleViewMore}
            variant="text" 
            color="primary"
            size="small"
            sx={{ 
              fontWeight: 500,
              fontSize: '0.75rem',
              py: 0.5,
              minHeight: 'auto'
            }}
          >
            查看更多
          </Button>
        </Box>
      ) : null}
      
      {isLoading && projects.length > 0 && (
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          <CircularProgress size={16} />
        </Box>
      )}
    </Box>
  );
} 