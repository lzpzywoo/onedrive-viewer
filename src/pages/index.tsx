import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import FileExplorer from '@/components/FileExplorer';
import LoginButton from '@/components/LoginButton';
import Header from '@/components/Header';
import { useAuth } from '@/utils/auth';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState('/');
  const [showDebugLink, setShowDebugLink] = useState(false);
  
  useEffect(() => {
    // 检查URL参数，是否来自回调
    const params = new URLSearchParams(window.location.search);
    if (params.has('error') || params.has('login')) {
      console.log('检测到认证相关参数:', Object.fromEntries(params.entries()));
    }
    
    // 开发环境下显示调试链接
    setShowDebugLink(process.env.NODE_ENV === 'development' || params.has('debug'));
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>OneDrive 文件浏览器</title>
        <meta name="description" content="一个强大的OneDrive文件浏览器" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">欢迎使用 OneDrive 文件浏览器</h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
              连接您的 OneDrive 账户，浏览和预览文件、视频、音频以及 Office 文档。
            </p>
            <LoginButton />
            
            {showDebugLink && (
              <div className="mt-8 pt-4 border-t border-gray-200 w-full max-w-md">
                <div className="text-center">
                  <h2 className="text-sm font-semibold text-gray-600 mb-2">调试工具</h2>
                  <div className="flex justify-center space-x-4">
                    <Link 
                      href="/test-auth" 
                      className="text-blue-600 hover:underline text-sm"
                    >
                      测试认证
                    </Link>
                    <Link 
                      href="/auth-debug" 
                      className="text-blue-600 hover:underline text-sm"
                    >
                      认证调试器
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <FileExplorer currentPath={currentPath} setCurrentPath={setCurrentPath} />
        )}
      </main>

      <footer className="bg-gray-100 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} OneDrive 文件浏览器</p>
        </div>
      </footer>
    </div>
  );
}
