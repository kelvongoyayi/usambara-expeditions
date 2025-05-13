import { supabase } from '../lib/supabase';
import type { FeaturedItem, DayItinerary, FAQ } from '../types/tours';

// IMPLEMENTATION STATUS: COMPLETE
// This service now handles all form fields properly, including arrays and the time field
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
  destination_id: string;
  created_by?: string;
  time?: string; // Time field used in form but not stored directly in database
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

      // Normalize data for database storage
      const eventData = {
        ...event,
        // Convert price and other numeric fields
        price: typeof event.price === 'string' ? parseFloat(event.price) : event.price,
        rating: typeof event.rating === 'string' ? parseFloat(event.rating) : (event.rating || 0),
        min_attendees: event.min_attendees ? Number(event.min_attendees) : undefined,
        max_attendees: event.max_attendees ? Number(event.max_attendees) : undefined,
        
        // Ensure arrays are properly formatted
        highlights: Array.isArray(event.highlights) ? event.highlights.filter(Boolean) : [],
        gallery: Array.isArray(event.gallery) ? event.gallery.filter(Boolean) : [],
        included: Array.isArray(event.included) ? event.included.filter(Boolean) : [],
        excluded: Array.isArray(event.excluded) ? event.excluded.filter(Boolean) : [],
        
        // Handle combined date + time if time is provided
        start_date: event.time && event.start_date ? 
          this.combineDateAndTime(event.start_date, event.time) : 
          event.start_date
      };

      // Remove the time field as it's not stored in the database directly
      const { time, ...dataToInsert } = eventData;
      
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...dataToInsert,
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
      // Normalize data for database storage
      const eventData = {
        ...event,
        // Convert price and other numeric fields if they exist
        price: event.price !== undefined ? 
          (typeof event.price === 'string' ? parseFloat(event.price) : event.price) : undefined,
        rating: event.rating !== undefined ?
          (typeof event.rating === 'string' ? parseFloat(event.rating) : event.rating) : undefined,
        min_attendees: event.min_attendees !== undefined ? Number(event.min_attendees) : undefined,
        max_attendees: event.max_attendees !== undefined ? Number(event.max_attendees) : undefined,
        
        // Handle arrays if they exist
        highlights: event.highlights ? 
          (Array.isArray(event.highlights) ? event.highlights.filter(Boolean) : []) : undefined,
        gallery: event.gallery ? 
          (Array.isArray(event.gallery) ? event.gallery.filter(Boolean) : []) : undefined,
        included: event.included ? 
          (Array.isArray(event.included) ? event.included.filter(Boolean) : []) : undefined,
        excluded: event.excluded ? 
          (Array.isArray(event.excluded) ? event.excluded.filter(Boolean) : []) : undefined,
        
        // Handle combined date + time if both exist
        start_date: event.time && event.start_date ? 
          this.combineDateAndTime(event.start_date, event.time) : 
          event.start_date
      };

      // Remove the time field as it's not stored directly
      const { time, ...dataToUpdate } = eventData;
      
      const { data, error } = await supabase
        .from('events')
        .update({
          ...dataToUpdate,
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

  // Utility function to combine date and time
  combineDateAndTime(dateStr: string, timeStr: string): string {
    try {
      // Make sure date is in YYYY-MM-DD format
      const dateParts = dateStr.split('-');
      if (dateParts.length !== 3) {
        console.error('Invalid date format, expected YYYY-MM-DD');
        return dateStr;
      }
      
      // Create a valid ISO timestamp
      return `${dateStr}T${timeStr}:00`;
    } catch (error) {
      console.error('Error combining date and time:', error);
      return dateStr;
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