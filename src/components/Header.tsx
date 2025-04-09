import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/utils/auth';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-800">OneDrive 浏览器</span>
            </Link>
          </div>

          <div className="md:hidden">
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-gray-700">
                  欢迎, {user?.displayName || '用户'}
                </div>
                <button
                  onClick={logout}
                  className="btn-secondary"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link href="/api/auth/login" className="btn-primary">
                登录
              </Link>
            )}
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            {isAuthenticated ? (
              <>
                <div className="text-gray-700 py-2">
                  欢迎, {user?.displayName || '用户'}
                </div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  退出登录
                </button>
              </>
            ) : (
              <Link 
                href="/api/auth/login" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                登录
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
