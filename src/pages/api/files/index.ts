import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { FileItem } from '@/utils/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 从Cookie中获取访问令牌
  const accessToken = req.cookies.access_token;
  const nextPageToken = localStorage.getItem('next_page_token');
  
  if (!accessToken) {
    return res.status(401).json({ error: '未授权' });
  }
  
  try {
    const { path = '/', search = '', page = '1', itemsPerPage = '20' } = req.query;
    
    // 计算分页参数
    const pageNum = parseInt(page as string, 10);
    const itemsPerPageNum = parseInt(itemsPerPage as string, 10);
    const skip = (pageNum - 1) * itemsPerPageNum;
    
    // 构建API请求URL
    let apiUrl = '';
    let queryParams = '';
    
    if (search) {
      // 如果有搜索查询，使用搜索API
      apiUrl = 'https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'';
      queryParams = `${search}\')`;
    } else {
      // 否则获取指定路径的内容
      if (path === '/') {
        apiUrl = 'https://graph.microsoft.com/v1.0/me/drive/root/children';
      } else {
        // 移除开头的斜杠并使用path API
        const cleanPath = (path as string).replace(/^\//, '');
        apiUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(cleanPath)}:/children`;
      }
    }

    // 添加分页和排序参数

    if (nextPageToken) {
      // 如果有下一页令牌，使用它
      apiUrl = `?$top=${itemsPerPageNum}&$orderby=name` + `&$skiptoken=${nextPageToken}`;
    } else {
      apiUrl += `?$top=${itemsPerPageNum}&$orderby=name`;
    }

    // 发起Graph API请求
    const graphResponse = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    // 获取总计数（用于分页）
    const total = graphResponse.data.value.length;

    graphResponse.data['@odata.nextLink'] && localStorage.setItem('next_page_token', graphResponse.data['@odata.nextLink'].match(/&\$skiptoken=(.+)/i)[1]);

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
        viewUrl: item.webUrl || '',
        thumbnailUrl: item.thumbnailUrl || '',
      };
    });
    
    return res.status(200).json({
      files,
      total,
      hasMore: !!graphResponse.data['@odata.nextLink'],
    });
    
  } catch (error: any) {
    console.error('获取文件列表失败:', error);
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ error: '会话已过期' });
    }
    
    return res.status(500).json({ error: '服务器错误' });
  }
}
