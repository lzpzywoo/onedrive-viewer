import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function TestAuth() {
  const [logs, setLogs] = useState<string[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    // 检查URL参数，查看是否有回调信息
    const params = new URLSearchParams(window.location.search);
    if (params.has('callback_success')) {
      addLog('检测到回调成功标记!');
    }
    
    // 记录当前环境信息
    addLog(`当前URL: ${window.location.href}`);
    addLog(`当前主机: ${window.location.host}`);
    addLog(`当前路径: ${window.location.pathname}`);
  }, []);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };
  
  const handleLogin = async () => {
    addLog('触发登录流程...');
    
    try {
      // 直接使用前端重定向到登录API
      window.location.href = '/api/auth/login';
    } catch (error) {
      addLog(`登录错误: ${error}`);
    }
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">OneDrive认证测试页面</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            测试Microsoft登录
          </button>
          
          <button
            onClick={clearLogs}
            className="ml-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            清除日志
          </button>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">环境信息</h2>
          <div className="bg-gray-100 p-4 rounded">
            <div><strong>浏览器路径:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}</div>
            <div><strong>浏览器主机:</strong> {typeof window !== 'undefined' ? window.location.host : 'N/A'}</div>
            <div><strong>Next.js路由路径:</strong> {router.pathname}</div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">操作日志</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono h-64 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            ) : (
              <div className="text-gray-500">暂无日志...</div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
