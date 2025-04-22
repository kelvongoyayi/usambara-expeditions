import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Filter, MapPin, Calendar, Search, X, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Section from '../../components/ui/Section';
import LoadingImage from '../../components/ui/LoadingImage';
import { FeaturedItem } from '../../types/tours';
import { eventsService, Event } from '../../services/events.service';

interface FilterOptions {
  duration: string;
  priceRange: string;
  month: string;
  searchQuery: string;
}

const EventListing: React.FC = () => {
  const { eventType } = useParams<{ eventType?: string }>();
  const location = useLocation();
  const [events, setEvents] = useState<FeaturedItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    duration: 'all',
    priceRange: 'all',
    month: 'all',
    searchQuery: ''
  });

  // Get events based on type from URL parameter
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsType = eventType || 'all';
        const eventsData = await eventsService.getEventsByType(eventsType);
        
        // Convert to FeaturedItem format
        const featuredEvents = eventsData.map(event => eventsService.toFeaturedItem(event));
        
        setEvents(featuredEvents);
        setFilteredEvents(featuredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [eventType]);

  // Apply filters when filter options change
  useEffect(() => {
    applyFilters();
  }, [filterOptions, events]);

  // Parse query parameters for search
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      setFilterOptions(prev => ({
        ...prev,
        searchQuery: query
      }));
    }
  }, [location.search]);

  const applyFilters = () => {
    let filtered = [...events];
    
    // Filter by search query
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }
    
    // Filter by duration
    if (filterOptions.duration !== 'all') {
      const [min, max] = filterOptions.duration.split('-').map(Number);
      filtered = filtered.filter(event => {
        const days = parseInt(event.duration.split(' ')[0]);
        return days >= min && (max ? days <= max : true);
      });
    }
    
    // Filter by price range
    if (filterOptions.priceRange !== 'all') {
      const [min, max] = filterOptions.priceRange.split('-').map(Number);
      filtered = filtered.filter(event => 
        event.price >= min && (max ? event.price <= max : true)
      );
    }
    
    // Filter by month
    if (filterOptions.month !== 'all' && filterOptions.month) {
      filtered = filtered.filter(event => {
        if (!event.date) return false;
        return event.date.toLowerCase().includes(filterOptions.month.toLowerCase());
      });
    }
    
    setFilteredEvents(filtered);
  };

  const handleFilter = (name: keyof FilterOptions, value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilterOptions({
      duration: 'all',
      priceRange: 'all',
      month: 'all',
      searchQuery: ''
    });
  };

  const toggleFilters = () => {
    setFilterVisible(!filterVisible);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-brand-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full filter blur-[100px] opacity-60 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-[100px] opacity-60 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white font-display">
              {eventType 
                ? `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Events`
                : 'All Events'
              }
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Discover our professionally organized events in Tanzania's most stunning locations.
            </p>
            
            {/* Search Bar */}
            <form 
              className="max-w-xl mx-auto relative"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                placeholder="Search events by name, location, or type..."
                className="w-full py-3 pl-4 pr-12 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 backdrop-blur-md"
                value={filterOptions.searchQuery}
                onChange={(e) => handleFilter('searchQuery', e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Events Listing */}
      <Section>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="md:w-1/4 lg:w-1/5 hidden md:block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button 
                  className="text-sm text-brand-600 hover:text-brand-700"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>
              
              {/* Duration Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Duration</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Durations' },
                    { value: '1-1', label: '1 Day' },
                    { value: '2-3', label: '2-3 Days' },
                    { value: '4-', label: '4+ Days' }
                  ].map(option => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`duration-${option.value}`}
                        name="duration"
                        value={option.value}
                        checked={filterOptions.duration === option.value}
                        onChange={() => handleFilter('duration', option.value)}
                        className="mr-2 accent-brand-600"
                      />
                      <label htmlFor={`duration-${option.value}`} className="text-dark-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: '0-100', label: 'Under $100' },
                    { value: '100-200', label: '$100 - $200' },
                    { value: '200-350', label: '$200 - $350' },
                    { value: '350-', label: 'Over $350' }
                  ].map(option => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${option.value}`}
                        name="priceRange"
                        value={option.value}
                        checked={filterOptions.priceRange === option.value}
                        onChange={() => handleFilter('priceRange', option.value)}
                        className="mr-2 accent-brand-600"
                      />
                      <label htmlFor={`price-${option.value}`} className="text-dark-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Month Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Event Month</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Months' },
                    { value: 'january', label: 'January' },
                    { value: 'february', label: 'February' },
                    { value: 'march', label: 'March' },
                    { value: 'april', label: 'April' },
                    { value: 'may', label: 'May' },
                    { value: 'june', label: 'June' },
                    { value: 'july', label: 'July' },
                    { value: 'august', label: 'August' },
                    { value: 'september', label: 'September' },
                    { value: 'october', label: 'October' },
                    { value: 'november', label: 'November' },
                    { value: 'december', label: 'December' }
                  ].map(option => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`month-${option.value}`}
                        name="month"
                        value={option.value}
                        checked={filterOptions.month === option.value}
                        onChange={() => handleFilter('month', option.value)}
                        className="mr-2 accent-brand-600"
                      />
                      <label htmlFor={`month-${option.value}`} className="text-dark-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Events - Main Content */}
          <div className="md:w-3/4 lg:w-4/5">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden mb-4">
              <button 
                className="w-full py-3 px-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
                onClick={toggleFilters}
              >
                <div className="flex items-center text-dark-700">
                  <Filter className="w-5 h-5 mr-2" />
                  <span>Filters</span>
                  {(filterOptions.duration !== 'all' || filterOptions.priceRange !== 'all' || filterOptions.month !== 'all') && (
                    <span className="ml-2 bg-brand-100 text-brand-700 px-2 rounded-full text-sm">
                      Applied
                    </span>
                  )}
                </div>
                {filterVisible ? (
                  <ChevronUp className="w-5 h-5 text-dark-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-dark-600" />
                )}
              </button>
              
              {/* Mobile Filters Panel */}
              {filterVisible && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-2">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold">Filter Options</h3>
                    <button 
                      className="text-sm text-brand-600"
                      onClick={clearFilters}
                    >
                      Clear All
                    </button>
                  </div>
                  
                  {/* Duration */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Duration</h4>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={filterOptions.duration}
                      onChange={(e) => handleFilter('duration', e.target.value)}
                    >
                      <option value="all">All Durations</option>
                      <option value="1-1">1 Day</option>
                      <option value="2-3">2-3 Days</option>
                      <option value="4-">4+ Days</option>
                    </select>
                  </div>
                  
                  {/* Price Range */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Price Range</h4>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={filterOptions.priceRange}
                      onChange={(e) => handleFilter('priceRange', e.target.value)}
                    >
                      <option value="all">All Prices</option>
                      <option value="0-100">Under $100</option>
                      <option value="100-200">$100 - $200</option>
                      <option value="200-350">$200 - $350</option>
                      <option value="350-">Over $350</option>
                    </select>
                  </div>
                  
                  {/* Month */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Event Month</h4>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={filterOptions.month}
                      onChange={(e) => handleFilter('month', e.target.value)}
                    >
                      <option value="all">All Months</option>
                      <option value="january">January</option>
                      <option value="february">February</option>
                      <option value="march">March</option>
                      <option value="april">April</option>
                      <option value="may">May</option>
                      <option value="june">June</option>
                      <option value="july">July</option>
                      <option value="august">August</option>
                      <option value="september">September</option>
                      <option value="october">October</option>
                      <option value="november">November</option>
                      <option value="december">December</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            {/* Applied Filters */}
            {(filterOptions.duration !== 'all' || filterOptions.priceRange !== 'all' || filterOptions.month !== 'all' || filterOptions.searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filterOptions.searchQuery && (
                  <div className="bg-brand-50 text-brand-700 py-1.5 px-3 rounded-full text-sm flex items-center">
                    <span>Search: {filterOptions.searchQuery}</span>
                    <button 
                      className="ml-2"
                      onClick={() => handleFilter('searchQuery', '')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {filterOptions.duration !== 'all' && (
                  <div className="bg-brand-50 text-brand-700 py-1.5 px-3 rounded-full text-sm flex items-center">
                    <span>
                      Duration: {
                        filterOptions.duration === '1-1' ? '1 Day' :
                        filterOptions.duration === '2-3' ? '2-3 Days' :
                        filterOptions.duration === '4-' ? '4+ Days' : ''
                      }
                    </span>
                    <button 
                      className="ml-2"
                      onClick={() => handleFilter('duration', 'all')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {filterOptions.priceRange !== 'all' && (
                  <div className="bg-brand-50 text-brand-700 py-1.5 px-3 rounded-full text-sm flex items-center">
                    <span>
                      Price: {
                        filterOptions.priceRange === '0-100' ? 'Under $100' :
                        filterOptions.priceRange === '100-200' ? '$100 - $200' :
                        filterOptions.priceRange === '200-350' ? '$200 - $350' :
                        filterOptions.priceRange === '350-' ? 'Over $350' : ''
                      }
                    </span>
                    <button 
                      className="ml-2"
                      onClick={() => handleFilter('priceRange', 'all')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {filterOptions.month !== 'all' && (
                  <div className="bg-brand-50 text-brand-700 py-1.5 px-3 rounded-full text-sm flex items-center">
                    <span>Month: {filterOptions.month}</span>
                    <button 
                      className="ml-2"
                      onClick={() => handleFilter('month', 'all')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <button 
                  className="bg-gray-100 text-dark-600 py-1.5 px-3 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>
            )}
            
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-dark-600">
                Showing <span className="font-medium">{filteredEvents.length}</span> events
              </p>
            </div>
            
            {/* Event Cards */}
            {loading ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <Link key={event.id} to={`/event/${event.id}`} className="block h-full">
                    <div className="bg-white rounded-xl shadow-card h-full flex flex-col group overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                      {/* Image */}
                      <div className="relative pt-[56.25%] overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 rounded-t-xl"
                          style={{ backgroundImage: `url(${event.image})` }}
                        ></div>
                        
                        {/* Category badge */}
                        <div className="absolute top-3 right-3 bg-accent-500/90 backdrop-blur-sm text-white py-1 px-3 rounded-full text-xs uppercase tracking-wider border border-white/20 font-medium">
                          Event
                        </div>
                        
                        {/* Rating */}
                        <div className="absolute bottom-3 left-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white py-1.5 px-3 rounded-full flex items-center transition-all duration-300 shadow-md">
                          <svg className="w-3.5 h-3.5 fill-accent-400 text-accent-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          <span className="font-medium text-sm">{event.rating}</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5 sm:p-6 flex flex-col flex-grow">
                        <h3 className="text-base sm:text-lg font-bold text-dark-800 mb-2 sm:mb-3 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                          {event.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm text-dark-500">
                          <div className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500" />
                            <span className="truncate max-w-[100px] sm:max-w-none">{event.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-brand-500" />
                            <span>{event.duration}</span>
                          </div>
                          {event.date && (
                            <div className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1 text-brand-500" />
                              <span>{event.date}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-dark-600 mb-4 sm:mb-5 flex-grow line-clamp-3 text-sm sm:text-base leading-relaxed">
                          {event.description}
                        </p>
                        
                        <div className="mt-auto flex justify-between items-center">
                          <div className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center group/link text-sm sm:text-base">
                            View Details
                            <svg className="ml-1.5 w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                          
                          <div className="text-dark-900 font-bold text-base sm:text-lg">
                            ${event.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-dark-800 mb-2">No events found</h3>
                <p className="text-dark-600 mb-6">
                  We couldn't find any events matching your filters. Try adjusting your search criteria.
                </p>
                <button 
                  className="text-brand-600 hover:text-brand-700 font-medium"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default EventListing;