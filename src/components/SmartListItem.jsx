import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem } from '@mui/material';
import { useNavigation } from '../context/NavigationContext';

/**
 * 智能列表项 - 在跳转时保存返回信息
 * @param {Object} props
 * @param {string} props.to 跳转目标路径
 * @param {string} props.returnTo 返回路径
 * @param {Object} props.returnParams 返回时需要的参数
 * @param {string} props.sourceKey 来源页面标识，用于状态存储
 */
export default function SmartListItem({ 
  to, 
  returnTo = null,
  returnParams = {},
  sourceKey = null,
  state = {},
  ...props 
}) {
  const { savePageState } = useNavigation();
  
  // 处理点击事件，保存导航状态
  const handleClick = () => {
    if (sourceKey) {
      savePageState(sourceKey, {
        path: returnTo || window.location.pathname,
        params: returnParams,
      });
    }
  };

  // 创建包含返回信息的state
  const linkState = {
    ...state,
    ...(returnTo ? { returnTo, returnParams } : {})
  };

  return (
    <ListItem
      component={Link}
      to={to}
      state={linkState}
      onClick={handleClick}
      {...props}
    />
  );
} 