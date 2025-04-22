import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit, Trash2, Eye, Search, Filter, ArrowUp, ArrowDown, 
  Grid, List, Camera, Info,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { Tour } from '../../../services/tours.service';
import LoadingImage from '../../ui/LoadingImage';
import { Badge, Skeleton, ConfirmDialog, Modal } from '../../../components/ui';
import { format } from 'date-fns';

interface TourListProps {
  tours: Tour[];
  isLoading: boolean;
  onDelete: (id: string, title: string) => void;
  onSortChange?: (field: keyof Tour, direction: 'asc' | 'desc') => void;
  onFilterChange?: (category: string) => void;
  filterCategory: string;
  categories: { id: string; name: string }[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const TourList: React.FC<TourListProps> = ({
  tours,
  isLoading,
  onDelete,
  onSortChange,
  onFilterChange,
  filterCategory,
  categories,
  searchTerm,
  onSearchChange
}) => {
  const [sortField, setSortField] = useState<keyof Tour>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [tourToDelete, setTourToDelete] = useState<{id: string, title: string} | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedTourForModal, setSelectedTourForModal] = useState<Tour | null>(null);

  const handleSort = (field: keyof Tour) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    
    if (onSortChange) {
      onSortChange(field, newDirection);
    }
  };

  const renderSortIndicator = (field: keyof Tour) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 ml-1" /> : 
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

  const handleDeleteClick = (id: string, title: string) => {
    setTourToDelete({ id, title });
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (tourToDelete) {
      onDelete(tourToDelete.id, tourToDelete.title);
      setShowDeleteDialog(false);
      setTourToDelete(null);
    }
  };

  const openDetailsModal = (tour: Tour) => {
    setSelectedTourForModal(tour);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedTourForModal(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (_) {
      return 'Invalid date';
    }
  };

  const renderCardsView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map(tour => (
          <div 
            key={tour.id} 
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-visible flex flex-col transition-all hover:-translate-y-1 hover:shadow-md duration-200 relative"
          >
            <div className="h-48 overflow-hidden relative bg-gray-100 rounded-t-lg"> 
              <LoadingImage
                src={tour.image_url || '/placeholder-tour.jpg'}
                alt={tour.title}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                loading="lazy"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-brand-100 text-brand-800">
                  {tour.category}
                </Badge>
              </div>
              {tour.featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Featured
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-4 flex-grow flex flex-col">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2">{tour.title}</h3>
              
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center text-gray-700 text-sm">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  {tour.duration}
                </span>
                <span className="font-bold text-brand-600">${Number(tour.price).toFixed(2)}</span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                {tour.description}
              </p>
              
              <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Link 
                    to={`/tour/${tour.id}`} 
                    target="_blank"
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    title="View Tour"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link 
                    to={`/admin/tours/edit/${encodeURIComponent(tour.id.toString())}`}
                    className="p-2 text-amber-600 hover:text-amber-800 transition-colors"
                    title="Edit Tour"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDeleteClick(tour.id, tour.title)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Tour"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => openDetailsModal(tour)}
                  className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                  title="View Details"
                >
                  <Info className={`w-5 h-5`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTableView = () => {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('title')}>
                  Title {renderSortIndicator('title')}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('category' as keyof Tour)}>
                  Category {renderSortIndicator('category' as keyof Tour)}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('duration')}>
                  Duration {renderSortIndicator('duration')}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort('price')}>
                  Price {renderSortIndicator('price')}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tours.map((tour) => (
              <React.Fragment key={tour.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 overflow-hidden rounded-md bg-gray-100">
                      <LoadingImage
                        className="h-12 w-12 rounded-md object-cover"
                        src={tour.image_url || '/placeholder-tour.jpg'}
                        alt={tour.title}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{tour.title}</span>
                      {tour.featured && (
                        <span className="text-xs text-yellow-600">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="font-normal">
                      {tour.category || 'N/A'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{tour.duration || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {tour.price ? `$${Number(tour.price).toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-3">
                      <Link
                        to={`/tour/${tour.id}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Tour"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/tours/edit/${encodeURIComponent(tour.id.toString())}`}
                        className="text-amber-600 hover:text-amber-800 transition-colors"
                        title="Edit Tour"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(tour.id, tour.title)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Tour"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDetailsModal(tour)}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        title="View Details"
                      >
                        <Info className={`h-4 w-4`} />
                      </button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  if (isLoading) {
    return viewMode === 'card' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Image</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-3"><Skeleton className="h-12 w-12 rounded-md" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                <td className="px-4 py-3"><Skeleton className="h-8 w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-grow md:max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'card' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'card' ? renderCardsView() : renderTableView()}

      {!isLoading && tours.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
          <Camera className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tours found</h3>
          <p className="mt-1 text-sm text-gray-500">Add your first tour to get started.</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the tour "${tourToDelete?.title || ''}"? This action cannot be undone.`}
      />

      {selectedTourForModal && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          title={`${selectedTourForModal.title} - Details`}
          size="sm"
        >
          <div className="space-y-2 text-sm">
            {selectedTourForModal.featured && (
              <div className="flex justify-center mb-3">
                 <Badge variant="warning">Featured Tour</Badge>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Category:</span>
              <span className="text-gray-900 text-right">{selectedTourForModal.category || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Location:</span>
              <span className="text-gray-900 text-right">{selectedTourForModal.location || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Difficulty:</span>
              <span className="text-gray-900 text-right">{selectedTourForModal.difficulty || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Group Size:</span>
              <span className="text-gray-900 text-right">{selectedTourForModal.min_group_size} - {selectedTourForModal.max_group_size} people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Rating:</span>
              <span className="text-gray-900 text-right">{selectedTourForModal.rating ? `${selectedTourForModal.rating.toFixed(1)} / 5` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Created:</span>
              <span className="text-gray-900 text-right">{formatDate(selectedTourForModal.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Updated:</span>
              <span className="text-gray-900 text-right">{formatDate(selectedTourForModal.updated_at)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TourList; 