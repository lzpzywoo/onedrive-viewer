interface PathBreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export default function PathBreadcrumb({ path, onNavigate }: PathBreadcrumbProps) {
  const pathParts = path.split('/').filter(Boolean);
  
  const buildPath = (index: number) => {
    if (index < 0) return '/';
    return '/' + pathParts.slice(0, index + 1).join('/');
  };

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
        <li className="inline-flex items-center">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            根目录
          </button>
        </li>
        
        {pathParts.map((part, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <button
                onClick={() => onNavigate(buildPath(index))}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-primary md:ml-2"
              >
                {part}
              </button>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
