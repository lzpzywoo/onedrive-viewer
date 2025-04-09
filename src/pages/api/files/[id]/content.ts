import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 从Cookie中获取访问令牌
  const accessToken = req.cookies.access_token;
  
  if (!accessToken) {
    return res.status(401).json({ error: '未授权' });
  }
  
  try {
    const { id } = req.query;
    
    // 首先获取文件的下载URL
    const fileResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    const downloadUrl = fileResponse.data['@microsoft.graph.downloadUrl'];
    
    if (!downloadUrl) {
      return res.status(404).json({ error: '找不到文件或无法获取下载链接' });
    }
    
    // 使用下载URL获取文件内容
    const contentResponse = await axios.get(downloadUrl);
    
    // 对于文本文件，直接返回内容
    return res.status(200).send(contentResponse.data);
    
  } catch (error: any) {
    console.error('获取文件内容失败:', error);
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ error: '会话已过期' });
    }
    
    return res.status(500).json({ error: '服务器错误' });
  }
}
