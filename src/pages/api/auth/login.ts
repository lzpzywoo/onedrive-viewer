import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Login endpoint triggered!');
  
  // 构建Microsoft OAuth登录URL
  const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
  const redirectUri = process.env.MICROSOFT_REDIRECT_URI;
  const scopes = process.env.MICROSOFT_SCOPES || 'files.read,files.read.all,sites.read.all';
  const baseUrl = process.env.BASE_URL || 'http://localhost';
  const port = process.env.PORT || '3000';
  
  // 输出调试信息
  console.log('OAuth configuration:');
  console.log('- Client ID:', clientId);
  console.log('- Redirect URI (env):', redirectUri);
  console.log('- Base URL:', baseUrl);
  console.log('- Port:', port);
  
  if (!clientId) {
    console.error('Missing client ID!');
    return res.status(500).json({ error: 'OAuth配置缺失: 未找到客户端ID' });
  }
  
  // 创建随机状态值以防止CSRF攻击
  const state = Math.random().toString(36).substring(2, 15);
  console.log('Generated state:', state);
  
  // 构建实际的回调URL - 确保使用绝对URL
  let callbackUrl;
  
  if (redirectUri) {
    callbackUrl = redirectUri;
  } else {
    // 使用当前请求的主机来构建回调URL
    const host = req.headers.host || `localhost:${port}`;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    callbackUrl = `${protocol}://${host}/api/auth/callback`;
  }
  
  console.log('Final callback URL:', callbackUrl);
  
  // 正确设置state cookie
  res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`);
  
  // 构建授权URL
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=${encodeURIComponent(scopes)}&state=${state}&response_mode=query`;
  
  console.log('Redirecting to auth URL:', authUrl);
  
  // 重定向到Microsoft登录页面
  res.redirect(authUrl);
}
