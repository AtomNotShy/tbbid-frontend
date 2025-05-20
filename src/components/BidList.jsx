import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Box, Typography, CircularProgress, Button, Pagination } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import truncate from '../utils/util.js';
import axios from 'axios';

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
  }, [page]);

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

  if (loading && bids.length === 0) return <Box sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!bids.length) return <Typography color="text.secondary">暂无开标记录</Typography>;

  return (
    <>
      <List>
        {bids.map(bid => (
          <ListItem
            button
            component={Link}
            to={`/bid/${bid.id || bid.section_id}`}
            key={bid.id || bid.section_id + '-' + bid.bidder_name}
            sx={{ borderRadius: 2, mb: 1, alignItems: 'flex-start', '&:hover': { bgcolor: '#f5f5f7' } }}
          >
            <ListItemText
              primary={<Typography fontSize={17} fontWeight={500} title={bid.section_name}>{truncate(bid.section_name)}</Typography>}
              secondary={
                <Box component="span" sx={{ display: 'flex', gap: 2, mt: 0.5, color: '#666', fontSize: 15 }}>
                  {bid.bid_size !== null && bid.bid_size != 0 && (
                      <span>投标公司：{bid.bid_size}家</span>
                  )}
                  <span>中标价：{bid.winning_amount ? `¥${bid.winning_amount}` : '—'}</span>

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
      
      {loading && bids.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </>
  );
} 