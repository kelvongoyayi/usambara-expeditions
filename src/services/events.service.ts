import { supabase } from '../lib/supabase';
import type { FeaturedItem, DayItinerary, FAQ } from '../types/tours';


// IMPLEMENTATION STATUS: PARTIAL
// This service currently uses mock data but has the right interfaces.
// It's actively used in the UI components but will need to be updated
// to use Supabase queries when connecting to the backend.
export interface Event {
  id: string;
  title: string;
  slug: string;
  event_type: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url: string;
  price: number;
  discounted_price?: number;
  registration_deadline?: string;
  rating: number;
  duration: string;
  created_at: string;
  updated_at: string;
  featured: boolean;
  min_attendees?: number;
  max_attendees?: number;
  highlights?: string[];
  gallery?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: DayItinerary[];
  faqs?: FAQ[];
}

export const eventsService = {
  async getEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  async getEventById(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Error fetching event with id ${id}:`, error);
      return null;
    }
  },

  async getEventsByType(eventType: string): Promise<Event[]> {
    try {
      let query = supabase
        .from('events')
        .select('*');
      
      if (eventType && eventType !== 'all') {
        query = query.eq('event_type', eventType);
      }
      
      const { data, error } = await query.order('start_date', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching events of type ${eventType}:`, error);
      return [];
    }
  },

  async getFeaturedEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('featured', true)
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  },

  async getEventTypes(): Promise<{id: string; name: string}[]> {
    try {
      const { data, error } = await supabase
        .from('event_types')
        .select('id, name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching event types:', error);
      // Return default event types if API call fails
      return [
        { id: 'corporate', name: 'Corporate Event' },
        { id: 'adventure', name: 'Adventure Event' },
        { id: 'education', name: 'Educational Program' },
        { id: 'special', name: 'Special Occasion' }
      ];
    }
  },

  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event | null> {
    try {
      const now = new Date().toISOString();

      // Convert price to numeric if it's a string
      const eventData = {
        ...event,
        price: typeof event.price === 'string' ? parseFloat(event.price) : event.price,
        rating: typeof event.rating === 'string' ? parseFloat(event.rating) : event.rating,
        min_attendees: event.min_attendees ? Number(event.min_attendees) : undefined,
        max_attendees: event.max_attendees ? Number(event.max_attendees) : undefined
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          created_at: now,
          updated_at: now
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  },

  async updateEvent(id: string, event: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>): Promise<Event | null> {
    try {
      // Convert price to numeric if it's a string
      const eventData = {
        ...event,
        price: typeof event.price === 'string' ? parseFloat(event.price) : event.price,
        rating: typeof event.rating === 'string' ? parseFloat(event.rating) : event.rating,
        min_attendees: event.min_attendees ? Number(event.min_attendees) : undefined,
        max_attendees: event.max_attendees ? Number(event.max_attendees) : undefined
      };
      
      const { data, error } = await supabase
        .from('events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Error updating event with id ${id}:`, error);
      return null;
    }
  },

  async deleteEvent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting event with id ${id}:`, error);
      return false;
    }
  },

  // Convert database Event to FeaturedItem format
  toFeaturedItem(event: Event): FeaturedItem {
    // Format date for display (e.g., "June 15-18, 2025")
    const formatDateRange = () => {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      
      // If same date
      if (startDate.toDateString() === endDate.toDateString()) {
        return startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      
      // If same month and year
      if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDate.toLocaleDateString('en-US', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}, ${endDate.getFullYear()}`;
      }
      
      // Different months
      return `${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    };

    return {
      id: event.id,
      title: event.title,
      duration: event.duration,
      price: event.price,
      location: event.location,
      image: event.image_url,
      rating: event.rating,
      description: event.description,
      category: 'event',
      featured: event.featured,
      type: 'event',
      date: formatDateRange(),
      groupSize: event.min_attendees && event.max_attendees ? 
        { min: event.min_attendees, max: event.max_attendees } : undefined,
      highlights: event.highlights,
      gallery: event.gallery,
      included: event.included,
      excluded: event.excluded,
      itinerary: event.itinerary,
      faqs: event.faqs
    };
  }
};