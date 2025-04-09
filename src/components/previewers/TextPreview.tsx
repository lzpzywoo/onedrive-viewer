import { useState, useEffect } from 'react';
import { FileItem } from '@/utils/types';
import { fetchFileContent } from '@/utils/api';

interface TextPreviewProps {
  file: FileItem;
}

export default function TextPreview({ file }: TextPreviewProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError('');
        
        const fileContent = await fetchFileContent(file.id);
        setContent(fileContent);
      } catch (err) {
        console.error('Error loading file content:', err);
        setError('无法加载文件内容');
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, [file]);

  const getLanguageClass = () => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'language-javascript';
      case 'ts':
        return 'language-typescript';
      case 'html':
        return 'language-html';
      case 'css':
        return 'language-css';
      case 'json':
        return 'language-json';
      case 'xml':
        return 'language-xml';
      case 'yaml':
      case 'yml':
        return 'language-yaml';
      default:
        return 'language-plaintext';
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
        </div>
      ) : (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto w-full h-full">
          <pre className={`${getLanguageClass()} whitespace-pre-wrap`}>
            <code>{content}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
