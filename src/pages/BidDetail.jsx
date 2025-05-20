import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

export default function BidDetail() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/bids/${id}/`)
      .then(res => {
        setData(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('加载失败');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box sx={{ textAlign: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ textAlign: 'center', mt: 8 }}>{error}</Typography>;
  if (!data.length) return <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>暂无投标数据</Typography>;

  // 取第一个数据的section_name作为标题
  const sectionName = data[0]?.section_name || '开标记录详情';
  const lotCtlAmt = data[0]?.lot_ctl_amt;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>{sectionName}</Typography>
        {lotCtlAmt !== undefined && (
          <Typography sx={{ mb: 2 }}>控制价：{lotCtlAmt !== null ? `¥${lotCtlAmt}` : '—'}</Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>投标企业</TableCell>
                <TableCell>投标金额</TableCell>
                <TableCell>下浮率</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(bid => (
                <TableRow key={bid.id}>
                  <TableCell>{bid.bidder_name}</TableCell>
                  <TableCell>{bid.bid_amount ? `¥${bid.bid_amount}` : '—'}</TableCell>
                  {bid.lot_ctl_amt !== null && bid.lot_ctl_amt !== undefined && bid.lot_ctl_amt > 0 && (
                    <TableCell>{((bid.lot_ctl_amt - bid.bid_amount) / bid.lot_ctl_amt * 100).toFixed(4)}%</TableCell>
                  )}
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ my: 2 }} />
        <Typography color="text.secondary">如需更多信息请联系管理员。</Typography>
      </Paper>
    </Box>
  );
} 