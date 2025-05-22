import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { useNavigation } from '../context/NavigationContext';

/**
 * 智能返回按钮
 * @param {Object} props 
 * @param {string} props.fallbackPath 默认返回路径，当没有历史记录时使用
 * @param {string} props.sourceKey 来源页面的标识
 * @param {string} props.label 按钮文本
 * @param {Object} props.sx MUI样式
 */
export default function BackButton({
  fallbackPath = '/',
  sourceKey = null,
  label = '返回',
  sx = {},
  ...props
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getPageState } = useNavigation();

  const handleBack = () => {
    // 1. 检查location.state中是否有返回信息
    const stateSource = location.state?.returnTo;
    const stateParams = location.state?.returnParams;
    
    if (stateSource) {
      // 使用state中的返回信息
      navigate(stateSource, { 
        state: stateParams || {},
        replace: true 
      });
      return;
    }
    
    // 2. 检查NavigationContext中是否有保存的状态
    if (sourceKey) {
      const savedState = getPageState(sourceKey);
      if (savedState?.path) {
        navigate(savedState.path, {
          state: savedState.params || {},
          replace: true
        });
        return;
      }
    }
    
    // 3. 尝试浏览器历史返回
    try {
      navigate(-1);
    } catch (e) {
      // 4. 如果历史记录为空，则返回到fallbackPath
      navigate(fallbackPath, { replace: true });
    }
  };

  return (
    <Button 
      variant="text" 
      onClick={handleBack} 
      sx={{ display: 'flex', alignItems: 'center', ...sx }}
      {...props}
    >
      <span style={{ marginRight: '4px' }}>←</span> {label}
    </Button>
  );
} 