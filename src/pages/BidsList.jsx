import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, TextField, 
  InputAdornment, Pagination, CircularProgress
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import dayjs from 'dayjs';
import truncate from '../utils/util.js';

export default function BidsList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('search') || '';

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  const loadBids = useCallback((currentPage, query = '') => {
    setLoading(true);
    let url = `/api/bid_sections/?page=${currentPage}&page_size=${PAGE_SIZE}`;
    if (query) {
      url += `&search=${encodeURIComponent(query)}`;
    }
    
    axios.get(url)
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
  }, []);

  // 当页码变化时加载数据
  useEffect(() => {
    loadBids(page, searchQuery);
  }, [page, loadBids, searchQuery]);

  // 初始加载时从URL读取搜索参数
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      setPage(1);
    }
  }, [initialSearchQuery]);

  // 处理搜索查询变化
  useEffect(() => {
    // Debounce search to avoid too many requests
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeoutId = setTimeout(() => {
      setPage(1); // Reset to first page on new search
      loadBids(1, searchQuery);
    }, 300);
    
    setSearchTimeout(timeoutId);
    
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchQuery, loadBids]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>标段列表</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="搜索标段名称..."
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

        {loading && bids.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : bids.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>暂无匹配标段</Typography>
        ) : (
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
                    primary={<Typography fontSize={17} fontWeight={500} title={bid.section_name}>{bid.section_name}</Typography>}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5, color: '#666', fontSize: 15 }}>
                        {bid.bid_size !== null && bid.bid_size != 0 && (
                          <span>投标公司：{bid.bid_size}家</span>
                        )}
                        <span>中标价：{bid.winning_amount ? `¥${bid.winning_amount}` : '—'}</span>
                        {bid.bid_open_time && (
                          <span>开标时间：{dayjs(bid.bid_open_time).format('YYYY-MM-DD HH:mm')}</span>
                        )}
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
            
            {loading && bids.length > 0 && (
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