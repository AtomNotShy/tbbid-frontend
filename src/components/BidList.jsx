import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Box, Typography, CircularProgress, Button, Pagination } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import dayjs from 'dayjs';

export default function BidList({ limit = 5, showAll = false }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = limit;
  const navigate = useNavigate();

  useEffect(() => {
    loadBids(page);
  }, [page, limit]);

  const loadBids = (currentPage) => {
    setLoading(true);
    axios.get(`/api/bid_sections/?page=${currentPage}&page_size=${PAGE_SIZE}`)
      .then(res => {
        // Handle both paginated and non-paginated responses
        if (res.data.results && res.data.count !== undefined) {
          // Paginated response
          setBids(Array.isArray(res.data.results) ? res.data.results : []);
          setTotalCount(res.data.count);
          setTotalPages(Math.ceil(res.data.count / PAGE_SIZE));
        } else {
          // Non-paginated response (fall back to client-side pagination)
          const data = Array.isArray(res.data) ? res.data : [];
          setBids(data);
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
    navigate('/bids-list');
  };

  if (loading && bids.length === 0) {
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
  
  if (!bids.length) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        暂无开标记录
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
        {bids.map(bid => (
          <ListItem
            button
            component={Link}
            to={`/bid/${bid.id || bid.section_id}`}
            key={bid.id || bid.section_id + '-' + bid.bidder_name}
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
                  title={bid.section_name}
                  sx={{ 
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {bid.section_name}
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
                  {bid.bid_size !== null && bid.bid_size !== 0 ? (
                    <span>投标企业：<Box component="span" sx={{ color: '#1976d2', fontWeight: 600 }}>{bid.bid_size}</Box>家</span>
                  ) : (
                    <span>投标企业：—</span>
                  )}
                  <span>中标价：{bid.winning_amount ? `¥${bid.winning_amount}` : '—'}</span>
                  <span>公示时间：{bid.winning_time ? dayjs(bid.winning_time).format('YYYY-MM-DD HH:mm') : '—'}</span>
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
      
      {loading && bids.length > 0 && (
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          <CircularProgress size={16} />
        </Box>
      )}
    </Box>
  );
} 