import { useEffect, useState } from 'react';
import { FileItem } from '@/utils/types';
import { getFileType } from '@/utils/fileHelpers';
import ImagePreview from './previewers/ImagePreview';
import VideoPreview from './previewers/VideoPreview';
import AudioPreview from './previewers/AudioPreview';
import OfficePreview from './previewers/OfficePreview';
import TextPreview from './previewers/TextPreview';
import PDFPreview from './previewers/PDFPreview';
import MarkdownPreview from './previewers/MarkdownPreview';

interface FilePreviewProps {
  file: FileItem;
  onClose: () => void;
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [file]);

  const renderPreviewContent = () => {
    const fileType = getFileType(file.name).toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    console.log("文件类型",fileType)
    // 根据文件类型渲染不同的预览组件
    if (/^image\//.test(file.mimeType) || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      return <ImagePreview file={file} />;
    }
    
    if (/^video\//.test(file.mimeType) || ['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return <VideoPreview file={file} />;
    }
    
    if (/^audio\//.test(file.mimeType) || ['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
      return <AudioPreview file={file} />;
    }
    
    if (['pdf'].includes(extension)) {
      return <PDFPreview file={file} />;
    }
    
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
      return <OfficePreview file={file} />;
    }
    
    if (['md', 'markdown'].includes(extension)) {
      return <MarkdownPreview file={file} />;
    }
    
    if (['txt', 'js', 'ts', 'html', 'css', 'json', 'xml', 'yaml', 'yml'].includes(extension)) {
      return <TextPreview file={file} />;
    }
    
    // 默认情况下，显示下载链接
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-600 mb-4">无法预览此文件类型</p>
        <a 
          href={file.downloadUrl}
          download={file.name}
          className="btn-primary"
          onClick={(e) => e.stopPropagation()}
        >
          下载文件
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium truncate">{file.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          ) : (
            renderPreviewContent()
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {getFileType(file.name)} · {new Date(file.lastModified).toLocaleString('zh-CN')}
          </span>
          <a 
            href={file.downloadUrl}
            download={file.name}
            className="btn-primary text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            下载
          </a>
        </div>
      </div>
    </div>
  );
}
