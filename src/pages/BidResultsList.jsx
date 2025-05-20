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

export default function BidResultsList() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('search') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  const loadResults = useCallback((currentPage, query = '') => {
    setLoading(true);
    let url = `/api/bid_results/?page=${currentPage}&page_size=${PAGE_SIZE}`;
    if (query) {
      url += `&search=${encodeURIComponent(query)}`;
    }
    
    axios.get(url)
      .then(res => {
        // Handle both paginated and non-paginated responses
        if (res.data.results && res.data.count !== undefined) {
          // Paginated response
          setResults(Array.isArray(res.data.results) ? res.data.results : []);
          setTotalCount(res.data.count);
          setTotalPages(Math.ceil(res.data.count / PAGE_SIZE));
        } else {
          // Non-paginated response (fall back to client-side pagination)
          const data = Array.isArray(res.data) ? res.data : [];
          setResults(data);
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
    loadResults(page, searchQuery);
  }, [page, loadResults, searchQuery]);

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
      loadResults(1, searchQuery);
    }, 300);
    
    setSearchTimeout(timeoutId);
    
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchQuery, loadResults]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>中标结果列表</Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="搜索标段名称或中标单位..."
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

        {loading && results.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : results.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>暂无匹配中标结果</Typography>
        ) : (
          <>
            <List>
              {results.map((result) => {
                // 找到同一project_id和section_id的所有结果（如果可用）
                const allRanks = result.all_ranks || 
                  results.filter(r => r.project_id === result.project_id && r.section_id === result.section_id);
                
                return (
                  <ListItem
                    button
                    component={Link}
                    to={`/bid-result/${result.id}`}
                    key={result.id || result.section_id + '-' + result.bidder_name}
                    state={{ allRanks, sectionName: result.section_name }}
                    sx={{ borderRadius: 2, mb: 1, alignItems: 'flex-start', '&:hover': { bgcolor: '#f5f5f7' } }}
                  >
                    <ListItemText
                      primary={<Typography fontSize={17} fontWeight={500} title={result.section_name}>{result.section_name}</Typography>}
                      secondary={
                        <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5, color: '#666', fontSize: 15 }}>
                          <span>中标单位：{result.bidder_name}</span>
                          <span>中标金额：{result.win_amt ? `¥${result.win_amt}` : '—'}</span>
                          <span>公示时间：{result.open_time ? dayjs(result.open_time).format('YYYY-MM-DD HH:mm') : '-'}</span>
                        </Box>
                      }
                    />
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <ArrowForwardIosIcon fontSize="small" sx={{ color: '#888' }} />
                    </ListItemIcon>
                  </ListItem>
                );
              })}
            </List>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
            
            {loading && results.length > 0 && (
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