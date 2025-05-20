import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

export default function ProjectDetail() {
  const { project_id } = useParams();
  const [data, setData] = useState(null); // data: { bid_sections }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/projects/${project_id}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('加载失败');
        setLoading(false);
      });
  }, [project_id]);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ textAlign: 'center', mt: 8 }}>{error}</Typography>;
  if (!data) return <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>暂无项目信息</Typography>;

  const { bid_sections = [], html_content } = data;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      {bid_sections.length > 0 && (
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>标段信息</Typography>
          {bid_sections.map(section => (
            <Paper key={section.id} sx={{ p: 2, mb: 2, bgcolor: '#fafbfc' }}>
              <Typography fontWeight={600}>{section.section_name}</Typography>
              <Typography>投标规模：{section.bid_size}家</Typography>
              {section.lot_ctl_amt !== 0 && section.lot_ctl_amt !== null && (
                <Typography>控制价 {section.lot_ctl_amt? `¥${section.lot_ctl_amt}` : '—'}</Typography>
              )}
              <Typography>中标单位：{section.winning_bidder}</Typography>
              <Typography>中标金额：{section.winning_amount? `¥${section.winning_amount}` : '—'}</Typography>
              <Typography>状态：{section.status == 'pending' ? '等待开标' : '已完成'}</Typography>
              <Typography>信息来源：{section.info_source}</Typography>
              <Typography>开标时间：{section.bid_open_time ? dayjs(section.bid_open_time).format('YYYY-MM-DD HH:mm') : ''}</Typography>
            </Paper>
          ))}
        </Paper>
      )}
      <div style={{ marginTop: 32 }}>
        <iframe
          srcDoc={html_content}
          title="招标公告"
          style={{ width: '100%', height: '80vh', border: 'none' }}
          sandbox
        />
      </div>
    </Box>
  );
} 