import { useState, useEffect } from 'react';
import { FileItem } from '@/utils/types';
import { fetchFileContent } from '@/utils/api';

interface MarkdownPreviewProps {
  file: FileItem;
}

export default function MarkdownPreview({ file }: MarkdownPreviewProps) {
  const [markdown, setMarkdown] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');
  
  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError('');
        
        const content = await fetchFileContent(file.id);
        setMarkdown(content);
        
        // 转换 Markdown 为 HTML
        if (typeof window !== 'undefined') {
          try {
            // 动态导入 marked 库 (需要在 package.json 中添加)
            const marked = (await import('marked')).default;
            const html = marked.parse(content);
            setHtml(html);
          } catch (err) {
            // 如果无法加载 marked 库，使用基本的转换
            setHtml(`<div>${content.replace(/\n/g, '<br>')}</div>`);
          }
        }
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError('无法加载Markdown内容');
      } finally {
        setLoading(false);
      }
    };
    
    loadMarkdown();
  }, [file]);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'preview' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewMode('preview')}
          >
            预览
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === 'source' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setViewMode('source')}
          >
            源代码
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center flex-1 text-red-500">
          {error}
        </div>
      ) : viewMode === 'preview' ? (
        <div 
          className="markdown-preview bg-white p-6 overflow-auto flex-1 prose prose-sm sm:prose lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto flex-1">
          <pre className="language-markdown whitespace-pre-wrap">
            <code>{markdown}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
