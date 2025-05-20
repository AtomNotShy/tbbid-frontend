import React, { useState } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, Divider, 
  IconButton, Grid, FormControl, InputLabel, Select, MenuItem,
  Alert, CircularProgress, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Tabs, Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';

export default function ListSimulator() {
  // 文件上传状态
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  // 处理状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 结果
  const [result, setResult] = useState(null);
  
  // 在组件中其他状态下面添加详细结果状态
  const [detailedResult, setDetailedResult] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [showFullData, setShowFullData] = useState(false);
  
  // 完整Excel数据
  const [completeExcelData, setCompleteExcelData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // 价格组配置
  const [priceGroups, setPriceGroups] = useState([
    {
      numValue: 5, // 公司数量
      reduc: 0.95, // 调整比例
      ranges: [
        { start: 1, end: 10, min: 0.8, max: 1.2 }
      ]
    }
  ]);

  // 处理文件选择
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // 添加价格组
  const addPriceGroup = () => {
    setPriceGroups([
      ...priceGroups,
      {
        numValue: 5,
        reduc: 0.95,
        ranges: [{ start: 1, end: 10, min: 0.8, max: 1.2 }]
      }
    ]);
  };

  // 删除价格组
  const removePriceGroup = (index) => {
    if (priceGroups.length > 1) {
      const newGroups = [...priceGroups];
      newGroups.splice(index, 1);
      setPriceGroups(newGroups);
    } else {
      setError('至少需要一个价格组');
    }
  };

  // 更新价格组属性
  const updatePriceGroup = (index, field, value) => {
    const newGroups = [...priceGroups];
    newGroups[index][field] = value;
    setPriceGroups(newGroups);
  };

  // 添加价格区间
  const addRange = (groupIndex) => {
    const newGroups = [...priceGroups];
    newGroups[groupIndex].ranges.push({ start: 1, end: 10, min: 0.8, max: 1.2 });
    setPriceGroups(newGroups);
  };

  // 删除价格区间
  const removeRange = (groupIndex, rangeIndex) => {
    if (priceGroups[groupIndex].ranges.length > 1) {
      const newGroups = [...priceGroups];
      newGroups[groupIndex].ranges.splice(rangeIndex, 1);
      setPriceGroups(newGroups);
    } else {
      setError('每个价格组至少需要一个区间');
    }
  };

  // 更新价格区间属性
  const updateRange = (groupIndex, rangeIndex, field, value) => {
    const newGroups = [...priceGroups];
    newGroups[groupIndex].ranges[rangeIndex][field] = value;
    setPriceGroups(newGroups);
  };

  // 处理Tab切换
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 提交处理请求
  const handleSubmit = async () => {
    if (!file) {
      setError('请先选择Excel文件');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setResult(null);
    setCompleteExcelData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('price_groups', JSON.stringify(priceGroups));
      formData.append('include_full_data', 'true'); // 请求包含完整数据

      // 获取令牌（如果需要认证）
      const token = localStorage.getItem('access');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post('/api/list-simulator/', formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      setSuccess('处理成功');
      
      // 保存下载链接
      if (response.data.downloadUrl) {
        setDownloadUrl(response.data.downloadUrl);
      }
      
      // 存储完整Excel数据(如果有)
      if (response.data.fullExcelData) {
        setCompleteExcelData(response.data.fullExcelData);
      }

      // 保存详细结果
      if (response.data.list) {
        setDetailedResult(response.data.list);
      }
    } catch (err) {
      setError(err.response?.data?.error || '处理失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', my: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        清单价格计算器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        上传Excel文件并为每个报价组设置参数。
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>文件上传</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 1 }}>
              {fileName ? (
                <Typography>{fileName}</Typography>
              ) : (
                <Typography color="text.secondary">请选择Excel文件...</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              startIcon={<FileUploadIcon />}
            >
              选择文件
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>报价组设置</Typography>
        <Divider sx={{ mb: 2 }} />

        {priceGroups.map((group, groupIndex) => (
          <Box 
            key={groupIndex} 
            sx={{ 
              mb: 3,
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              position: 'relative'
            }}
          >
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <IconButton 
                color="error" 
                size="small"
                onClick={() => removePriceGroup(groupIndex)}
                disabled={priceGroups.length <= 1}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              报价组 {groupIndex + 1}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="公司数量"
                  type="number"
                  fullWidth
                  value={group.numValue}
                  onChange={(e) => updatePriceGroup(groupIndex, 'numValue', parseInt(e.target.value) || 1)}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="调整比例"
                  type="number"
                  fullWidth
                  value={group.reduc}
                  onChange={(e) => updatePriceGroup(groupIndex, 'reduc', parseFloat(e.target.value) || 0)}
                  InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
                  helperText="取值范围0-1，例如0.95表示下浮5%"
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle2" sx={{ mb: 1 }}>价格区间</Typography>
            
            {group.ranges.map((range, rangeIndex) => (
              <Grid container spacing={2} key={rangeIndex} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={5}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="起始排名%"
                      type="number"
                      fullWidth
                      value={range.start}
                      onChange={(e) => updateRange(groupIndex, rangeIndex, 'start', parseFloat(e.target.value) || 1)}
                      InputProps={{ inputProps: { min: 1, max: 100, step: 0.1 } }}
                    />
                    <TextField
                      label="截止排名%"
                      type="number"
                      fullWidth
                      value={range.end}
                      onChange={(e) => updateRange(groupIndex, rangeIndex, 'end', parseFloat(e.target.value) || 1)}
                      InputProps={{ inputProps: { min: 1, max: 100, step: 0.1 } }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="最小值"
                      type="number"
                      fullWidth
                      value={range.min}
                      onChange={(e) => updateRange(groupIndex, rangeIndex, 'min', parseFloat(e.target.value) || 0)}
                      InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    />
                    <TextField
                      label="最大值"
                      type="number"
                      fullWidth
                      value={range.max}
                      onChange={(e) => updateRange(groupIndex, rangeIndex, 'max', parseFloat(e.target.value) || 0)}
                      InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton 
                    color="error" 
                    onClick={() => removeRange(groupIndex, rangeIndex)}
                    disabled={group.ranges.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              size="small"
              onClick={() => addRange(groupIndex)}
            >
              添加价格区间
            </Button>
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={addPriceGroup}
          >
            添加报价组
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !file}
          >
            {loading ? <CircularProgress size={24} /> : '处理数据'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
      )}
      
      {result && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">处理结果</Typography>
            <Box>
              {downloadUrl && (
                <Button 
                  variant="contained" 
                  color="success"
                  href={downloadUrl}
                  startIcon={<FileUploadIcon style={{ transform: 'rotate(180deg)' }} />}
                >
                  下载Excel结果
                </Button>
              )}
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {/* 结果统计信息 */}
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              结果统计
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2">项目数量: <strong>{result.list?.length || 0}</strong></Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2">总价: <strong>{typeof result.total === 'number' ? result.total.toFixed(2) : 0}</strong></Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2">处理时间: <strong>{new Date().toLocaleTimeString()}</strong></Typography>
              </Grid>
            </Grid>
          </Box>
          
          {/* 标签页切换 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="结果摘要" />
              {completeExcelData && <Tab label="完整数据" />}
            </Tabs>
          </Box>
          
          {/* 结果摘要标签页 */}
          {activeTab === 0 && result.list && result.list.length > 0 && (
            <>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell width={50}>#</TableCell>
                      <TableCell>项目名称</TableCell>
                      <TableCell align="right" width={150}>价格</TableCell>
                      {detailedResult && detailedResult[0]?.details && (
                        Object.keys(detailedResult[0].details).map(key => (
                          <TableCell key={key} align="right">{key}</TableCell>
                        ))
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.list.map((item, index) => (
                      <TableRow 
                        key={index}
                        sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' } }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</TableCell>
                        {detailedResult && detailedResult[index]?.details && (
                          Object.values(detailedResult[index].details).map((val, i) => (
                            <TableCell key={i} align="right">
                              {typeof val === 'number' ? val.toFixed(2) : val}
                            </TableCell>
                          ))
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {/* 完整数据标签页 */}
          {activeTab === 1 && completeExcelData && (
            <>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {completeExcelData.columns.map((column, index) => (
                        <TableCell key={index} align={index > 0 ? "right" : "left"}>
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {completeExcelData.data.map((row, rowIndex) => (
                      <TableRow 
                        key={rowIndex}
                        sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' } }}
                      >
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex} align={cellIndex > 0 ? "right" : "left"}>
                            {typeof cell === 'number' ? cell.toFixed(2) : cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              总价: <strong>{typeof result.total === 'number' ? result.total.toFixed(2) : result.total}</strong>
            </Typography>
            
            {downloadUrl && (
              <Button 
                variant="contained" 
                color="success"
                href={downloadUrl}
                startIcon={<FileUploadIcon style={{ transform: 'rotate(180deg)' }} />}
              >
                下载Excel结果
              </Button>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
} 