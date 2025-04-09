import { FileItem } from './types';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    // 文档
    case 'doc':
    case 'docx':
      return 'Word文档';
    case 'xls':
    case 'xlsx':
      return 'Excel表格';
    case 'ppt':
    case 'pptx':
      return 'PowerPoint演示文稿';
    case 'pdf':
      return 'PDF文档';
    case 'txt':
      return '文本文件';
    case 'md':
      return 'Markdown';
      
    // 图片
    case 'jpg':
    case 'jpeg':
      return 'JPEG图片';
    case 'png':
      return 'PNG图片';
    case 'gif':
      return 'GIF图片';
    case 'svg':
      return 'SVG矢量图';
    case 'webp':
      return 'WebP图片';
      
    // 视频
    case 'mp4':
      return 'MP4视频';
    case 'webm':
      return 'WebM视频';
    case 'mov':
      return 'QuickTime视频';
    case 'avi':
      return 'AVI视频';
      
    // 音频
    case 'mp3':
      return 'MP3音频';
    case 'wav':
      return 'WAV音频';
    case 'ogg':
      return 'OGG音频';
    case 'flac':
      return 'FLAC音频';
      
    // 代码和配置
    case 'js':
      return 'JavaScript';
    case 'ts':
      return 'TypeScript';
    case 'html':
      return 'HTML';
    case 'css':
      return 'CSS';
    case 'json':
      return 'JSON';
    case 'xml':
      return 'XML';
    case 'yaml':
    case 'yml':
      return 'YAML';
      
    // 压缩文件
    case 'zip':
      return 'ZIP压缩包';
    case 'rar':
      return 'RAR压缩包';
    case '7z':
      return '7Z压缩包';
    case 'tar':
      return 'TAR归档文件';
    case 'gz':
      return 'GZip压缩文件';
      
    default:
      return extension ? extension.toUpperCase() : '未知类型';
  }
}

export function getFileIcon(file: FileItem, size: number = 24) {
  if (file.isFolder) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-yellow-500"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
    );
  }
  
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // 定义图标映射
  const iconMap: Record<string, JSX.Element> = {
    // 文档
    doc: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-blue-600"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    docx: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-blue-600"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    xls: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-green-600"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </svg>
    ),
    xlsx: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-green-600"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </svg>
    ),
    ppt: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-orange-600"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
    ),
    pptx: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-orange-600"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
    ),
    pdf: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-red-600"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
    ),
    
    // 图片
    jpg: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-purple-500"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    ),
    jpeg: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-purple-500"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    ),
    png: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-purple-500"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    ),
    
    // 视频
    mp4: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-red-500"
      >
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    ),
    webm: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-red-500"
      >
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    ),
    
    // 音频
    mp3: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-green-500"
      >
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
    ),
    wav: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-green-500"
      >
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>
    ),
    
    // 代码
    js: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-yellow-400"
      >
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    ts: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-blue-400"
      >
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    
    // 通用文本
    txt: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-gray-500"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    
    // Markdown
    md: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-blue-400"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </svg>
    ),
    
    // 压缩文件
    zip: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-yellow-600"
      >
        <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"></path>
        <path d="M4 16s.5-2 2-2 2.5 2 4 2 2.5-2 4-2 2 2 2 2"></path>
        <path d="M2 8l9-4.5L20 8"></path>
      </svg>
    ),
    rar: (
      <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" 
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className="text-yellow-600"
      >
        <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"></path>
        <path d="M4 16s.5-2 2-2 2.5 2 4 2 2.5-2 4-2 2 2 2 2"></path>
        <path d="M2 8l9-4.5L20 8"></path>
      </svg>
    ),
  };

  // 返回匹配的图标或默认图标
  return iconMap[extension] || (
    <svg xmlns="http://www.w3.org/2000/svg" 
      width={size} height={size} viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className="text-gray-500"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  );
}
