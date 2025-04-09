import axios from 'axios';
import { FileItem, FetchFilesResult } from './types';

// 创建API客户端实例
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 为每个请求添加认证token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('onedrive-viewer-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 获取文件列表
export async function fetchFiles(
  path: string = '/',
  search: string = '',
  page: number = 1,
  itemsPerPage: number = 20
): Promise<FetchFilesResult> {
  try {
    const response = await apiClient.get('/files', {
      params: {
        path,
        search,
        page,
        itemsPerPage,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('获取文件列表失败:', error);
    // 在实际应用中，这里可能需要根据错误类型进行不同的处理
    throw error;
  }
}

// 获取文件内容（用于预览文本文件）
export async function fetchFileContent(fileId: string): Promise<string> {
  try {
    const response = await apiClient.get(`/files/${fileId}/content`);
    return response.data;
  } catch (error) {
    console.error('获取文件内容失败:', error);
    throw error;
  }
}

// 获取受保护文件的访问凭证
export async function getFileAccessToken(fileId: string): Promise<string> {
  try {
    const response = await apiClient.get(`/files/${fileId}/access-token`);
    return response.data.accessToken;
  } catch (error) {
    console.error('获取文件访问凭证失败:', error);
    throw error;
  }
}

// 下载多个文件（生成zip包）
export async function downloadMultipleFiles(fileIds: string[]): Promise<string> {
  try {
    const response = await apiClient.post('/files/download-multiple', {
      fileIds,
    }, {
      responseType: 'blob',
    });
    
    // 创建一个下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'onedrive-files.zip');
    document.body.appendChild(link);
    link.click();
    
    // 清理
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return url;
  } catch (error) {
    console.error('下载多个文件失败:', error);
    throw error;
  }
}

// 搜索文件
export async function searchFiles(query: string): Promise<FileItem[]> {
  try {
    const response = await apiClient.get('/search', {
      params: { query },
    });
    
    return response.data.files;
  } catch (error) {
    console.error('搜索文件失败:', error);
    throw error;
  }
}

// 获取文件详细信息
export async function getFileDetails(fileId: string): Promise<FileItem> {
  try {
    const response = await apiClient.get(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('获取文件详情失败:', error);
    throw error;
  }
}
