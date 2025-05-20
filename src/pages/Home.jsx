import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import ProjectList from '../components/ProjectList.jsx';
import BidList from '../components/BidList';
import BidResultList from '../components/BidResultList';
import UpdateCard from '../components/UpdateCard';
import UnifiedSearch from '../components/UnifiedSearch';
import axios from 'axios';

export default function Home() {
  const [todayCount, setTodayCount] = useState({ 
    project_count: 0, 
    bid_count: 0, 
    bid_result_count: 0 
  });

  useEffect(() => {
    axios.get('/api/today_update_count/')
      .then(res => {
        setTodayCount(res.data);
      })
      .catch(() => {
        setTodayCount({ 
          project_count: 0, 
          bid_count: 0, 
          bid_result_count: 0 
        });
      });
  }, []);

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', mt: { xs: 2, md: 6 }, px: 2 }}>
      {/* 大型搜索框 */}
      <UnifiedSearch />
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3, pl: 1 }}>最新更新</Typography>
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <UpdateCard
            title="最近项目"
            updateCount={todayCount.project_count}
            description="最新发布的项目信息"
          >
            <ProjectList limit={5} showAll={false} />
          </UpdateCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <UpdateCard
            title="开标记录"
            updateCount={todayCount.bid_count}
            description="最新的开标记录信息"
          >
            <BidList limit={5} showAll={false} />
          </UpdateCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <UpdateCard
            title="开标结果"
            updateCount={todayCount.bid_result_count}
            description="最新的开标结果信息"
          >
            <BidResultList limit={5} showAll={false} />
          </UpdateCard>
        </Grid>
      </Grid>
    </Box>
  );
} 