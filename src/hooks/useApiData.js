import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 封装今日更新数量的数据请求
export function useTodayUpdateCount() {
  return useQuery({
    queryKey: ['todayUpdateCount'],
    queryFn: async () => {
      const response = await axios.get('/api/today_update_count/');
      return response.data;
    },
    initialData: {
      project_count: 0,
      bid_count: 0,
      bid_result_count: 0
    },
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
  });
}

// 项目列表数据请求（搜索页面使用）
export function useProjectsList(page = 1, searchQuery = '', pageSize = 10) {
  return useQuery({
    queryKey: ['projects', page, searchQuery, pageSize],
    queryFn: async () => {
      let url = `/api/projects/?page=${page}&page_size=${pageSize}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const response = await axios.get(url);
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    keepPreviousData: true, // 保持之前的数据，避免页面切换时闪烁
  });
}

// 首页项目列表数据请求（首页组件使用）
export function useHomeProjectsList(page = 1, pageSize = 5) {
  return useQuery({
    queryKey: ['homeProjects', page, pageSize],
    queryFn: async () => {
      const response = await axios.get(`/api/projects/?page=${page}&page_size=${pageSize}`);
      return response.data;
    },
    staleTime: 4 * 60 * 60 * 1000, // 4小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    keepPreviousData: true,
  });
}

// 标段列表数据请求（搜索页面使用）
export function useBidsList(page = 1, searchQuery = '', pageSize = 10) {
  return useQuery({
    queryKey: ['bids', page, searchQuery, pageSize],
    queryFn: async () => {
      let url = `/api/bid_sections/?page=${page}&page_size=${pageSize}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const response = await axios.get(url);
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    keepPreviousData: true,
  });
}

// 首页标段列表数据请求（首页组件使用）
export function useHomeBidsList(page = 1, pageSize = 5) {
  return useQuery({
    queryKey: ['homeBids', page, pageSize],
    queryFn: async () => {
      const response = await axios.get(`/api/bid_sections/?page=${page}&page_size=${pageSize}`);
      return response.data;
    },
    staleTime: 4 * 60 * 60 * 1000, // 4小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    keepPreviousData: true,
  });
}

// 中标结果列表数据请求（搜索页面使用）
export function useBidResultsList(page = 1, searchQuery = '', pageSize = 10) {
  return useQuery({
    queryKey: ['bidResults', page, searchQuery, pageSize],
    queryFn: async () => {
      let url = `/api/bid_results/?page=${page}&page_size=${pageSize}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      const response = await axios.get(url);
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    keepPreviousData: true,
  });
}

// 首页中标结果列表数据请求（首页组件使用）
export function useHomeBidResultsList(page = 1, pageSize = 5) {
  return useQuery({
    queryKey: ['homeBidResults', page, pageSize],
    queryFn: async () => {
      const response = await axios.get(`/api/bid_results/?page=${page}&page_size=${pageSize}`);
      return response.data;
    },
    staleTime: 4 * 60 * 60 * 1000, // 4小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    keepPreviousData: true,
  });
}

// 公司搜索数据请求
export function useCompanySearch(query, enabled = false) {
  return useQuery({
    queryKey: ['companySearch', query],
    queryFn: async () => {
      const response = await axios.get(`/api/company-search?query=${encodeURIComponent(query)}`);
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    enabled: enabled && !!query.trim(), // 只有当 enabled 为 true 且 query 不为空时才执行
  });
}

// 公司投标记录数据请求
export function useCompanyBids(corpCode, page = 1, enabled = false) {
  return useQuery({
    queryKey: ['companyBids', corpCode, page],
    queryFn: async () => {
      const response = await axios.get(`/api/company-bids/?corp_code=${encodeURIComponent(corpCode)}&page=${page}`);
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    enabled: enabled && !!corpCode,
    keepPreviousData: true,
  });
}

// 公司中标记录数据请求
export function useCompanyWins(corpCode, page = 1, enabled = false) {
  return useQuery({
    queryKey: ['companyWins', corpCode, page],
    queryFn: async () => {
      const response = await axios.get(`/api/company-wins/?corp_code=${encodeURIComponent(corpCode)}&page=${page}`);
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    enabled: enabled && !!corpCode,
    keepPreviousData: true,
  });
}

// 公司全国业绩数据请求
export function useCompanyAchievements(corpCode, page = 1, enabled = false) {
  return useQuery({
    queryKey: ['companyAchievements', corpCode, page],
    queryFn: async () => {
      const response = await axios.get(`/api/company-achievements/?corp_code=${encodeURIComponent(corpCode)}&page=${page}`);
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    enabled: enabled && !!corpCode,
    keepPreviousData: true,
  });
}

// 公司项目经理业绩数据请求
export function useCompanyManagerPerformances(corpCode, page = 1, enabled = false) {
  return useQuery({
    queryKey: ['companyManagerPerformances', corpCode, page],
    queryFn: async () => {
      const response = await axios.get(`/api/company-manager-performances/?corp_code=${encodeURIComponent(corpCode)}&page=${page}`);
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24小时
    cacheTime: 25 * 60 * 60 * 1000, // 25小时
    enabled: enabled && !!corpCode,
    keepPreviousData: true,
  });
}

// 通用的 API 请求 hook，可以用于其他接口
export function useApiData(endpoint, queryKey, options = {}) {
  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      const response = await axios.get(endpoint);
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 25 * 60 * 60 * 1000,
    ...options
  });
} 