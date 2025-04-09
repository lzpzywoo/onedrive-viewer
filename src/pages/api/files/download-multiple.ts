import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import JSZip from 'jszip';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 只接受POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }
  
  // 从Cookie中获取访问令牌
  const accessToken = req.cookies.access_token;
  
  if (!accessToken) {
    return res.status(401).json({ error: '未授权' });
  }
  
  try {
    const { fileIds } = req.body;
    
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ error: '请提供有效的文件ID列表' });
    }
    
    // 创建一个ZIP文件
    const zip = new JSZip();
    
    // 对每个文件ID获取文件信息和内容
    for (const fileId of fileIds) {
      // 获取文件信息
      const fileInfoResponse = await axios.get(
        `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      const fileName = fileInfoResponse.data.name;
      const downloadUrl = fileInfoResponse.data['@microsoft.graph.downloadUrl'];
      
      if (!downloadUrl) {
        continue; // 跳过无法下载的文件
      }
      
      // 获取文件内容
      const fileContentResponse = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
      });
      
      // 将文件添加到ZIP中
      zip.file(fileName, fileContentResponse.data);
    }
    
    // 生成ZIP文件
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=onedrive-files.zip');
    
    // 将ZIP内容发送到响应中
    const readable = new Readable();
    readable.push(zipBuffer);
    readable.push(null);
    
    await pipeline(readable, res);
    
  } catch (error: any) {
    console.error('下载多个文件失败:', error);
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ error: '会话已过期' });
    }
    
    return res.status(500).json({ error: '服务器错误' });
  }
}
