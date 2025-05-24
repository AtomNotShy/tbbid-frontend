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