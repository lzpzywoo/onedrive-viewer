import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/utils/auth';
import { useEffect } from 'react';
import { handleAuthResult } from '@/utils/handleAuthResult';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 处理从认证页面返回的结果
    handleAuthResult();
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
