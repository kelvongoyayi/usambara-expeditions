import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ChevronDown, ChevronUp, Eye, Edit, Trash2, Star, Calendar, MapPin, ArrowUpDown,
  Search, Filter, Grid, List, Info, ArrowUp, ArrowDown
} from 'lucide-react';
import { Event } from '../../../services/events.service';
import { formatDateRange } from '../../../utils/date-utils';
import { Badge, Skeleton, ConfirmDialog, Modal } from '../../../components/ui';

interface EventListProps {
  events: Event[];
  isLoading?: boolean;
  onDelete: (event: Event) => void;
  onSortChange?: (field: keyof Event, direction: 'asc' | 'desc') => void;
  onFilterChange?: (eventType: string) => void;
  filterType: string;
  eventTypes: { id: string; name: string }[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  isLoading = false,
  onDelete,
  onSortChange,
  onFilterChange,
  filterType,
  eventTypes,
  searchTerm,
  onSearchChange,
}) => {
  const [sortField, setSortField] = useState<keyof Event>('start_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState<Event | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollable);
      checkScrollable();
      
      window.addEventListener('resize', checkScrollable);
      
      return () => {
        container.removeEventListener('scroll', checkScrollable);
        window.removeEventListener('resize', checkScrollable);
      };
    }
  }, [events]);

  const scrollEvents = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSort = (field: keyof Event) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    if (onSortChange) {
      onSortChange(field, newDirection);
    }
  };

  const renderSortIndicator = (field: keyof Event) => {
    if (field !== sortField) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const confirmDelete = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (eventToDelete) {
      onDelete(eventToDelete);
      setShowDeleteDialog(false);
      setEventToDelete(null);
    }
  };

  const openDetailsModal = (event: Event) => {
    setSelectedEventForModal(event);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEventForModal(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (_) {
      return 'Invalid date';
    }
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.length === 0 && !isLoading ? (
        <div className="col-span-full py-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
          No events found.
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-visible flex flex-col relative transition-all hover:-translate-y-1 hover:shadow-md duration-200"
          >
            <div className="relative h-48 overflow-hidden bg-gray-100 rounded-t-lg">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Calendar className="w-12 h-12 opacity-20" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge className="bg-accent-600">
                  {event.event_type || 'Event'}
                </Badge>
              </div>
              {event.featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Featured
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="p-4 flex-grow flex flex-col">
              <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900">{event.title}</h3>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span>
                    {event.start_date && event.end_date 
                      ? formatDateRange(event.start_date, event.end_date)
                      : 'No date specified'
                    }
                  </span>
                </div>
                {event.price && (
                  <span className="font-bold text-accent-600">${Number(event.price).toFixed(2)}</span>
                )}
              </div>
              
              {event.location && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              )}
              
              {event.rating && (
                <div className="flex items-center text-sm text-amber-500 mb-3">
                  <Star className="h-4 w-4 mr-1 fill-amber-500" />
                  <span>{event.rating}</span>
                </div>
              )}
              
              <div className="mb-4 text-sm text-gray-600 line-clamp-2 flex-grow">
                {event.description || 'No description available.'}
              </div>
              
              <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Link
                    to={`/events/${event.slug || event.id}`}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    title="View Event"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    to={`/admin/events/edit/${event.id}`}
                    className="p-2 text-amber-600 hover:text-amber-800 transition-colors"
                    title="Edit Event"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => confirmDelete(event)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => openDetailsModal(event)}
                  className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                  title="View Details"
                >
                  <Info className={`w-5 h-5`} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><div className="flex items-center cursor-pointer" onClick={() => handleSort('title')}>Title {renderSortIndicator('title')}</div></th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><div className="flex items-center cursor-pointer" onClick={() => handleSort('event_type' as keyof Event)}>Type {renderSortIndicator('event_type' as keyof Event)}</div></th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><div className="flex items-center cursor-pointer" onClick={() => handleSort('start_date' as keyof Event)}>Date {renderSortIndicator('start_date' as keyof Event)}</div></th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><div className="flex items-center cursor-pointer" onClick={() => handleSort('location' as keyof Event)}>Location {renderSortIndicator('location' as keyof Event)}</div></th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><div className="flex items-center cursor-pointer" onClick={() => handleSort('price' as keyof Event)}>Price {renderSortIndicator('price' as keyof Event)}</div></th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.length === 0 && !isLoading ? (
            <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-500">No events found.</td></tr>
          ) : (
            events.map((event) => (
              <React.Fragment key={event.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 overflow-hidden rounded-md bg-gray-100">
                      {event.image_url ? (<img src={event.image_url} alt={event.title} className="w-full h-full object-cover" loading="lazy"/>) : (<div className="flex items-center justify-center h-full text-gray-400 text-xs"><Calendar className="h-6 w-6 opacity-40" /></div>)}
                    </div>
                  </td>
                  <td className="px-4 py-3"><div className="flex flex-col"><span className="font-medium text-gray-900">{event.title}</span>{event.featured && (<span className="text-xs text-yellow-600">Featured</span>)}</div></td>
                  <td className="px-4 py-3"><Badge className="font-normal">{event.event_type || 'N/A'}</Badge></td>
                  <td className="px-4 py-3 text-sm">{event.start_date && event.end_date ? formatDateRange(event.start_date, event.end_date) : 'No date'}</td>
                  <td className="px-4 py-3 text-sm">{event.location || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm font-medium">{event.price ? `$${Number(event.price).toFixed(2)}` : 'N/A'}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-3">
                      <Link to={`/events/${event.slug || event.id}`} className="text-blue-600 hover:text-blue-800 transition-colors" title="View Event"><Eye className="h-4 w-4" /></Link>
                      <Link to={`/admin/events/edit/${event.id}`} className="text-amber-600 hover:text-amber-800 transition-colors" title="Edit Event"><Edit className="h-4 w-4" /></Link>
                      <button onClick={() => confirmDelete(event)} className="text-red-600 hover:text-red-800 transition-colors" title="Delete Event"><Trash2 className="h-4 w-4" /></button>
                      <button onClick={() => openDetailsModal(event)} className="text-gray-600 hover:text-gray-800 transition-colors" title="View Details"><Info className={`h-4 w-4`} /></button>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
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
                <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
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
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white"
              aria-label="Filter by event type"
            >
              <option value="all">All Types</option> 
              {eventTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'card' ? 'bg-white shadow-sm text-accent-600' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Card View"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-accent-600' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Table View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'card' ? renderCardView() : renderTableView()}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the event "${eventToDelete?.title || ''}"? This action cannot be undone.`}
      />

      {selectedEventForModal && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          title={`${selectedEventForModal.title} - Details`}
          size="sm"
        >
          <div className="space-y-2 text-sm">
            {selectedEventForModal.featured && (
              <div className="flex justify-center mb-3"><Badge variant="warning">Featured Event</Badge></div>
            )}
            <div className="flex justify-between"><span className="text-gray-500 font-medium">Type:</span><span className="text-gray-900 text-right">{selectedEventForModal.event_type || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 font-medium">Location:</span><span className="text-gray-900 text-right">{selectedEventForModal.location || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 font-medium">Date:</span><span className="text-gray-900 text-right">{formatDateRange(selectedEventForModal.start_date, selectedEventForModal.end_date)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 font-medium">Price:</span><span className="text-gray-900 text-right">{selectedEventForModal.price ? `$${Number(selectedEventForModal.price).toFixed(2)}` : 'Free'}</span></div>
            {selectedEventForModal.rating && (
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Rating:</span><span className="text-gray-900 text-right">{selectedEventForModal.rating.toFixed(1)} / 5</span></div>
            )}
             {selectedEventForModal.min_attendees && (
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Attendees:</span><span className="text-gray-900 text-right">{selectedEventForModal.min_attendees}{selectedEventForModal.max_attendees ? ` - ${selectedEventForModal.max_attendees}` : '+'}</span></div>
            )}
            <div className="flex justify-between"><span className="text-gray-500 font-medium">Created:</span><span className="text-gray-900 text-right">{formatDate(selectedEventForModal.created_at)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500 font-medium">Updated:</span><span className="text-gray-900 text-right">{formatDate(selectedEventForModal.updated_at)}</span></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventList;