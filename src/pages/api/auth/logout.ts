import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只接受POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许', message: '只接受POST请求' });
  }
  
  try {
    // 清除所有与身份验证相关的Cookie
    res.setHeader('Set-Cookie', [
      'access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
      'refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
      'oauth_state=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
    ]);
    
    // 提供更多详细的响应信息
    return res.status(200).json({ 
      success: true, 
      message: '成功注销，所有会话已清除'
    });
  } catch (error: any) {
    console.error('注销过程中出错:', error);
    return res.status(500).json({ 
      error: '服务器错误', 
      message: '注销过程中出错',
      details: error.message 
    });
  }
}
