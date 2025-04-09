import { useState, useEffect } from 'react';
import FileList from './FileList';
import FileGrid from './FileGrid';
import PathBreadcrumb from './PathBreadcrumb';
import SearchBar from './SearchBar';
import { fetchFiles } from '@/utils/api';
import { FileItem } from '@/utils/types';

interface FileExplorerProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

export default function FileExplorer({ currentPath, setCurrentPath }: FileExplorerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        setError('');
        
        const result = await fetchFiles(currentPath, searchQuery, currentPage, itemsPerPage);
        
        setFiles(result.files);
        setTotalPages(Math.ceil(result.total / itemsPerPage));
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('加载文件时出错，请重试。');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [currentPath, searchQuery, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const filteredFiles = searchQuery
    ? files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <PathBreadcrumb path={currentPath} onNavigate={handleNavigate} />
        
        <div className="flex items-center space-x-4 self-end md:self-auto">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          {searchQuery ? '没有找到匹配的文件' : '此文件夹为空'}
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <FileList 
              files={filteredFiles} 
              onNavigate={handleNavigate} 
              currentPath={currentPath} 
            />
          ) : (
            <FileGrid 
              files={filteredFiles} 
              onNavigate={handleNavigate} 
              currentPath={currentPath} 
            />
          )}

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center">
                <button
                  onClick={() => handleChangePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md mr-2 bg-gray-100 disabled:opacity-50"
                >
                  上一页
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageToShow = totalPages <= 5 
                      ? i + 1 
                      : currentPage <= 3 
                        ? i + 1 
                        : currentPage >= totalPages - 2 
                          ? totalPages - 4 + i 
                          : currentPage - 2 + i;
                    
                    return (
                      <button
                        key={pageToShow}
                        onClick={() => handleChangePage(pageToShow)}
                        className={`w-8 h-8 rounded-full ${
                          currentPage === pageToShow 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-1">...</span>
                      <button
                        onClick={() => handleChangePage(totalPages)}
                        className="w-8 h-8 rounded-full bg-gray-100 text-gray-700"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => handleChangePage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md ml-2 bg-gray-100 disabled:opacity-50"
                >
                  下一页
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
