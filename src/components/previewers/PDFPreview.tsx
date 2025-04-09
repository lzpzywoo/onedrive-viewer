import { useState } from 'react';
import { FileItem } from '@/utils/types';

interface PDFPreviewProps {
  file: FileItem;
}

export default function PDFPreview({ file }: PDFPreviewProps) {
  const [loading, setLoading] = useState(true);
  
  return (
    <div className="w-full h-full flex flex-col">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      <iframe
        src={`${file.viewUrl || file.downloadUrl}#toolbar=1&navpanes=1&scrollbar=1`}
        width="100%"
        height="100%"
        frameBorder="0"
        onLoad={() => setLoading(false)}
        className="flex-1"
        title={`PDF 预览 - ${file.name}`}
        allowFullScreen
      />
    </div>
  );
}
