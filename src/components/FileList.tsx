import { useState } from 'react';
import { FileItem } from '@/utils/types';
import { formatFileSize, getFileIcon, getFileType } from '@/utils/fileHelpers';
import FilePreview from './FilePreview';

interface FileListProps {
  files: FileItem[];
  onNavigate: (path: string) => void;
  currentPath: string;
}

export default function FileList({ files, onNavigate, currentPath }: FileListProps) {
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
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-12 px-4 py-3">
                <span className="sr-only">选择</span>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                修改日期
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                大小
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr 
                key={file.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleFileClick(file)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={selectedItems.has(file.id)}
                    onChange={(e) => {}}
                    onClick={(e) => toggleSelectItem(file.id, e)}
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      {getFileIcon(file)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {file.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(file.lastModified).toLocaleString('zh-CN')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {file.isFolder ? '--' : formatFileSize(file.size)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {file.isFolder ? '文件夹' : getFileType(file.name)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPreview && selectedFile && (
        <FilePreview file={selectedFile} onClose={closePreview} />
      )}
    </div>
  );
}
