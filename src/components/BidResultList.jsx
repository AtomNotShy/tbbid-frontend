import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  CircularProgress,
  Button,
  Pagination,
  TableCell
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import truncate from '../utils/util.js';
import dayjs from 'dayjs';
import { useHomeBidResultsList } from '../hooks/useApiData';

export default function BidResultList({ limit = 5, showAll = false }) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // 使用 React Query hook
  const { 
    data: resultsData, 
    isLoading, 
    isError, 
    error 
  } = useHomeBidResultsList(page, limit);

  // 处理响应数据
  const results = resultsData?.results || resultsData || [];
  const totalCount = resultsData?.count || (Array.isArray(resultsData) ? resultsData.length : 0);
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleViewMore = () => {
    navigate('/bid-results-list');
  };

  if (isLoading && results.length === 0) {
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
  
  if (!results.length) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        暂无开标结果
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
        {results.map((result) => {
          // 找到同一project_id和section_id的所有结果
          const allRanks = results.filter(r => r.project_id === result.project_id && r.section_id === result.section_id);
          return (
            <ListItem
              button
              component={Link}
              to={`/bid-result/${result.id}`}
              key={result.id || result.section_id + '-' + result.bidder_name}
              state={{ allRanks, sectionName: result.section_name }}
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
                    title={result.section_name}
                    sx={{ 
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {result.section_name}
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
                    <span>中标单位：<Box component="span" sx={{ color: '#1976d2', fontWeight: 600 }}>{result.bidder_name}</Box></span>
                    <span>中标金额：{result.win_amt ? `¥${result.win_amt}` : '—'}</span>
                    <span>公示时间：{result.open_time ? dayjs(result.open_time).format('YYYY-MM-DD HH:mm') : '-'}</span>
                  </Box>
                }
                sx={{ m: 0 }}
              />
              <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
                <ArrowForwardIosIcon fontSize="small" sx={{ color: '#999', fontSize: 12 }} />
              </ListItemIcon>
            </ListItem>
          );
        })}
      </List>
      
      {/* 底部按钮/分页区域 */}
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
      
      {isLoading && results.length > 0 && (
        <Box sx={{ textAlign: 'center', pt: 1 }}>
          <CircularProgress size={16} />
        </Box>
      )}
    </Box>
  );
} 