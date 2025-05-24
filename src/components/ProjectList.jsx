import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Box, Typography, Button, CircularProgress, Pagination } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import dayjs from 'dayjs';
import truncate from '../utils/util.js';

export default function ProjectList({ limit = 5, showAll = false }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = limit;
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects(page);
  }, [page, limit]);

  const loadProjects = (currentPage) => {
    setLoading(true);
    axios.get(`/api/projects/?page=${currentPage}&page_size=${PAGE_SIZE}`)
      .then(res => {
        // Handle both paginated and non-paginated responses
        if (res.data.results && res.data.count !== undefined) {
          // Paginated response
          setProjects(Array.isArray(res.data.results) ? res.data.results : []);
          setTotalCount(res.data.count);
          setTotalPages(Math.ceil(res.data.count / PAGE_SIZE));
        } else {
          // Non-paginated response (fall back to client-side pagination)
          const data = Array.isArray(res.data) ? res.data : [];
          setProjects(data);
          setTotalCount(data.length);
          setTotalPages(Math.ceil(data.length / PAGE_SIZE));
        }
        setLoading(false);
      })
      .catch(err => {
        setError('加载失败');
        setLoading(false);
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleViewMore = () => {
    navigate('/projects-list');
  };

  if (loading && projects.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
        {error}
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
                  <span>区域：{project.district_show || '—'}</span>
                  <span>金额：{project.classify_show || '—'}</span>
                  <span>发布：{dayjs(project.time_show).format('MM-DD HH:mm')}</span>
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
      
      {loading && projects.length > 0 && (
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          <CircularProgress size={16} />
        </Box>
      )}
    </Box>
  );
} 