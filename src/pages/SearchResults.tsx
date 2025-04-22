import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, MapPin, Clock, Calendar } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Section from '../components/ui/Section';
import { FeaturedItem } from '../types/tours';
import { getToursByType } from '../data/toursData';
import { getEventsByType } from '../data/eventsData';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      performSearch(query);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [location.search]);

  const performSearch = (query: string) => {
    setLoading(true);
    
    // Get all tours and events
    const allTours = getToursByType('all');
    const allEvents = getEventsByType('all');
    const allItems = [...allTours, ...allEvents];
    
    // Filter based on search query
    const filtered = allItems.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase()) ||
      (item.category?.toLowerCase().includes(query.toLowerCase()))
    );
    
    setResults(filtered);
    setLoading(false);
  };

  const getFilteredResults = () => {
    if (activeTab === 'all') return results;
    return results.filter(item => item.type === activeTab);
  };

  const filteredResults = getFilteredResults();
  const tourCount = results.filter(item => item.type === 'tour').length;
  const eventCount = results.filter(item => item.type === 'event').length;

  return (
    <Layout>
      <div className="pt-24 bg-brand-900 pb-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full filter blur-[100px] opacity-60 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-[100px] opacity-60 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">Search Results</h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 text-center">
              {searchQuery ? (
                <>Showing results for "<span className="text-accent-400">{searchQuery}</span>"</>
              ) : (
                'Start your search to discover our adventures'
              )}
            </p>
            
            <form 
              action="/search" 
              method="get"
              className="relative max-w-xl mx-auto"
            >
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search for tours, events, locations..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-5 pr-12 text-white backdrop-blur-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent"
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

      <Section>
        {/* Tabs */}
        <div className="bg-white rounded-full p-1 shadow-sm border border-gray-200 inline-block mb-8">
          <button 
            className={`px-4 py-2 text-sm rounded-full ${
              activeTab === 'all' 
                ? 'bg-brand-600 text-white' 
                : 'text-dark-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All ({results.length})
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-full ${
              activeTab === 'tour' 
                ? 'bg-brand-600 text-white' 
                : 'text-dark-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('tour')}
          >
            Tours ({tourCount})
          </button>
          <button 
            className={`px-4 py-2 text-sm rounded-full ${
              activeTab === 'event' 
                ? 'bg-brand-600 text-white' 
                : 'text-dark-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('event')}
          >
            Events ({eventCount})
          </button>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map(item => (
              <Link 
                key={item.id} 
                to={item.type === 'tour' ? `/tour/${item.id}` : `/event/${item.id}`}
                className="block h-full"
              >
                <div className="bg-white rounded-xl shadow-card h-full flex flex-col group overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  {/* Image */}
                  <div className="relative pt-[56.25%] overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 rounded-t-xl"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    
                    {/* Type badge */}
                    <div className="absolute top-3 right-3 bg-accent-500/90 backdrop-blur-sm text-white py-1 px-3 rounded-full text-xs uppercase tracking-wider border border-white/20 font-medium">
                      {item.type}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-bold text-dark-800 mb-2 sm:mb-3 group-hover:text-brand-600 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm text-dark-500">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-brand-500" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-brand-500" />
                        <span>{item.duration}</span>
                      </div>
                      {item.date && (
                        <div className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-brand-500" />
                          <span>{item.date}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-dark-600 mb-4 sm:mb-5 flex-grow line-clamp-2 text-sm sm:text-base leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="mt-auto flex justify-between items-center">
                      <div className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center group/link text-sm sm:text-base">
                        View Details
                        <svg className="ml-1.5 w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      
                      <div className="text-dark-900 font-bold text-base sm:text-lg">
                        ${item.price}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-dark-800 mb-2">No results found</h3>
            <p className="text-dark-600 mb-6 max-w-lg mx-auto">
              {searchQuery 
                ? `We couldn't find any matches for "${searchQuery}". Try using different or more general keywords.` 
                : 'Enter a search term to find tours and events.'
              }
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <Link to="/tours" className="text-brand-600 hover:text-brand-700 font-medium">
                Browse all tours
              </Link>
              <Link to="/events" className="text-brand-600 hover:text-brand-700 font-medium">
                Browse all events
              </Link>
            </div>
          </div>
        )}
      </Section>
    </Layout>
  );
};

export default SearchResults;