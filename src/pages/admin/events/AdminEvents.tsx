import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import EventList from '../../../components/admin/Events/EventList';
import { eventsService, Event } from '../../../services/events.service';
import toast from 'react-hot-toast';

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState<keyof Event>('start_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [eventTypes, setEventTypes] = useState<{id: string; name: string}[]>([
    {id: 'all', name: 'All Types'}
  ]);
  const [loadingEventTypes, setLoadingEventTypes] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [eventsData, typesData] = await Promise.all([
          eventsService.getEvents(),
          eventsService.getEventTypes()
        ]);
        
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setEventTypes([{id: 'all', name: 'All Types'}, ...typesData]);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load events or types');
      } finally {
        setLoading(false);
        setLoadingEventTypes(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...events];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        event => 
          event.title.toLowerCase().includes(term) || 
          event.description.toLowerCase().includes(term) || 
          event.location?.toLowerCase().includes(term)
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.event_type === filterType);
    }
    
    filtered = [...filtered].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'start_date' || sortField === 'end_date') {
         aValue = new Date(aValue as string).getTime();
         bValue = new Date(bValue as string).getTime();
      }

      if (aValue === undefined || aValue === null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === undefined || bValue === null) return sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    setFilteredEvents(filtered);
  }, [events, searchTerm, filterType, sortField, sortDirection]);

  const handleSearch = (term: string) => setSearchTerm(term);
  const handleFilterChange = (type: string) => setFilterType(type);
  const handleSortChange = (field: keyof Event, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      setLoading(true);
      const success = await eventsService.deleteEvent(event.id);
      if (success) {
        setEvents(prevEvents => prevEvents.filter(e => e.id !== event.id));
        toast.success(`Event "${event.title}" deleted successfully`);
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage upcoming events, workshops, and festivals.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              to="/admin/events/create" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Event
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredEvents.length} of {events.length} events.
        {filterType !== 'all' && ` (Filtered by: ${eventTypes.find(t => t.id === filterType)?.name || filterType})`}
        {searchTerm && ` (Search term: "${searchTerm}")`}
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <EventList 
        events={filteredEvents}
        isLoading={loading || loadingEventTypes}
        onDelete={handleDeleteEvent}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        filterType={filterType}
        eventTypes={eventTypes}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />
    </AdminLayout>
  );
};

export default AdminEvents;