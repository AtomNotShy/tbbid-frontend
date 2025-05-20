import React from 'react';
import { Box, Typography, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import dayjs from 'dayjs';

export default function BidResultDetail() {
  const location = useLocation();
  const allRanks = location.state?.allRanks || [];
  const sectionName = location.state?.sectionName || '开标结果详情';

  if (!allRanks.length) return <Typography color="text.secondary">暂无开标结果</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>{sectionName}</Typography>
        <Divider sx={{ my: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>排名</TableCell>
                <TableCell>中标单位</TableCell>
                <TableCell>中标金额</TableCell>
                <TableCell>项目经理</TableCell>
                <TableCell>公示时间</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allRanks.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.rank}</TableCell>
                <TableCell>
                  {item.names.map((name, index) => (
                    <div key={index}>
                      <Link to={`/company-search?query=${encodeURIComponent(name)}`}>
                        {name}
                      </Link>
                    </div>
                  ))}
                </TableCell>
                  <TableCell>{item.win_amt ? `¥${item.win_amt}` : '—'}</TableCell>
                  <TableCell>{item.manager_name || '—'}</TableCell>
                  <TableCell>{item.open_time ? dayjs(item.open_time).format('YYYY-MM-DD HH:mm') : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
} 