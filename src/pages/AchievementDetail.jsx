import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import BackButton from '../components/BackButton';

export default function AchievementDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/company-achievement/${id}/`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("加载失败:", err);
        setError("数据加载失败，请稍后重试");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ textAlign: 'center', mt: 8 }}>{error}</Typography>;
  if (!data) return <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>暂无业绩详情</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <BackButton 
        sourceKey="achievement-detail"
        fallbackPath="/company-search"
        sx={{ mb: 2 }}
      />
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>业绩详情</Typography>
        <Box sx={{ display: 'grid', gap: 2, mt: 3 }}>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ width: 120 }} color="text.secondary">项目名称:</Typography>
            <Typography>{data.project_name || '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ width: 120 }} color="text.secondary">中标单位:</Typography>
            <Typography>{data.bidder_name || '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ width: 120 }} color="text.secondary">中标金额:</Typography>
            <Typography>{data.win_amt ? `¥${data.win_amt}万` : '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ width: 120 }} color="text.secondary">招标单位:</Typography>
            <Typography>{data.tender_org_name || '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ width: 120 }} color="text.secondary">地区代码:</Typography>
            <Typography>{data.area_code || '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ width: 120 }} color="text.secondary">创建时间:</Typography>
            <Typography>{data.create_time ? dayjs(data.create_time).format('YYYY-MM-DD HH:mm') : '—'}</Typography>
          </Box>
        </Box>
        
        {data.notice_content && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>公告正文</Typography>
            <Box sx={{ 
              mt: 2, 
              border: '1px solid #eaeaea', 
              borderRadius: 1,
              p: 2,
              bgcolor: '#fafafa' 
            }}>
              <iframe
                srcDoc={data.notice_content}
                title="招标公告"
                style={{ width: '100%', minHeight: 500, border: 'none' }}
                sandbox=""
              />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}