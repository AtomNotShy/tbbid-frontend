import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Divider, IconButton, Grid, List, ListItem, ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
// import axios from 'axios';

function getRandomInRange(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(4);
}

export default function PriceSimulatorDetail() {
  const [ranges, setRanges] = useState([
    { min: '', max: '', num: '' }
  ]);
  const [mValue, setMValue] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddRange = () => {
    setRanges([...ranges, { min: '', max: '', num: '' }]);
  };
  const handleRemoveRange = idx => {
    setRanges(ranges.filter((_, i) => i !== idx));
  };
  const handleChange = (idx, field, value) => {
    setRanges(ranges.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const handleSimulate = async () => {
    setLoading(true);
    // mock: 生成所有模拟竞价
    let inputLists = [];
    ranges.forEach(r => {
      const min = parseFloat(r.min);
      const max = parseFloat(r.max);
      const num = parseInt(r.num);
      if (!isNaN(min) && !isNaN(max) && !isNaN(num) && num > 0) {
        for (let i = 0; i < num; i++) {
          inputLists.push(getRandomInRange(min, max));
        }
      }
    });
    inputLists = inputLists.sort((a, b) => a - b);
    const m = parseInt(mValue) || 1;
    // mock 推荐值: 取均值±1%区间内均匀分布m个数
    const avg = inputLists.length ? inputLists.reduce((a, b) => a + b, 0) / inputLists.length : 1;
    const lower = avg * 0.99, upper = avg * 1.01;
    const step = (upper - lower) / (m - 1 || 1);
    const recommended = Array.from({ length: m }, (_, i) => +(lower + i * step).toFixed(4));
    setTimeout(() => {
      setResult({ inputLists, mValue: m, recommended });
      setLoading(false);
    }, 600);
    // axios 请求模板：
    // const res = await axios.post('/api/price-simulator', { ranges, mValue });
    // setResult(res.data);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>总价模拟器</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>根据输入预估其他家竞价范围，计算我方最优控制价</Typography>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={e => { e.preventDefault(); handleSimulate(); }}>
          <Typography fontWeight={600} sx={{ mb: 1 }}>区间范围</Typography>
          {ranges.map((r, idx) => (
            <Grid container spacing={2} alignItems="center" key={idx} sx={{ mb: 1 }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="最小值"
                  type="number"
                  value={r.min}
                  onChange={e => handleChange(idx, 'min', e.target.value)}
                  fullWidth
                  inputProps={{ step: 0.0001, min: 0, max: 1 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="最大值"
                  type="number"
                  value={r.max}
                  onChange={e => handleChange(idx, 'max', e.target.value)}
                  fullWidth
                  inputProps={{ step: 0.0001, min: 0, max: 1 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="数量"
                  type="number"
                  value={r.num}
                  onChange={e => handleChange(idx, 'num', e.target.value)}
                  fullWidth
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <IconButton color="error" onClick={() => handleRemoveRange(idx)} disabled={ranges.length === 1}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button startIcon={<AddIcon />} onClick={handleAddRange} sx={{ mb: 2 }}>添加区间</Button>
          <Divider sx={{ my: 2 }} />
          <TextField
            label="可控数量"
            type="number"
            value={mValue}
            onChange={e => setMValue(e.target.value)}
            fullWidth
            inputProps={{ min: 1 }}
            required
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" disabled={loading}>计算推荐值</Button>
        </form>
        {result && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>计算结果</Typography>
            <Typography><b>模拟竞价:</b> {JSON.stringify(result.inputLists)}</Typography>
            <Typography><b>我方出价数量:</b> {result.mValue}</Typography>
            <Typography><b>推荐值:</b> {result.recommended.join(', ')}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
} 