import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查认证状态
    const checkAuth = async () => {
      try {
        console.log('检查认证状态...');
        
        // 1. 首先检查本地存储中的用户信息
        const storedUser = localStorage.getItem('onedrive-viewer-user');
        
        if (storedUser) {
          console.log('找到存储的用户信息');
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          } catch (e) {
            console.error('解析存储的用户信息失败:', e);
            // 清除无效的存储
            localStorage.removeItem('onedrive-viewer-user');
          }
        }
        
        // 2. 如果本地没有用户信息，尝试从API获取当前用户
        try {
          console.log('尝试从API获取用户信息...');
          const response = await fetch('/api/auth/me');
          
          if (response.ok) {
            const userData = await response.json();
            console.log('获取到当前用户:', userData);
            
            // 保存用户信息
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('onedrive-viewer-user', JSON.stringify(userData));
          } else {
            console.log('未登录或会话已过期');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('获取用户信息失败:', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('认证检查失败:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // 检查URL参数，可能来自认证重定向
    const params = new URLSearchParams(window.location.search);
    if (params.has('auth')) {
      const authResult = params.get('auth');
      console.log('检测到认证结果:', authResult);
      
      // 清除URL参数
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // 认证成功后刷新检查
      if (authResult === 'success') {
        checkAuth();
      }
    }
  }, []);

  const login = async () => {
    console.log('开始登录流程...');
    window.location.href = '/api/auth/login';
  };

  const logout = async () => {
    try {
      console.log('注销中...');
      // 调用服务器API注销
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('API注销失败:', error);
    }
    
    // 即使API调用失败，也清除本地状态
    localStorage.removeItem('onedrive-viewer-user');
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('注销完成');
    
    // 强制刷新页面以确保状态被重置
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
