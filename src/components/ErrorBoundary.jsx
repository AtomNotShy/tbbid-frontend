import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // 可以上报错误到服务端
    console.error('ErrorBoundary caught an error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{textAlign:'center',marginTop:80,fontSize:18,color:'#d32f2f'}}>页面出错了，请刷新或稍后重试。</div>;
    }
    return this.props.children;
  }
} 