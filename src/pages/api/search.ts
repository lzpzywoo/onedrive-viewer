import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { FileItem } from '@/utils/types';

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
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: '搜索查询不能为空' });
    }
    
    // 使用Microsoft Graph API进行搜索
    const graphResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/root/search(q='${encodeURIComponent(query)}')`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    // 格式化返回数据
    const files: FileItem[] = graphResponse.data.value.map((item: any) => {
      const isFolder = !!item.folder;
      
      return {
        id: item.id,
        name: item.name,
        size: item.size,
        lastModified: item.lastModifiedDateTime,
        mimeType: item.file ? item.file.mimeType : 'folder',
        isFolder,
        downloadUrl: item['@microsoft.graph.downloadUrl'] || '',
        viewUrl: item['@microsoft.graph.downloadUrl'] || '',
        thumbnailUrl: '',
      };
    });
    
    return res.status(200).json({
      files,
      total: files.length,
    });
    
  } catch (error: any) {
    console.error('搜索文件失败:', error);
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ error: '会话已过期' });
    }
    
    return res.status(500).json({ error: '服务器错误' });
  }
}
