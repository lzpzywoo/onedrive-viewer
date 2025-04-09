import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 从Cookie中获取访问令牌
  const accessToken = req.cookies.access_token;
  
  if (!accessToken) {
    return res.status(401).json({ error: '未授权', message: '用户未登录或会话已过期' });
  }
  
  try {
    // 使用令牌获取用户信息
    const graphResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    // 构建用户信息对象
    const user = {
      id: graphResponse.data.id,
      displayName: graphResponse.data.displayName,
      email: graphResponse.data.userPrincipalName,
      // 可选提取更多字段
      jobTitle: graphResponse.data.jobTitle,
      officeLocation: graphResponse.data.officeLocation,
      preferredLanguage: graphResponse.data.preferredLanguage,
    };
    
    // 尝试获取用户照片（如果可用）
    try {
      await axios.get('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'arraybuffer',
      }).then(photoResponse => {
        // 将图片转换为base64
        const photoBase64 = Buffer.from(photoResponse.data).toString('base64');
        user.photo = `data:${photoResponse.headers['content-type']};base64,${photoBase64}`;
      });
    } catch (photoError) {
      // 照片获取失败，不影响整体功能
      console.log('获取用户照片失败（非关键错误）');
    }
    
    return res.status(200).json(user);
  } catch (error: any) {
    // 处理令牌过期情况
    if (error.response && error.response.status === 401) {
      // 清除无效的cookie
      res.setHeader('Set-Cookie', [
        'access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
        'refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
      ]);
      
      return res.status(401).json({ error: '会话已过期', message: '用户会话已过期，请重新登录' });
    }
    
    console.error('获取用户信息失败:', error);
    
    // 返回详细的错误信息以帮助调试
    return res.status(500).json({ 
      error: '服务器错误',
      message: '获取用户信息失败',
      details: error.message,
      ...(error.response ? { 
        statusCode: error.response.status,
        responseData: error.response.data
      } : {})
    });
  }
}
