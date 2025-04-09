import { useState } from 'react';
import { FileItem } from '@/utils/types';

interface ImagePreviewProps {
  file: FileItem;
}

export default function ImagePreview({ file }: ImagePreviewProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      <img
        src={file.viewUrl || file.downloadUrl}
        alt={file.name}
        className={`max-h-full max-w-full object-contain transition-transform duration-200 cursor-pointer ${
          isZoomed ? 'scale-150' : 'scale-100'
        }`}
        onClick={toggleZoom}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
