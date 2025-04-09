/**
 * 处理认证重定向返回的结果
 */
export function handleAuthResult() {
  // 只在客户端执行
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const loginSuccess = urlParams.get('login') === 'success';
  const user = urlParams.get('user');
  console.log('处理OAuth回调:', { error, loginSuccess, user });
  
  // 清除URL中的查询参数，保持干净的URL
  if (error || loginSuccess) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  // 处理登录错误
  if (error) {
    let errorMessage;
    switch (error) {
      case 'invalid_state':
        errorMessage = '安全验证失败，请重新登录';
        break;
      case 'missing_oauth_config':
        errorMessage = '应用配置错误，请联系管理员';
        break;
      case 'auth_failed':
        errorMessage = '登录失败，请重试';
        break;
      default:
        errorMessage = `登录时发生错误: ${error}`;
    }
    
    // 显示错误消息，可以用你喜欢的方式（alert、toast等）
    alert(errorMessage);
    console.error('登录错误:', errorMessage);
    return;
  }
  
  // 处理成功登录
  if (loginSuccess && user) {
    try {
      const userData = JSON.parse(user);
      
      // 存储用户信息到localStorage，以便应用的其他部分访问
      localStorage.setItem('onedrive-viewer-user', JSON.stringify(userData));
      
      // 刷新页面以应用登录状态
      window.location.reload();
    } catch (e) {
      console.error('解析用户数据失败:', e);
    }
  }
}
