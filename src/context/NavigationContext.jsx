import React, { createContext, useState, useContext } from 'react';

// 创建导航上下文
export const NavigationContext = createContext();

// 自定义hook，方便组件内使用
export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
  // 存储各页面的返回路径信息
  const [navigationStates, setNavigationStates] = useState({});

  // 保存页面状态 - 当离开页面时调用
  const savePageState = (pageId, state) => {
    setNavigationStates(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        ...state,
        timestamp: Date.now()
      }
    }));
  };

  // 获取页面状态 - 当返回页面时调用
  const getPageState = (pageId) => {
    return navigationStates[pageId] || null;
  };

  // 清除页面状态 - 可选，用于管理内存
  const clearPageState = (pageId) => {
    setNavigationStates(prev => {
      const newState = { ...prev };
      delete newState[pageId];
      return newState;
    });
  };

  // 清除超过一定时间的状态，避免内存泄漏
  const clearOldStates = (maxAgeMinutes = 30) => {
    const now = Date.now();
    const maxAge = maxAgeMinutes * 60 * 1000;
    
    setNavigationStates(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (now - newState[key].timestamp > maxAge) {
          delete newState[key];
        }
      });
      return newState;
    });
  };

  // 定期清理旧状态
  React.useEffect(() => {
    const interval = setInterval(() => clearOldStates(), 15 * 60 * 1000); // 每15分钟清理一次
    return () => clearInterval(interval);
  }, []);

  return (
    <NavigationContext.Provider value={{ 
      savePageState, 
      getPageState, 
      clearPageState
    }}>
      {children}
    </NavigationContext.Provider>
  );
}; 