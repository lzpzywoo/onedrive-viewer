import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AuthDebug() {
  const [clientId, setClientId] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [envVars, setEnvVars] = useState<any>(null);
  
  useEffect(() => {
    // 尝试提取URL中的参数
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const code = params.get('code');
    const state = params.get('state');
    
    if (error) {
      addLog(`检测到错误参数: ${error}`);
    }
    
    if (code) {
      addLog(`检测到授权码: ${code.substring(0, 10)}...`);
    }
    
    if (state) {
      addLog(`检测到状态值: ${state}`);
      // 检查cookie中是否有对应的state
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      if (cookies['oauth_state']) {
        addLog(`Cookie中的状态值: ${cookies['oauth_state']}`);
        if (cookies['oauth_state'] === state) {
          addLog('✅ 状态值匹配!');
        } else {
          addLog('❌ 状态值不匹配!');
        }
      } else {
        addLog('❌ Cookie中没有找到状态值!');
      }
    }
    
    // 获取环境变量信息
    fetchEnvInfo();
  }, []);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };
  
  const fetchEnvInfo = async () => {
    setIsLoading(true);
    addLog('获取环境变量信息...');
    
    try {
      const response = await fetch('/api/auth/env-info');
      const data = await response.json();
      setEnvVars(data);
      addLog('✅ 成功获取环境变量信息');
      
      // 预填充表单
      if (data.NEXT_PUBLIC_MICROSOFT_CLIENT_ID) {
        setClientId(data.NEXT_PUBLIC_MICROSOFT_CLIENT_ID);
      }
      
      // 构建默认的回调URL
      const host = window.location.host;
      const protocol = window.location.protocol;
      const defaultRedirectUri = `${protocol}//${host}/api/auth/callback`;
      setRedirectUri(data.MICROSOFT_REDIRECT_URI || defaultRedirectUri);
      
    } catch (error) {
      addLog(`❌ 获取环境变量失败: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const testAuth = () => {
    if (!clientId) {
      addLog('❌ 客户端ID不能为空');
      return;
    }
    
    if (!redirectUri) {
      addLog('❌ 重定向URI不能为空');
      return;
    }
    
    addLog(`开始OAuth流程:`);
    addLog(`- 客户端ID: ${clientId}`);
    addLog(`- 重定向URI: ${redirectUri}`);
    
    // 生成状态值
    const state = Math.random().toString(36).substring(2, 15);
    addLog(`- 状态值: ${state}`);
    
    // 存储状态值到cookie
    document.cookie = `oauth_state=${state}; path=/; max-age=3600; samesite=lax`;
    addLog('- 已设置状态cookie');
    
    // 构建授权URL
    const scopes = 'files.read files.read.all sites.read.all';
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}&response_mode=query`;
    
    addLog(`正在重定向到: ${authUrl.substring(0, 100)}...`);
    
    // 重定向
    window.location.href = authUrl;
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <Head>
        <title>OneDrive OAuth调试工具</title>
      </Head>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h1 className="text-2xl font-bold">OneDrive OAuth调试工具</h1>
          <p className="mt-1 text-blue-100">用于诊断和测试Microsoft认证流程</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">OAuth配置</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      客户端ID
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="输入Azure应用注册中的客户端ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      重定向URI
                    </label>
                    <input
                      type="text"
                      value={redirectUri}
                      onChange={(e) => setRedirectUri(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="输入OAuth回调URL"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button
                      onClick={testAuth}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      启动OAuth流程
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-3">环境变量</h2>
                {isLoading ? (
                  <div className="text-center py-4">加载中...</div>
                ) : envVars ? (
                  <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-60">
                    <pre className="text-xs">
                      {JSON.stringify(envVars, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">未获取环境信息</div>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">操作日志</h2>
                <button
                  onClick={clearLogs}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  清除日志
                </button>
              </div>
              
              <div className="bg-black text-green-400 rounded-md p-4 font-mono text-sm h-96 overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="break-words">{log}</div>
                  ))
                ) : (
                  <div className="text-gray-500">等待操作...</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between">
            <Link href="/" className="text-blue-600 hover:underline">
              返回首页
            </Link>
            
            <div className="text-sm text-gray-500">
              版本 1.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
