import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Filter, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Section from '../../components/ui/Section';
import TourCard from '../../components/tours/TourCard';
import { FeaturedItem } from '../../types/tours';
import { toursService } from '../../services/tours.service';

interface FilterOptions {
  duration: string;
  priceRange: string;
  difficulty: string;
  searchQuery: string;
}

const TourListing: React.FC = () => {
  const { tourType } = useParams<{ tourType?: string }>();
  const location = useLocation();
  const [tours, setTours] = useState<FeaturedItem[]>([]);
  const [filteredTours, setFilteredTours] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    duration: 'all',
    priceRange: 'all',
    difficulty: 'all',
    searchQuery: ''
  });

  // Get tours based on type from URL parameter
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const category = tourType || 'all';
        const toursData = await toursService.getToursByCategory(category);
        
        // Convert to FeaturedItem format
        const featuredTours = toursData.map(tour => toursService.toFeaturedItem(tour));
        
        // Debug log to troubleshoot issues with tours not showing
        console.log(`Debug - Tour type: ${category}`, { 
          tourType, 
          recordsCount: toursData.length,
          featuredToursCount: featuredTours.length,
          featuredTours
        });
        
        setTours(featuredTours);
        setFilteredTours(featuredTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [tourType]);

  // Apply filters when filter options change
  useEffect(() => {
    applyFilters();
  }, [filterOptions, tours]);

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
    let filtered = [...tours];
    
    // Filter by search query
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      filtered = filtered.filter(tour => 
        tour.title.toLowerCase().includes(query) || 
        tour.description.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query)
      );
    }
    
    // Filter by duration
    if (filterOptions.duration !== 'all') {
      const [min, max] = filterOptions.duration.split('-').map(Number);
      filtered = filtered.filter(tour => {
        const days = parseInt(tour.duration.split(' ')[0]);
        return days >= min && (max ? days <= max : true);
      });
    }
    
    // Filter by price range
    if (filterOptions.priceRange !== 'all') {
      const [min, max] = filterOptions.priceRange.split('-').map(Number);
      filtered = filtered.filter(tour => 
        tour.price >= min && (max ? tour.price <= max : true)
      );
    }
    
    // Filter by difficulty
    if (filterOptions.difficulty !== 'all') {
      filtered = filtered.filter(tour => 
        tour.difficulty === filterOptions.difficulty
      );
    }
    
    setFilteredTours(filtered);
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
      difficulty: 'all',
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
              {tourType 
                ? `${tourType.charAt(0).toUpperCase() + tourType.slice(1)} Tours`
                : 'All Adventure Tours'
              }
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Discover our collection of exciting tours designed to showcase the best of Tanzania's landscapes and culture.
            </p>
            
            {/* Search Bar */}
            <form 
              className="max-w-xl mx-auto relative"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                placeholder="Search tours by name, location, or description..."
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

      {/* Tours Listing */}
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
                    { value: '4-7', label: '4-7 Days' },
                    { value: '8-', label: '8+ Days' }
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
                    { value: '200-300', label: '$200 - $300' },
                    { value: '300-', label: 'Over $300' }
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
              
              {/* Difficulty Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Difficulty</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Difficulty Levels' },
                    { value: 'easy', label: 'Easy' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'challenging', label: 'Challenging' }
                  ].map(option => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`difficulty-${option.value}`}
                        name="difficulty"
                        value={option.value}
                        checked={filterOptions.difficulty === option.value}
                        onChange={() => handleFilter('difficulty', option.value)}
                        className="mr-2 accent-brand-600"
                      />
                      <label htmlFor={`difficulty-${option.value}`} className="text-dark-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tours - Main Content */}
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
                  {(filterOptions.duration !== 'all' || filterOptions.priceRange !== 'all' || filterOptions.difficulty !== 'all') && (
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
                      <option value="4-7">4-7 Days</option>
                      <option value="8-">8+ Days</option>
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
                      <option value="200-300">$200 - $300</option>
                      <option value="300-">Over $300</option>
                    </select>
                  </div>
                  
                  {/* Difficulty */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Difficulty</h4>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={filterOptions.difficulty}
                      onChange={(e) => handleFilter('difficulty', e.target.value)}
                    >
                      <option value="all">All Difficulty Levels</option>
                      <option value="easy">Easy</option>
                      <option value="moderate">Moderate</option>
                      <option value="challenging">Challenging</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            {/* Applied Filters */}
            {(filterOptions.duration !== 'all' || filterOptions.priceRange !== 'all' || filterOptions.difficulty !== 'all' || filterOptions.searchQuery) && (
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
                        filterOptions.duration === '4-7' ? '4-7 Days' :
                        filterOptions.duration === '8-' ? '8+ Days' : ''
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
                        filterOptions.priceRange === '200-300' ? '$200 - $300' :
                        filterOptions.priceRange === '300-' ? 'Over $300' : ''
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
                
                {filterOptions.difficulty !== 'all' && (
                  <div className="bg-brand-50 text-brand-700 py-1.5 px-3 rounded-full text-sm flex items-center">
                    <span>Difficulty: {filterOptions.difficulty}</span>
                    <button 
                      className="ml-2"
                      onClick={() => handleFilter('difficulty', 'all')}
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
                Showing <span className="font-medium">{filteredTours.length}</span> tours
              </p>
            </div>
            
            {/* Tour Cards */}
            {loading ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
              </div>
            ) : filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map(tour => (
                  <Link key={tour.id} to={`/tour/${tour.originalId || tour.id}`} className="block h-full">
                    <TourCard item={tour} onViewDetails={() => {}} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-dark-800 mb-2">No tours found</h3>
                <p className="text-dark-600 mb-6">
                  We couldn't find any tours matching your filters. Try adjusting your search criteria.
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

export default TourListing;