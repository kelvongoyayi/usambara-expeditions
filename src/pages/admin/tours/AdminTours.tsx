import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, List as ListIcon, Grid as GridIcon } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAuth } from '../../../contexts/AuthContext';
import TourList from '../../../components/admin/Tours/TourList';
import { toursService, Tour } from '../../../services/tours.service';
import toast from 'react-hot-toast';

const AdminTours: React.FC = () => {
  const { isAdmin } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortField, setSortField] = useState<keyof Tour>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [categories, setCategories] = useState<{id: string; name: string}[]>([
    {id: 'all', name: 'All Categories'}
  ]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch tours and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch tours
        const toursData = await toursService.getTours();
        setTours(toursData);
        setFilteredTours(toursData); // Initially all tours are filtered

        // Fetch categories
        setLoadingCategories(true);
        const categoriesData = await toursService.getTourCategories();
        setCategories([{id: 'all', name: 'All Categories'}, ...categoriesData]);
        setLoadingCategories(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load tours');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting whenever related states change
  useEffect(() => {
    // Filter tours based on search and category
    let filtered = [...tours];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        tour => 
          tour.title.toLowerCase().includes(term) || 
          tour.description.toLowerCase().includes(term) || 
          tour.location?.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(tour => tour.category === filterCategory);
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Handle boolean values specially for featured sorting
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc'
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1);
      }
      
      // Default numeric comparison with optional chaining to handle undefined values
      return sortDirection === 'asc'
        ? ((aValue ?? 0) < (bValue ?? 0) ? -1 : 1)
        : ((aValue ?? 0) > (bValue ?? 0) ? -1 : 1);
    });
    
    setFilteredTours(filtered);
  }, [tours, searchTerm, filterCategory, sortField, sortDirection]);

  // Handle search changes
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle filter changes
  const handleFilterChange = (category: string) => {
    setFilterCategory(category);
  };

  // Handle sort changes
  const handleSortChange = (field: keyof Tour, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Handle tour deletion
  const handleDeleteTour = async (id: string, title: string) => {
    // Show confirmation dialog
    if (!window.confirm(`Are you sure you want to delete the tour "${title}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setLoading(true);
      const success = await toursService.deleteTour(id);
      
      if (success) {
        // Remove the deleted tour from the state
        setTours(prevTours => prevTours.filter(tour => tour.id !== id));
        toast.success(`Tour "${title}" deleted successfully`);
      } else {
        throw new Error('Failed to delete tour');
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tours Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your adventure tour offerings
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              to="/admin/tours/create" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Tour
            </Link>
            <Link
              to="/admin/tours/categories"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              Manage Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Tour Count Display */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredTours.length} of {tours.length} tours.
        {filterCategory !== 'all' && ` (Filtered by: ${categories.find(c => c.id === filterCategory)?.name || filterCategory})`}
        {searchTerm && ` (Search term: "${searchTerm}")`}
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Pass filtered tours to the list */}
      <TourList 
        tours={filteredTours}
        isLoading={loading}
        onDelete={handleDeleteTour}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        filterCategory={filterCategory}
        categories={categories}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />
    </AdminLayout>
  );
};

export default AdminTours;