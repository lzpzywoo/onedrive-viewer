import { useState } from 'react';
import { FileItem } from '@/utils/types';

interface OfficePreviewProps {
  file: FileItem;
}

export default function OfficePreview({ file }: OfficePreviewProps) {
  const [loading, setLoading] = useState(true);
  
  // Microsoft Office 文档预览使用 Office Online 或 Microsoft Graph API 的预览功能
  const getEmbedUrl = () => {
    // 如果已有预览URL，直接使用
    if (file.embedUrl) return file.embedUrl;
    
    // 否则使用 Office Online Viewer
    const encodedUrl = encodeURIComponent(file.viewUrl || file.downloadUrl);
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      <iframe
        src={getEmbedUrl()}
        width="100%"
        height="100%"
        frameBorder="0"
        onLoad={() => setLoading(false)}
        className="flex-1"
        title={`Office 文档预览 - ${file.name}`}
        allowFullScreen
      />
    </div>
  );
}
