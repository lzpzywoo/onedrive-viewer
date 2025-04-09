import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setQuery('');
      onSearch('');
    }
  };

  return (
    <div className={`relative transition-all duration-200 ${isExpanded ? 'w-64' : 'w-10'}`}>
      {isExpanded ? (
        <form onSubmit={handleSubmit} className="flex w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="搜索文件..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => !query && setIsExpanded(false)}
            className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-primary focus:border-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-3 py-2 rounded-r-md hover:bg-secondary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors"
          aria-label="搜索"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
