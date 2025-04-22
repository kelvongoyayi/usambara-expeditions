import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ChevronRight, ArrowRight, Mountain, Compass, 
  Map, Calendar, Sun, ThermometerSun, Camera, Search,
  Clock
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Section from '../components/ui/Section';
import { Button } from '../components/ui';
import { useInView } from 'react-intersection-observer';
import { destinationsData } from '../data/destinationsData';
import { Destination } from '../types';

const DestinationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState(destinationsData);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObjectRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // Filter destinations based on search query
    if (searchQuery) {
      const filtered = destinationsData.filter(
        destination => 
          destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          destination.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDestinations(filtered);
    } else {
      setFilteredDestinations(destinationsData);
    }
  }, [searchQuery]);

  // Initialize map when the component mounts
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBNLrJhOMz6idD05pzwk_ONj8r-MwbBVTA&callback=initializeMap`;
      script.async = true;
      script.defer = true;
      
      window.initializeMap = initializeMap;
      document.head.appendChild(script);
      
      return () => {
        window.initializeMap = undefined;
        document.head.removeChild(script);
      };
    };
    
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      const mapOptions: google.maps.MapOptions = {
        center: { lat: -6.0, lng: 35.0 },
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        styles: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: [{ saturation: 20 }]
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: [{ visibility: 'simplified' }]
          },
          {
            featureType: 'transit',
            elementType: 'all',
            stylers: [{ visibility: 'simplified' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        zoomControl: true,
      };
      
      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapObjectRef.current = map;
      
      // Add markers for each destination
      destinationsData.forEach(destination => {
        const marker = new google.maps.Marker({
          position: { 
            lat: destination.latitude, 
            lng: destination.longitude 
          },
          map: map,
          title: destination.name,
          animation: google.maps.Animation.DROP,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
          }
        });
        
        markersRef.current.push(marker);
        
        // Add click event to marker
        marker.addListener('click', () => {
          setSelectedDestination(destination.id);
          setActiveDestination(destination);
          setShowInfoWindow(true);
          
          // Center map on selected marker
          map.panTo(marker.getPosition()!);
          map.setZoom(8);
        });
        
        // Add info window for each marker
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 5px;">${destination.name}</h3>
              <p style="font-size: 12px; margin: 0 0 5px;">${destination.tourTypes.join(', ')}</p>
              <button 
                id="view-${destination.id}" 
                style="background-color: #056326; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;"
              >
                View Details
              </button>
            </div>
          `
        });
        
        marker.addListener('mouseover', () => {
          infoWindow.open(map, marker);
        });
        
        marker.addListener('mouseout', () => {
          infoWindow.close();
        });
        
        // Add click event on the "View Details" button inside info window
        google.maps.event.addListener(infoWindow, 'domready', () => {
          document.getElementById(`view-${destination.id}`)?.addEventListener('click', () => {
            setSelectedDestination(destination.id);
            setActiveDestination(destination);
            setShowInfoWindow(true);
            
            // Scroll to destination details
            const detailsSection = document.getElementById('destination-details');
            if (detailsSection) {
              detailsSection.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
      });
    };
    
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      loadGoogleMapsScript();
    }
    
    return () => {
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
    };
  }, []);
  
  // Update markers when filtered destinations change
  useEffect(() => {
    if (!mapObjectRef.current || !markersRef.current.length) return;
    
    // Hide all markers first
    markersRef.current.forEach(marker => marker.setMap(null));
    
    // Show only filtered markers
    markersRef.current.forEach(marker => {
      const destination = destinationsData.find(d => d.name === marker.getTitle());
      if (destination && filteredDestinations.includes(destination)) {
        marker.setMap(mapObjectRef.current);
      }
    });
  }, [filteredDestinations]);
  
  // Update active destination when selectedDestination changes
  useEffect(() => {
    if (selectedDestination) {
      const destination = destinationsData.find(d => d.id === selectedDestination);
      if (destination) {
        setActiveDestination(destination);
        
        // Highlight the marker for the selected destination
        if (mapObjectRef.current && markersRef.current) {
          markersRef.current.forEach(marker => {
            if (marker.getTitle() === destination.name) {
              marker.setIcon({
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
              });
              
              // Center map on selected marker
              mapObjectRef.current.panTo(marker.getPosition()!);
              mapObjectRef.current.setZoom(8);
            } else {
              marker.setIcon({
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
              });
            }
          });
        }
      }
    } else {
      setActiveDestination(null);
      
      // Reset all markers to default
      if (mapObjectRef.current && markersRef.current) {
        markersRef.current.forEach(marker => {
          marker.setIcon({
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
          });
        });
        
        // Reset map view
        mapObjectRef.current.setCenter({ lat: -6.0, lng: 35.0 });
        mapObjectRef.current.setZoom(6);
      }
    }
  }, [selectedDestination]);
  
  // Handle destination selection
  const handleDestinationSelect = (destinationId: string) => {
    setSelectedDestination(destinationId);
    setShowInfoWindow(true);
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter logic is handled in the useEffect
  };
  
  // Handle "View Tours" button click
  const handleViewTours = (destinationId: string) => {
    navigate(`/tours?destination=${destinationId}`);
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
              Explore <span className="text-accent-400">Tanzania</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Discover the breathtaking destinations across Tanzania, from mountain peaks and rainforests to pristine beaches and cultural treasures.
            </p>
            
            {/* Search Bar */}
            <form 
              onSubmit={handleSearch}
              className="max-w-xl mx-auto relative"
            >
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full py-3 pl-4 pr-12 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 backdrop-blur-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Interactive Map */}
      <Section>
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Map</h2>
          <p className="text-lg text-dark-600 max-w-3xl mx-auto">
            Explore our destinations across Tanzania. Click on a marker to learn more about each location.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div 
            ref={mapRef} 
            className="h-[500px] w-full"
            aria-label="Map of Tanzania destinations"
          ></div>
        </div>
        
        {/* Map Usage Instructions */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 text-dark-600 text-sm flex items-start">
          <div className="p-2 bg-brand-100 rounded-full mr-3 flex-shrink-0">
            <Compass className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <span className="font-medium">Map Tips:</span> Click on a marker to see destination details. 
            Use the controls to zoom and pan. Switch between map types using the upper right control.
          </div>
        </div>
      </Section>
      
      {/* Destination Cards */}
      <Section gradient>
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Destinations</h2>
          <p className="text-lg text-dark-600 max-w-3xl mx-auto">
            Explore the diverse landscapes and experiences that Tanzania has to offer.
          </p>
        </div>
        
        {/* Destination Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          ref={ref}
        >
          {filteredDestinations.map((destination, index) => (
            <div 
              key={destination.id} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer ${
                inView ? 'opacity-0 animate-fade-in-up' : 'opacity-0'
              } ${selectedDestination === destination.id ? 'ring-2 ring-accent-500' : ''}`}
              style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}
              onClick={() => handleDestinationSelect(destination.id)}
            >
              <div className="relative h-48">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-white text-xl font-bold">{destination.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {destination.tourTypes.map(type => (
                    <span 
                      key={type} 
                      className="bg-brand-50 text-brand-700 px-2 py-1 rounded-full text-xs capitalize"
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <p className="text-dark-600 line-clamp-3 mb-4">{destination.description}</p>
                <button 
                  className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDestinationSelect(destination.id);
                  }}
                >
                  View Details
                  <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredDestinations.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Map className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-dark-800 mb-2">No destinations found</h3>
            <p className="text-dark-600 mb-6">
              We couldn't find any destinations matching your search. Try different keywords.
            </p>
            <button 
              className="text-brand-600 hover:text-brand-700 font-medium"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          </div>
        )}
      </Section>
      
      {/* Selected Destination Details */}
      <Section id="destination-details">
        {activeDestination && showInfoWindow ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Image and Basic Info */}
            <div className="lg:col-span-3">
              <div className="relative aspect-w-16 aspect-h-9 rounded-xl overflow-hidden mb-6">
                <img 
                  src={activeDestination.image} 
                  alt={activeDestination.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">{activeDestination.name}</h2>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {activeDestination.tourTypes.map(type => (
                  <span 
                    key={type} 
                    className="bg-brand-100 text-brand-700 px-3 py-1.5 rounded-full text-sm capitalize font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
              
              <div className="prose prose-lg max-w-none mb-8">
                <p>{activeDestination.description}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Highlights</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeDestination.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-accent-500/10 rounded-full p-1 mr-3 mt-0.5">
                        <svg className="w-3 h-3 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-dark-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  variant="accent"
                  onClick={() => handleViewTours(activeDestination.id)}
                >
                  View Available Tours
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Close the info window
                    setShowInfoWindow(false);
                    setSelectedDestination(null);
                  }}
                >
                  Close Details
                </Button>
              </div>
            </div>
            
            {/* Location Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                <div className="bg-brand-600 text-white p-4">
                  <h3 className="text-xl font-semibold flex items-center">
                    <MapPin className="mr-2 w-5 h-5" />
                    Location Information
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <Mountain className="w-5 h-5 text-brand-600 mr-2" />
                      <span className="font-semibold">Geography</span>
                    </div>
                    <p className="text-dark-600 pl-7">
                      {activeDestination.id === 'usambara-mountains' && 'Mountain range in northeastern Tanzania, part of the Eastern Arc Mountains.'}
                      {activeDestination.id === 'serengeti' && 'Vast plains ecosystem spanning northern Tanzania and southwestern Kenya.'}
                      {activeDestination.id === 'zanzibar' && 'Archipelago off the coast of East Africa in the Indian Ocean.'}
                      {activeDestination.id === 'kilimanjaro' && 'Dormant volcano in northeastern Tanzania, Africa\'s highest peak.'}
                      {activeDestination.id === 'lushoto' && 'Valley located in the western Usambara Mountains in Tanga Region.'}
                      {activeDestination.id === 'amani-nature-reserve' && 'Protected forest area in the East Usambara Mountains.'}
                      {activeDestination.id === 'tanga-beaches' && 'Coastal area along the Indian Ocean in northeastern Tanzania.'}
                      {activeDestination.id === 'magoroto-forest' && 'Forest area in the East Usambara Mountains with a crater lake.'}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <Sun className="w-5 h-5 text-brand-600 mr-2" />
                      <span className="font-semibold">Best Time to Visit</span>
                    </div>
                    <p className="text-dark-600 pl-7">
                      {activeDestination.id === 'usambara-mountains' && 'June to October (dry season) for hiking and clear views.'}
                      {activeDestination.id === 'serengeti' && 'January to March for calving season; June to October for migration river crossings.'}
                      {activeDestination.id === 'zanzibar' && 'June to October (dry season) or December to February (hot, less rainfall).'}
                      {activeDestination.id === 'kilimanjaro' && 'January to March and June to October offer the best climbing conditions.'}
                      {activeDestination.id === 'lushoto' && 'June to October for clear skies and pleasant temperatures.'}
                      {activeDestination.id === 'amani-nature-reserve' && 'June to October (dry season) for hiking and wildlife viewing.'}
                      {activeDestination.id === 'tanga-beaches' && 'August to October for beach activities and calm waters.'}
                      {activeDestination.id === 'magoroto-forest' && 'June to October for camping and hiking without heavy rainfall.'}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <ThermometerSun className="w-5 h-5 text-brand-600 mr-2" />
                      <span className="font-semibold">Climate</span>
                    </div>
                    <p className="text-dark-600 pl-7">
                      {activeDestination.id === 'usambara-mountains' && 'Cool mountain climate with temperatures ranging from 15-25°C year-round.'}
                      {activeDestination.id === 'serengeti' && 'Warm days (20-30°C) and cool nights with two rainy seasons.'}
                      {activeDestination.id === 'zanzibar' && 'Tropical climate with temperatures between 25-30°C and two rainy seasons.'}
                      {activeDestination.id === 'kilimanjaro' && 'Various climate zones from tropical to arctic; summit temperatures can fall below -15°C.'}
                      {activeDestination.id === 'lushoto' && 'Mild climate with temperatures between 18-23°C and regular rainfall.'}
                      {activeDestination.id === 'amani-nature-reserve' && 'Humid forest climate with moderate temperatures and frequent mist.'}
                      {activeDestination.id === 'tanga-beaches' && 'Tropical coastal climate with temperatures between 25-32°C.'}
                      {activeDestination.id === 'magoroto-forest' && 'Humid forest climate with moderate rainfall and temperatures.'}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Camera className="w-5 h-5 text-brand-600 mr-2" />
                      <span className="font-semibold">Photo Opportunities</span>
                    </div>
                    <p className="text-dark-600 pl-7">
                      {activeDestination.id === 'usambara-mountains' && 'Panoramic viewpoints, misty forests, traditional villages, and unique flora.'}
                      {activeDestination.id === 'serengeti' && 'Wildlife, especially during migration, acacia trees against orange sunsets, vast plains.'}
                      {activeDestination.id === 'zanzibar' && 'Turquoise waters, white sand beaches, historic Stone Town, spice farms, dhow boats.'}
                      {activeDestination.id === 'kilimanjaro' && 'Summit views, glaciers, sunrise from Stella Point, diverse vegetation zones.'}
                      {activeDestination.id === 'lushoto' && 'Colonial architecture, valley views, waterfalls, local markets, and terraced farms.'}
                      {activeDestination.id === 'amani-nature-reserve' && 'Rare butterflies, endemic species, tea plantations, forest canopy.'}
                      {activeDestination.id === 'tanga-beaches' && 'Unspoiled beaches, fishing boats, marine life, and coastal sunsets.'}
                      {activeDestination.id === 'magoroto-forest' && 'Crater lake, forest trails, camping sites, and unique biodiversity.'}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-brand-50 border-t border-brand-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-brand-600 mr-2" />
                      <span className="font-semibold">Check Tour Availability</span>
                    </div>
                    <a 
                      href={`/tours?destination=${activeDestination.id}`}
                      className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center text-sm"
                    >
                      View Dates
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <Map className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-dark-800 mb-2">Select a Destination</h3>
            <p className="text-dark-600 max-w-lg mx-auto">
              Click on a destination card or map marker to view detailed information and available tours.
            </p>
          </div>
        )}
      </Section>
      
      {/* Travel Tips */}
      <Section className="bg-brand-900 text-white">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tanzania Travel Tips</h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Essential information to help you plan your visit to Tanzania's amazing destinations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/15 hover:border-white/20 transition-colors">
            <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-7 h-7 text-accent-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Best Time to Visit</h3>
            <p className="text-white/80 mb-4">
              June to October offers the best weather for most destinations, with dry conditions ideal for wildlife viewing and hiking. December to February provides another good window with less crowds.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/15 hover:border-white/20 transition-colors">
            <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-accent-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Getting Around</h3>
            <p className="text-white/80 mb-4">
              Domestic flights connect major destinations. For remote areas like the Usambara Mountains, 4x4 vehicles are recommended. Public transportation is available but less reliable for tourism purposes.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/15 hover:border-white/20 transition-colors">
            <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Compass className="w-7 h-7 text-accent-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Visa Information</h3>
            <p className="text-white/80 mb-4">
              Most visitors require a visa, which can be obtained on arrival or in advance online. Single-entry tourist visas cost approximately $50 USD and are typically valid for 90 days.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/15 hover:border-white/20 transition-colors">
            <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <ThermometerSun className="w-7 h-7 text-accent-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">What to Pack</h3>
            <p className="text-white/80 mb-4">
              Light, breathable clothing with some warmer layers for evenings and higher elevations. Bring sun protection, insect repellent, and comfortable hiking shoes. For Kilimanjaro and the Usambaras, warm clothing is essential.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/15 hover:border-white/20 transition-colors">
            <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-7 h-7 text-accent-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Local Customs</h3>
            <p className="text-white/80 mb-4">
              Tanzanians are friendly and welcoming. Greet people with "Jambo" (hello) or "Habari" (how are you). Ask permission before photographing people. Dress modestly, especially in Zanzibar and rural areas.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/15 hover:border-white/20 transition-colors">
            <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Sun className="w-7 h-7 text-accent-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Health Precautions</h3>
            <p className="text-white/80 mb-4">
              Malaria prevention is recommended for most regions. Yellow fever vaccination may be required if arriving from an endemic country. Drink only bottled or purified water and use sunscreen, even in cooler mountain areas.
            </p>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default DestinationsPage