import React from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import ProjectList from '../components/ProjectList.jsx';
import BidList from '../components/BidList';
import BidResultList from '../components/BidResultList';
import UpdateCard from '../components/UpdateCard';
import UnifiedSearch from '../components/UnifiedSearch';
import { useTodayUpdateCount } from '../hooks/useApiData';

export default function Home() {
  // 固定显示数量，保持简洁统一
  const ITEMS_PER_COLUMN = 5;

  // 使用 React Query hook 获取今日更新数量
  const { 
    data: todayCount, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useTodayUpdateCount();

  // 加载中状态
  if (isLoading) {
    return (
      <Box sx={{ 
        maxWidth: '100%', 
        mx: 'auto', 
        mt: { xs: 2, md: 6 }, 
        px: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // 错误状态
  if (isError) {
    return (
      <Box sx={{ maxWidth: '100%', mx: 'auto', mt: { xs: 2, md: 6 }, px: 2 }}>
        <Alert 
          severity="error" 
          action={
            <button onClick={() => refetch()}>重试</button>
          }
        >
          加载失败: {error?.message || '未知错误'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        px: { xs: 2, md: 3 },
        pb: { xs: 2, md: 3 },
      }}
    >
      <UnifiedSearch />
      
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3, textAlign: 'center' }}>
        最新更新
      </Typography>
      
      {/* 优化后的Grid布局 */}
      <Grid
        container
        spacing={{ xs: 2, md: 2 }}
        alignItems="stretch"
        justifyContent="space-between" // 均匀分布
        sx={{ 
          flex: 1, 
          minHeight: 0,
          maxWidth: '100%',
          mx: 'auto',
          '& .MuiGrid-item': {
            display: 'flex'
          }
        }}
      >
        {/* 精确的三等分布局 */}
        <Grid 
          item 
          xs={12} 
          md={4}
          sx={{ 
            maxWidth: { 
              xs: '100%',
              md: 'calc(33.333% - 10.67px)' // 精确计算：考虑16px间距的2/3
            },
            flexBasis: { 
              xs: '100%',
              md: 'calc(33.333% - 10.67px)' 
            },
            flexGrow: 0,
            flexShrink: 0
          }}
        >
          <UpdateCard
            title="最近项目"
            updateCount={todayCount.project_count}
            description="最新发布的项目信息"
          >
            <ProjectList limit={ITEMS_PER_COLUMN} showAll={false} />
          </UpdateCard>
        </Grid>
        
        <Grid 
          item 
          xs={12} 
          md={4}
          sx={{ 
            maxWidth: { 
              xs: '100%',
              md: 'calc(33.333% - 10.67px)' 
            },
            flexBasis: { 
              xs: '100%',
              md: 'calc(33.333% - 10.67px)' 
            },
            flexGrow: 0,
            flexShrink: 0
          }}
        >
          <UpdateCard
            title="开标记录"
            updateCount={todayCount.bid_count}
            description="最新的开标记录信息"
          >
            <BidList limit={ITEMS_PER_COLUMN} showAll={false} />
          </UpdateCard>
        </Grid>
        
        <Grid 
          item 
          xs={12} 
          md={4}
          sx={{ 
            maxWidth: { 
              xs: '100%',
              md: 'calc(33.333% - 10.67px)' 
            },
            flexBasis: { 
              xs: '100%',
              md: 'calc(33.333% - 10.67px)' 
            },
            flexGrow: 0,
            flexShrink: 0
          }}
        >
          <UpdateCard
            title="开标结果"
            updateCount={todayCount.bid_result_count}
            description="最新的开标结果信息"
          >
            <BidResultList limit={ITEMS_PER_COLUMN} showAll={false} />
          </UpdateCard>
        </Grid>
      </Grid>
    </Box>
  );
} 