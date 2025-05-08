import { useState, useEffect } from 'react';
import { type Project } from '../types';

// Add this custom hook at the top of your file
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 1500); // 500ms delay
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          search: debouncedSearchQuery,
        });

        const response = await fetch(
          `http://localhost:8080/api/projects?${params.toString()}`
        );

        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const data = await response.json();
        setProjects(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, debouncedSearchQuery, limit]); // Use debounced search query here

  // Reset to first page when debounced search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  // Keep the rest of the component the same
  const handlePrevious = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(p => p + 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg max-w-2xl mx-auto mt-4">
        Error: {error}
      </div>
    );
  }
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <a href="#"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1.5 border rounded-md text-sm font-medium 
            ${
              page === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
            }`}
        >
          Previous
        </a>

        {startPage > 1 && (
         <a href="#"
            onClick={() => handlePageChange(1)}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm font-medium rounded-md"
          >
            1
          </a>
        )}

        {startPage > 2 && <span className="px-2 text-gray-500">...</span>}

        {pageNumbers.map((pageNumber) => (
          <a href="#"
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-3 py-1.5 border rounded-md text-sm font-medium 
              ${
                page === pageNumber
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'text-gray-600 hover:bg-gray-100 border-gray-200'
              }`}
          >
            {pageNumber}
          </a>
        ))}

        {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}

        {endPage < totalPages && (
          <a href="#"
            onClick={() => handlePageChange(totalPages)}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm font-medium rounded-md"
          >
            {totalPages}
          </a>
        )}

        <a href="#"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-3 py-1.5 border rounded-md text-sm font-medium 
            ${
              page === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
            }`}
        >
          Next
        </a>
      </div>
    );
  };
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {projects.length === 0 ? (
        <div className="text-center text-gray-500">No projects found</div>
      ) : (
        <>
        <div className='grid grid-cols-2 gap-2'>
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
            ))}

          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
        </div>
        {totalPages > 1 && renderPagination()}
      </div>
        </>
      )}
    </div>
  );
};

export default ProjectList;