import { supabase } from '../lib/supabase';
import type { FeaturedItem, DayItinerary, FAQ } from '../types/tours';


// IMPLEMENTATION STATUS: PARTIAL
// This service currently uses mock data but has the right interfaces.
// It's actively used in the UI components but will need to be updated
// to use Supabase queries when connecting to the backend.
export interface Tour {
  id: string;
  title: string;
  slug: string;
  duration: string;
  price: number;
  location: string;
  image_url: string;
  rating: number;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
  featured: boolean;
  difficulty?: string;
  min_group_size?: number;
  max_group_size?: number;
  start_location?: string;
  end_location?: string;
  highlights?: string[];
  requirements?: string[];
  included?: string[];
  excluded?: string[];
  gallery?: string[];
  itinerary?: DayItinerary[];
  faqs?: FAQ[];
}

// Define itinerary day interface
export interface ItineraryDay {
  id?: string;
  tour_id: string;
  day_number: number;
  title: string;
  description: string;
  location?: string;
  distance?: string;
  accommodation?: string;
  meals?: string[];
  activities?: string[];
}

export const toursService = {
  async getTours(): Promise<Tour[]> {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []) as Tour[];
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  },

  async getTourById(id: string): Promise<Tour | null> {
    try {
      console.log(`Fetching tour with ID: ${id}`);
      
      if (!id) {
        console.error('Tour ID is missing or invalid');
        return null;
      }
      
      // Get tour data
      console.log('Querying tours table...');
      console.log('Using ID to query:', id, 'Type:', typeof id);
      
      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id as any)
        .single();
      
      if (tourError) {
        console.error('Error fetching tour data:', tourError);
        console.error('Status code:', tourError.code);
        console.error('Error message:', tourError.message);
        console.error('Error details:', tourError.details);
        throw tourError;
      }
      
      if (!tourData) {
        console.error('No tour found with ID:', id);
        return null;
      }
      
      console.log('Tour data retrieved:', tourData);
      
      // Get itinerary data
      console.log('Querying tour_itinerary table...');
      try {
        const { data: itineraryData, error: itineraryError } = await supabase
          .from('tour_itinerary')
          .select('*')
          .eq('tour_id', id as any)
          .order('day_number', { ascending: true });
        
        if (itineraryError) {
          console.error('Error fetching itinerary:', itineraryError);
          console.error('Status code:', itineraryError.code);
          console.error('Error message:', itineraryError.message);
          // Continue with the tour data even if itinerary fetch fails
        } else {
          console.log('Itinerary data retrieved:', itineraryData);
        }
        
        // Combine tour and itinerary data
        const result = {
          ...(tourData as any),
          itinerary: itineraryData || []
        } as Tour;
        
        console.log('Returning combined tour data:', result);
        return result;
      } catch (innerError) {
        console.error('Inner error fetching itinerary:', innerError);
        // Return tour data without itinerary if there was an error
        return tourData as Tour;
      }
    } catch (error) {
      console.error(`Error fetching tour with id ${id}:`, error);
      return null;
    }
  },

  async getToursByCategory(category: string): Promise<Tour[]> {
    try {
      let query = supabase
        .from('tours')
        .select('*');
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching tours in category ${category}:`, error);
      return [];
    }
  },

  async getFeaturedTours(): Promise<Tour[]> {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching featured tours:', error);
      return [];
    }
  },

  async createTour(tour: Omit<Tour, 'id' | 'created_at' | 'updated_at'>): Promise<Tour | null> {
    try {
      const now = new Date().toISOString();
      
      // Extract itinerary from tour data to handle separately
      const { itinerary, ...tourData } = tour;
      
      // Convert numeric fields
      const processedTourData = {
        ...tourData,
        price: typeof tourData.price === 'string' ? parseFloat(tourData.price) : tourData.price,
        rating: typeof tourData.rating === 'string' ? parseFloat(tourData.rating) : tourData.rating,
        min_group_size: tourData.min_group_size ? Number(tourData.min_group_size) : undefined,
        max_group_size: tourData.max_group_size ? Number(tourData.max_group_size) : undefined
      };
      
      console.log('Service creating tour with data:', JSON.stringify(processedTourData, null, 2));
      
      // Insert the tour into the tours table
      const { data: createdTour, error: tourError } = await supabase
        .from('tours')
        .insert([{
          ...processedTourData,
          created_at: now,
          updated_at: now
        }])
        .select()
        .single();
      
      if (tourError) {
        console.error('Supabase error creating tour:', tourError);
        console.error('Error details:', JSON.stringify(tourError, null, 2));
        throw { message: 'Database error creating tour', error: tourError };
      }
      
      console.log('Tour created successfully:', createdTour);
      
      // If there's itinerary data, add it to the tour_itinerary table
      if (itinerary && Array.isArray(itinerary) && itinerary.length > 0 && createdTour.id) {
        try {
          const itinerarySuccess = await this.createOrUpdateItinerary(createdTour.id, itinerary);
          if (!itinerarySuccess) {
            console.warn('Warning: Created tour but failed to save itinerary data');
          }
        } catch (itineraryError) {
          console.error('Error saving itinerary:', itineraryError);
          // Continue even if itinerary save fails - the tour was created successfully
        }
      } else {
        console.log('No itinerary data to save or itinerary was empty');
      }
      
      // Return the created tour with the itinerary data
      return {
        ...createdTour,
        itinerary: itinerary || []
      };
    } catch (error) {
      console.error('Error creating tour:', error);
      // Re-throw the error so we can handle it in the UI
      throw error;
    }
  },

  async createOrUpdateItinerary(tourId: string, itineraryDays: any[]): Promise<boolean> {
    if (!Array.isArray(itineraryDays) || itineraryDays.length === 0) {
      console.log('No itinerary days to insert');
      return true; // Consider this a success as there's nothing to insert
    }
    
    try {
      // First, delete any existing itinerary days for this tour to avoid duplicates
      const { error: deleteError } = await supabase
        .from('tour_itinerary')
        .delete()
        .eq('tour_id', tourId);
      
      if (deleteError) {
        console.error('Error deleting existing itinerary:', deleteError);
        // Continue with insertion even if deletion fails
      }
      
      // Prepare the itinerary days for insertion
      const itineraryToInsert = itineraryDays.map((day, index) => {
        // Ensure all required fields are present
        const preparedDay = {
          tour_id: tourId,
          day_number: day.day_number || index + 1,
          title: day.title || `Day ${index + 1}`,
          description: day.description || '',
          location: day.location || '',
          distance: day.distance || '',
          accommodation: day.accommodation || '',
          meals: Array.isArray(day.meals) ? day.meals : [],
          activities: Array.isArray(day.activities) ? day.activities : []
        };
        
        console.log(`Prepared itinerary day ${index + 1}:`, preparedDay);
        return preparedDay;
      });
      
      console.log('Inserting itinerary data:', JSON.stringify(itineraryToInsert, null, 2));
      
      // Insert the itinerary days
      const { error: insertError } = await supabase
        .from('tour_itinerary')
        .insert(itineraryToInsert);
      
      if (insertError) {
        console.error('Error inserting itinerary:', insertError);
        console.error('Error details:', JSON.stringify(insertError, null, 2));
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating/updating itinerary:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
  },

  async updateTour(id: string, tour: Partial<Omit<Tour, 'id' | 'created_at' | 'updated_at'>>): Promise<Tour | null> {
    try {
      // Extract itinerary from tour data to handle separately
      const { itinerary, ...tourData } = tour;
      
      // Convert numeric fields
      const processedTourData = {
        ...tourData,
        price: typeof tourData.price === 'string' ? parseFloat(tourData.price) : tourData.price,
        rating: typeof tourData.rating === 'string' ? parseFloat(tourData.rating) : tourData.rating,
        min_group_size: tourData.min_group_size ? Number(tourData.min_group_size) : undefined,
        max_group_size: tourData.max_group_size ? Number(tourData.max_group_size) : undefined
      };
      
      // Update the tour in the tours table
      const { data: updatedTour, error } = await supabase
        .from('tours')
        .update({
          ...processedTourData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // If there's itinerary data, update it
      if (itinerary && itinerary.length > 0) {
        await this.createOrUpdateItinerary(id, itinerary);
      }
      
      // Return the updated tour with the itinerary data
      return {
        ...updatedTour,
        itinerary: itinerary || []
      };
    } catch (error) {
      console.error(`Error updating tour with id ${id}:`, error);
      return null;
    }
  },

  async deleteTour(id: string): Promise<boolean> {
    try {
      // First delete associated itinerary days
      const { error: itineraryError } = await supabase
        .from('tour_itinerary')
        .delete()
        .eq('tour_id', id);
      
      if (itineraryError) {
        console.error(`Error deleting itinerary for tour ${id}:`, itineraryError);
        // Continue with tour deletion even if itinerary deletion fails
      }
      
      // Then delete the tour
      const { error } = await supabase.from('tours').delete().eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting tour with id ${id}:`, error);
      return false;
    }
  },
  
  async getTourCategories(): Promise<{id: string; name: string}[]> {
    try {
      const { data, error } = await supabase
        .from('tour_categories')
        .select('id, name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching tour categories:', error);
      // Return default categories if API call fails
      return [
        { id: 'hiking', name: 'Hiking' },
        { id: 'cycling', name: 'Cycling' },
        { id: 'cultural', name: 'Cultural' },
        { id: '4x4', name: '4x4 Expedition' },
        { id: 'motocamping', name: 'Motocamping' },
        { id: 'school', name: 'School Tours' }
      ];
    }
  },

  // Convert database Tour to FeaturedItem format
  toFeaturedItem(tour: Tour): FeaturedItem {
    return {
      id: tour.id,
      title: tour.title,
      duration: tour.duration,
      price: tour.price,
      location: tour.location,
      image: tour.image_url,
      rating: tour.rating,
      description: tour.description,
      category: tour.category as any,
      featured: tour.featured,
      type: 'tour',
      difficulty: tour.difficulty as any,
      groupSize: tour.min_group_size && tour.max_group_size ? 
        { min: tour.min_group_size, max: tour.max_group_size } : undefined,
      startLocation: tour.start_location,
      endLocation: tour.end_location,
      highlights: tour.highlights,
      requirements: tour.requirements,
      gallery: tour.gallery,
      included: tour.included,
      excluded: tour.excluded,
      itinerary: tour.itinerary,
      faqs: tour.faqs
    };
  }
};