import { useState } from 'react';
import { FileItem } from '@/utils/types';
import { formatFileSize, getFileIcon, getFileType } from '@/utils/fileHelpers';
import FilePreview from './FilePreview';

interface FileGridProps {
  files: FileItem[];
  onNavigate: (path: string) => void;
  currentPath: string;
}

export default function FileGrid({ files, onNavigate, currentPath }: FileGridProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleFileClick = (file: FileItem) => {
    if (file.isFolder) {
      const newPath = currentPath === '/' 
        ? `/${file.name}` 
        : `${currentPath}/${file.name}`;
      onNavigate(newPath);
    } else {
      setSelectedFile(file);
      setShowPreview(true);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedFile(null);
  };

  const toggleSelectItem = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelectedItems = new Set(selectedItems);
    
    if (selectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    
    setSelectedItems(newSelectedItems);
  };

  const handleDownloadSelected = () => {
    const selectedFiles = files.filter(file => selectedItems.has(file.id));
    // 实现多文件下载逻辑
    console.log('下载选中的文件:', selectedFiles);
  };

  return (
    <div>
      {selectedItems.size > 0 && (
        <div className="mb-4 p-2 bg-gray-100 rounded-md flex justify-between items-center">
          <span>已选择 {selectedItems.size} 个项目</span>
          <button 
            onClick={handleDownloadSelected}
            className="btn-primary text-sm py-1"
          >
            下载选中的文件
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="file-card flex flex-col items-center p-4 relative group"
            onClick={() => handleFileClick(file)}
          >
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                checked={selectedItems.has(file.id)}
                onChange={(e) => {}}
                onClick={(e) => toggleSelectItem(file.id, e)}
              />
            </div>
            
            <div className="mb-2 h-16 w-16 flex items-center justify-center">
              {getFileIcon(file, 40)}
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 truncate w-full" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {file.isFolder ? '文件夹' : getFileType(file.name)}
              </p>
              <p className="text-xs text-gray-500">
                {file.isFolder ? '' : formatFileSize(file.size)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showPreview && selectedFile && (
        <FilePreview file={selectedFile} onClose={closePreview} />
      )}
    </div>
  );
}
