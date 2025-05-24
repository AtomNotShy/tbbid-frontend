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
  }, [page]);

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

  if (loading && projects.length === 0) return <Box sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!projects.length) return <Typography color="text.secondary">暂无项目</Typography>;

  return (
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
              primary={<Typography fontSize={17} fontWeight={500} title={project.title}>{truncate(project.title)}</Typography>}
              secondary={
                <Box component="span" sx={{ display: 'flex', gap: 2, mt: 0.5, color: '#666', fontSize: 15 }}> 
                  <span>区域：{project.district_show}</span>
                  <span>金额：{project.classify_show}</span>
                  <span>发布时间：{dayjs(project.time_show).format('YYYY-MM-DD HH:mm')}</span>
                </Box>
              }
            />
            <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
              <ArrowForwardIosIcon fontSize="small" sx={{ color: '#888' }} />
            </ListItemIcon>
          </ListItem>
        ))}
      </List>
      
      {showAll && totalPages > 1 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      ) : !showAll && totalCount > limit ? (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Button 
            onClick={handleViewMore}
            variant="text" 
            color="primary"
            sx={{ fontWeight: 500 }}
          >
            查看更多
          </Button>
        </Box>
      ) : null}
      
      {loading && projects.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </>
  );
} 