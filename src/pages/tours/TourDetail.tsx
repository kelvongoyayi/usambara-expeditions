import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Clock, Calendar, Users, ChevronRight, Heart, 
  Share2, Star, Coffee, Utensils, Home, Mountain, ArrowLeft
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Section from '../../components/ui/Section';
import { Button, Alert, FeatureList } from '../../components/ui';
import LoadingImage from '../../components/ui/LoadingImage';
import { toursService } from '../../services/tours.service';
import { FeaturedItem } from '../../types/tours';

const TourDetail: React.FC = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const [selectedDay, setSelectedDay] = useState(1);
  const [tour, setTour] = useState<FeaturedItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const tourData = await toursService.getTourById(tourId);
        
        if (tourData) {
          // Convert to FeaturedItem format
          setTour(toursService.toFeaturedItem(tourData));
        } else {
          console.error(`Tour with ID ${tourId} not found`);
        }
      } catch (error) {
        console.error('Error fetching tour details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  // Add loading skeleton animation
  if (loading) {
    return (
      <Layout>
        <Section>
          <div className="animate-pulse space-y-8">
            {/* Hero Section Skeleton */}
            <div className="h-[60vh] bg-gray-200 rounded-lg"></div>
            
            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map(i => (
                    <div key={i} className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      {[1, 2, 3].map(j => (
                        <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Booking Card Skeleton */}
              <div>
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </Layout>
    );
  }
  
  if (!tour) {
    return (
      <Layout>
        <Section>
          <Alert variant="error" title="Tour Not Found">
            <p>The requested tour could not be found. Please check the URL and try again.</p>
            <div className="mt-4">
              <Link to="/tours" className="text-brand-600 hover:text-brand-700 font-medium flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tours
              </Link>
            </div>
          </Alert>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[60vh] sm:h-[70vh] relative overflow-hidden rounded-b-lg">
          <LoadingImage 
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[2px]"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="bg-accent-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg hover:bg-accent-600 transition-colors">
                    {tour.category.charAt(0).toUpperCase() + tour.category.slice(1)} Tour
                  </span>
                  <div className="flex items-center text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Star className="w-4 h-4 text-accent-400 fill-accent-400 mr-1" />
                    <span className="font-medium">{tour.rating}</span>
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {tour.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-white">
                  <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/40 transition-colors">
                    <MapPin className="w-5 h-5 mr-2 text-accent-400" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/40 transition-colors">
                    <Clock className="w-5 h-5 mr-2 text-accent-400" />
                    <span>{tour.duration}</span>
                  </div>
                  {tour.groupSize && (
                    <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/40 transition-colors">
                      <Users className="w-5 h-5 mr-2 text-accent-400" />
                      <span>{tour.groupSize.min}-{tour.groupSize.max} People</span>
                    </div>
                  )}
                  {tour.difficulty && (
                    <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/40 transition-colors">
                      <Mountain className="w-5 h-5 mr-2 text-accent-400" />
                      <span className="capitalize">{tour.difficulty} Level</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
              <p className="text-dark-600 leading-relaxed mb-6">
                {tour.description}
              </p>
              
              {tour.highlights && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3">Tour Highlights</h3>
                    <FeatureList features={tour.highlights.map(h => ({ text: h }))} />
                  </div>
                  {tour.requirements && (
                    <div>
                      <h3 className="font-bold text-lg mb-3">Requirements</h3>
                      <FeatureList features={tour.requirements.map(r => ({ text: r }))} />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Itinerary */}
            {tour.itinerary && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Tour Itinerary</h2>
                <div className="space-y-6">
                  {tour.itinerary.map((day) => (
                    <div 
                      key={day.day}
                      className={`border rounded-lg transition-all duration-300 ${
                        selectedDay === day.day 
                          ? 'border-accent-500 bg-accent-50' 
                          : 'border-gray-200 hover:border-accent-300'
                      }`}
                    >
                      <button
                        className="w-full text-left px-6 py-4 flex items-center justify-between"
                        onClick={() => setSelectedDay(day.day)}
                      >
                        <div>
                          <span className="text-accent-500 font-medium">Day {day.day}</span>
                          <h3 className="font-bold text-lg">{day.title}</h3>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${
                          selectedDay === day.day ? 'rotate-90' : ''
                        }`} />
                      </button>
                      
                      {selectedDay === day.day && (
                        <div className="px-6 pb-6">
                          <p className="text-dark-600 mb-4">{day.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2">Activities</h4>
                              <ul className="space-y-2">
                                {day.activities.map((activity, index) => (
                                  <li key={index} className="flex items-center text-dark-600">
                                    <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Meals Included</h4>
                                <div className="flex gap-2">
                                  {day.meals.map((meal) => (
                                    <span 
                                      key={meal}
                                      className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm capitalize flex items-center"
                                    >
                                      <Utensils className="w-4 h-4 mr-1" />
                                      {meal}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {day.accommodation && (
                                <div>
                                  <h4 className="font-medium mb-2">Accommodation</h4>
                                  <span className="flex items-center text-dark-600">
                                    <Home className="w-4 h-4 mr-2 text-brand-600" />
                                    {day.accommodation}
                                  </span>
                                </div>
                              )}
                              
                              {day.distance && (
                                <div className="flex items-center space-x-4 text-dark-600">
                                  <span>Distance: {day.distance}</span>
                                  {day.elevation && <span>Elevation: {day.elevation}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Gallery */}
            {tour.gallery && (
              <div
                className="space-y-6"
                style={{
                  opacity: loading ? 0 : 1,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              >
                <h2 className="text-2xl font-bold mb-4">Tour Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tour.gallery.map((image, index) => (
                    <div 
                      key={index} 
                      className="group aspect-w-16 aspect-h-9 rounded-lg overflow-hidden cursor-pointer"
                    >
                      <LoadingImage 
                        src={image}
                        alt={`Tour gallery image ${index + 1}`}
                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* FAQs */}
            {tour.faqs && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {tour.faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                      <p className="text-dark-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-dark-500">From</span>
                      <div className="text-3xl font-bold text-dark-900">
                        ${tour.price}
                        <span className="text-base font-normal text-dark-500">/person</span>
                      </div>
                    </div>
                    <button className="text-dark-400 hover:text-dark-600 p-2">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <Link to={`/book?tour=${tour.id}`}>
                    <Button 
                      variant="accent"
                      fullWidth
                      className="mb-4"
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      Book Now
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    rightIcon={<Share2 className="w-4 h-4" />}
                  >
                    Share Tour
                  </Button>
                </div>
                
                {tour.included && (
                  <div className="border-t border-gray-100 p-6">
                    <h3 className="font-bold text-lg mb-4">What's Included</h3>
                    <div className="space-y-3">
                      {tour.included.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-accent-500/10 rounded-full p-1 mr-3 mt-0.5">
                            <svg className="w-3 h-3 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-dark-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {tour.excluded && (
                  <div className="border-t border-gray-100 p-6">
                    <h3 className="font-bold text-lg mb-4">Not Included</h3>
                    <div className="space-y-3">
                      {tour.excluded.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-red-500/10 rounded-full p-1 mr-3 mt-0.5">
                            <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <span className="text-dark-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default TourDetail;