import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 自动附加token和处理token过期
  useEffect(() => {
    // Request interceptor - 添加token
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem("access");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor - 处理token过期
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const refresh = localStorage.getItem("refresh");
          if (!refresh) {
            logout();
            return Promise.reject(error);
          }

          try {
            const res = await axios.post("/api/token/refresh/", { refresh });
            const { access } = res.data;
            localStorage.setItem("access", access);
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // 初始化时获取用户信息
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      axios.get("/api/user-info/")
        .then(res => setUser(res.data.user))
        .catch(() => {
          setUser(null);
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        });
    }
  }, []);

  // 登录后调用
  const login = ({ access, refresh }) => {
    return new Promise((resolve, reject) => {
      if (!access || !refresh) {
        console.error('Login failed: Missing tokens');
        reject('Missing tokens');
        return;
      }
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      // Get user info
      axios.get("/api/user-info/")
        .then(res => {
          setUser(res.data.user);
          resolve(res.data.user);
        })
        .catch(err => {
          console.error('Failed to get user info:', err);
          logout();
          reject(err);
        });
    });
  };

  // 登出
  const logout = async () => {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      try {
        await axios.post("/api/logout/", { refresh });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};