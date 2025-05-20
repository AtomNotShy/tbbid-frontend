import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Divider, List, ListItem, ListItemText, Tabs, Tab, Grid, IconButton
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import { Link, useLocation } from 'react-router-dom';

export default function CompanySearch() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('basic');
  const [empPage, setEmpPage] = useState(1);
  const EMP_PAGE_SIZE = 20;
  const [bidPage, setBidPage] = useState(1);
  const [bidTotal, setBidTotal] = useState(0);
  const [bids, setBids] = useState([]);
  const BID_PAGE_SIZE = 20;
  const [hasSearched, setHasSearched] = useState(false);

  // 执行搜索
  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    axios.get(`/api/company-search?query=${encodeURIComponent(query)}`)
      .then(res => {
        setResults(Array.isArray(res.data) ? res.data : []);
        setSelected(null);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setSelected(null);
        setLoading(false);
      });
  }, [query]);

  // 初始加载时如果URL有查询参数则自动搜索
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery, handleSearch]);

  // 加载投标记录
  useEffect(() => {
    if (selected && tab === 'bidding') {
      axios.get(`/api/company-bids/?corp_code=${encodeURIComponent(selected.corp_code)}&page=${bidPage}`)
        .then(res => {
          setBids(res.data.results || []);
          setBidTotal(res.data.count || 0);
        })
        .catch(() => {
          setBids([]);
          setBidTotal(0);
        });
    }
  }, [selected, tab, bidPage]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight={700}>企业信息搜索</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          查询企业资质、信用和招投标记录
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>企业搜索</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>输入企业名称、统一社会信用代码或法定代表人进行搜索</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            placeholder="企业名称/统一社会信用代码/法定代表人"
            fullWidth
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            size="large"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            startIcon={<SearchIcon />}
            sx={{ minWidth: 120, height: '56px', fontSize: 16 }}
          >
            搜索
          </Button>
        </Box>
        {/* 搜索结果列表 */}
        {results.length > 0 && !selected && (
          <Box sx={{ mt: 4 }}>
            <Typography fontWeight={500} sx={{ mb: 2 }}>搜索结果</Typography>
            <List>
              {results.map(company => (
                <ListItem
                  key={company.id || company.corp_code}
                  button
                  onClick={() => setSelected(company)}
                  sx={{ border: '1px solid #eee', borderRadius: 2, mb: 2, '&:hover': { bgcolor: '#f5f5f7' } }}
                >
                  <ListItemText
                    primary={<Typography fontWeight={600}>{company.name}</Typography>}
                    secondary={
                      <span style={{ color: '#666', fontSize: 14 }}>
                        统一社会信用代码: {company.corp_code}
                        {company.corp && <><span style={{ margin: '0 12px' }}>|</span>法定代表人: {company.corp}</>}
                      </span>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        {/* 搜索后无结果显示 */}
        {hasSearched && results.length === 0 && !selected && !loading && (
          <Box sx={{ mt: 4, textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">暂无相关信息</Typography>
          </Box>
        )}
        {/* 详情页 */}
        {selected && (
          <Box sx={{ mt: 4 }}>
            <Button variant="text" size="small" onClick={() => setSelected(null)} sx={{ mb: 2 }}>
              ← 返回搜索结果
            </Button>
            <Tabs value={tab} onChange={(_, v) => { setTab(v); setEmpPage(1); }} sx={{ mb: 2 }}>
              <Tab label="基本信息" value="basic" />
              <Tab label="资质信息" value="qualification" />
              <Tab label="员工信息" value="employee" />
              <Tab label="招投标记录" value="bidding" />
            </Tabs>
            {tab === 'basic' && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1 }} />企业基本信息
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" fontSize={14}>企业名称</Typography>
                    <Typography fontWeight={500}>{selected.name}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" fontSize={14}>统一社会信用代码</Typography>
                    <Typography>{selected.corp_code}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" fontSize={14}>法定代表人</Typography>
                    <Typography>{selected.corp}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" fontSize={14}>注册资本</Typography>
                    <Typography>{selected.corp_asset || '—'}</Typography>
                  </Box>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography color="text.secondary" fontSize={14} sx={{ mr: 1 }}>有效期</Typography>
                    <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                    <Typography>{selected.valid_date || '—'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <FileCopyIcon sx={{ mr: 1 }} />联系方式
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                    <Typography color="text.secondary" fontSize={14} sx={{ mr: 1 }}>注册地址</Typography>
                    <Typography>{selected.reg_address || '—'}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </Grid>
              </Grid>
            )}
            {tab === 'qualification' && (
              <Box sx={{ mt: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 2 }}>资质信息</Typography>
                {selected.qualifications && selected.qualifications.length > 0 ? (
                  <List>
                    {selected.qualifications.map((q, idx) => (
                      <ListItem key={idx} divider>
                        <ListItemText primary={q} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">暂无资质信息</Typography>
                )}
              </Box>
            )}
            {tab === 'employee' && (
              <Box sx={{ mt: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 2 }}>员工信息{selected.employees.length > 0 ? `: ${selected.employees.length}个` : ''}</Typography>
                {selected.employees && selected.employees.length > 0 ? (
                  <>
                    <List>
                      {selected.employees.slice((empPage-1)*EMP_PAGE_SIZE, empPage*EMP_PAGE_SIZE).map(emp => (
                        <ListItem key={emp.id || emp.cert_code} divider>
                          <ListItemText
                            primary={<span>{emp.name}（{emp.role || '—'}）</span>}
                            secondary={<span>证书编号：{emp.cert_code || '—'}{emp.major ? `，专业：${Array.isArray(emp.major) ? emp.major.join('，') : emp.major}` : ''}</span>}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Pagination
                      count={Math.ceil(selected.employees.length / EMP_PAGE_SIZE)}
                      page={empPage}
                      onChange={(_, v) => setEmpPage(v)}
                      sx={{ mt: 2 }}
                    />
                  </>
                ) : (
                  <Typography color="text.secondary">暂无员工信息</Typography>
                )}
              </Box>
            )}
            {tab === 'bidding' && (
              <Box sx={{ mt: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 2 }}>招投标记录</Typography>
                {bids.length > 0 ? (
                  <>
                    <List>
                      {bids.map(bid => (
                        <ListItem
                          key={bid.id}
                          divider
                          button
                          component={Link}
                          to={`/project/${bid.project_id}`}
                          state={{ project_id: bid.project_id }}
                        >
                          <ListItemText
                            primary={<span>{bid.section_name}（{bid.project_id}）</span>}
                            secondary={<span>投标金额：{bid.bid_amount ? `¥${bid.bid_amount}` : '—'}，开标时间：{bid.bid_open_time ? bid.bid_open_time : '—'}</span>}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Pagination
                      count={Math.ceil(bidTotal / BID_PAGE_SIZE)}
                      page={bidPage}
                      onChange={(_, v) => setBidPage(v)}
                      sx={{ mt: 2 }}
                    />
                  </>
                ) : (
                  <Typography color="text.secondary">暂无招投标记录</Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
} 