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
    const { id } = req.query;
    
    // 获取文件详细信息
    const graphResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    const item = graphResponse.data;
    const isFolder = !!item.folder;
    
    // 格式化返回数据
    const file: FileItem = {
      id: item.id,
      name: item.name,
      size: item.size,
      lastModified: item.lastModifiedDateTime,
      mimeType: item.file ? item.file.mimeType : 'folder',
      isFolder,
      downloadUrl: item['@microsoft.graph.downloadUrl'] || '',
      viewUrl: item.webUrl || '',
      embedUrl: item.webUrl || '',
      thumbnailUrl: '',
    };
    
    // 如果有缩略图，获取缩略图URL
    if (!isFolder) {
      try {
        const thumbnailResponse = await axios.get(
          `https://graph.microsoft.com/v1.0/me/drive/items/${id}/thumbnails`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        
        if (thumbnailResponse.data.value && thumbnailResponse.data.value.length > 0) {
          file.thumbnailUrl = thumbnailResponse.data.value[0].large.url;
        }
      } catch (thumbnailError) {
        // 缩略图获取失败不影响整体功能
        console.warn('获取缩略图失败:', thumbnailError);
      }
    }
    
    return res.status(200).json(file);
    
  } catch (error: any) {
    console.error('获取文件详情失败:', error);
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ error: '会话已过期' });
    }
    
    return res.status(500).json({ error: '服务器错误' });
  }
}
