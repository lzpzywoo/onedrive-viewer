import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只返回公共环境变量和部分隐藏的私有环境变量
  const envInfo = {
    // 公共变量
    NEXT_PUBLIC_MICROSOFT_CLIENT_ID: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || '未设置',
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || '未设置',
    BASE_URL: process.env.BASE_URL || 'http://localhost',
    PORT: process.env.PORT || '3000',
    
    // 敏感变量 (只显示是否设置，不显示值)
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET ? '[已设置]' : '未设置',
    MICROSOFT_REDIRECT_URI: process.env.MICROSOFT_REDIRECT_URI || '未设置',
    MICROSOFT_SCOPES: process.env.MICROSOFT_SCOPES || 'files.read,files.read.all,sites.read.all',
    SESSION_SECRET: process.env.SESSION_SECRET ? '[已设置]' : '未设置',
    
    // 运行环境信息
    NODE_ENV: process.env.NODE_ENV,
    SERVER_HOST: req.headers.host || '未知',
    SERVER_PROTOCOL: req.headers['x-forwarded-proto'] || 'http',
    
    // 请求信息
    REQUEST_METHOD: req.method,
    REQUEST_URL: req.url,
    USER_AGENT: req.headers['user-agent'],
  };
  
  res.status(200).json(envInfo);
}
