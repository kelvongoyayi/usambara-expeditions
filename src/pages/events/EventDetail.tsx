import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Clock, Calendar, Users, ChevronRight, Heart, 
  Share2, Star, Coffee, Utensils, Home, ArrowLeft
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Section from '../../components/ui/Section';
import { Button, Alert, FeatureList } from '../../components/ui';
import LoadingImage from '../../components/ui/LoadingImage';
import { eventsService } from '../../services/events.service';
import { FeaturedItem } from '../../types/tours';

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [selectedDay, setSelectedDay] = useState(1);
  const [event, setEvent] = useState<FeaturedItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const eventData = await eventsService.getEventById(eventId);
        
        if (eventData) {
          // Convert to FeaturedItem format
          setEvent(eventsService.toFeaturedItem(eventData));
        } else {
          console.error(`Event with ID ${eventId} not found`);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <Layout>
        <Section>
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
          </div>
        </Section>
      </Layout>
    );
  }
  
  if (!event) {
    return (
      <Layout>
        <Section>
          <Alert variant="error" title="Event Not Found">
            <p>The requested event could not be found. Please check the URL and try again.</p>
            <div className="mt-4">
              <Link to="/events" className="text-brand-600 hover:text-brand-700 font-medium flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
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
      <div className="relative pt-20">
        <div className="h-[60vh] relative">
          <LoadingImage 
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Featured Event
                  </span>
                  <div className="flex items-center text-white">
                    <Star className="w-4 h-4 text-accent-400 fill-accent-400 mr-1" />
                    <span className="font-medium">{event.rating}</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-white">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-accent-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-accent-400" />
                    <span>{event.duration}</span>
                  </div>
                  {event.date && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-accent-400" />
                      <span>{event.date}</span>
                    </div>
                  )}
                  {event.groupSize && (
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-accent-400" />
                      <span>{event.groupSize.min}-{event.groupSize.max} Participants</span>
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
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Event Overview</h2>
              <p className="text-dark-600 leading-relaxed mb-6">
                {event.description}
              </p>
              
              {event.highlights && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3">Event Highlights</h3>
                    <FeatureList features={event.highlights.map(h => ({ text: h }))} />
                  </div>
                </div>
              )}
            </div>
            
            {/* Itinerary */}
            {event.itinerary && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
                <div className="space-y-6">
                  {event.itinerary.map((day) => (
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
            {event.gallery && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Event Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.gallery.map((image, index) => (
                    <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <LoadingImage 
                        src={image}
                        alt={`Event gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* FAQs */}
            {event.faqs && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {event.faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                      <p className="text-dark-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Registration Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-dark-500">Registration</span>
                      <div className="text-3xl font-bold text-dark-900">
                        ${event.price}
                        <span className="text-base font-normal text-dark-500">/person</span>
                      </div>
                      <div className="mt-1 text-sm text-dark-500">
                        Pricing is per participant
                      </div>
                    </div>
                    <button className="text-dark-400 hover:text-dark-600 p-2">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg mb-4">
                    <Calendar className="w-5 h-5 text-brand-600 mr-3" />
                    <div>
                      <p className="text-dark-600 text-sm">Event Date</p>
                      <p className="font-medium">{event.date}</p>
                    </div>
                  </div>
                  
                  <Link to={`/book?event=${event.id}`}>
                    <Button 
                      variant="accent"
                      fullWidth
                      className="mb-4"
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      Register Now
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    rightIcon={<Share2 className="w-4 h-4" />}
                  >
                    Share Event
                  </Button>
                </div>
                
                {event.included && (
                  <div className="border-t border-gray-100 p-6">
                    <h3 className="font-bold text-lg mb-4">What's Included</h3>
                    <div className="space-y-3">
                      {event.included.map((item, index) => (
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
                
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <h3 className="font-bold text-lg mb-4">Need More Information?</h3>
                  <p className="text-dark-600 mb-4">
                    Contact our events team for customized packages or special requirements.
                  </p>
                  <Button 
                    variant="primary"
                    fullWidth
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default EventDetail;