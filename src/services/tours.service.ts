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
  best_season?: string;
  season?: string;
  accommodation_type?: string;
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
        .eq('status', 'published')
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
      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single();
      
      if (tourError) {
        console.error('Error fetching tour data:', tourError);
        throw tourError;
      }
      
      if (!tourData) {
        console.error('No tour found with ID:', id);
        return null;
      }
      
      // Process and normalize itinerary data if it exists in the tour object
      let normalizedItinerary = [];
      if (tourData.itinerary && Array.isArray(tourData.itinerary)) {
        normalizedItinerary = tourData.itinerary.map((day, index) => {
          // Create a unique ID if not present
          const dayId = `day_${Date.now()}_${index}`;
          
          // Normalize the structure - handle both "day" and "day_number" fields
          return {
            id: dayId,
            day_number: day.day_number || day.day || index + 1,
            title: day.title || `Day ${day.day_number || day.day || index + 1}`,
            description: day.description || '',
            location: day.location || '',
            distance: day.distance || '',
            difficulty: day.difficulty || '',
            accommodation: day.accommodation || '',
            meals: Array.isArray(day.meals) ? day.meals : [],
            activities: Array.isArray(day.activities) ? day.activities : [],
            elevation: day.elevation || '',
            // Preserve original day field for backward compatibility
            day: day.day_number || day.day || index + 1
          };
        });
        
        console.log('Normalized itinerary data:', normalizedItinerary);
      }
      
      // Get itinerary data from dedicated table (as a fallback)
      const { data: itineraryData, error: itineraryError } = await supabase
        .from('tour_itinerary')
        .select('*')
        .eq('tour_id', id)
        .order('day_number', { ascending: true });
      
      if (itineraryError) {
        console.error('Error fetching itinerary:', itineraryError);
      }
      
      // Use the normalized itinerary from tourData.itinerary if it exists, otherwise use itineraryData
      const finalItinerary = normalizedItinerary.length > 0 ? normalizedItinerary : (itineraryData || []);
      
      // Get FAQs related to this tour
      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs')
        .select('*')
        .eq('tour_id', id)
        .order('created_at', { ascending: true });
      
      if (faqsError) {
        console.error('Error fetching FAQs:', faqsError);
      }
      
      // Combine tour, itinerary, and FAQs data
      const result = {
        ...tourData,
        itinerary: finalItinerary,
        faqs: faqsData || []
      } as Tour;
      
      return result;
    } catch (error) {
      console.error(`Error fetching tour with id ${id}:`, error);
      return null;
    }
  },

  async getToursByCategory(category: string): Promise<Tour[]> {
    try {
      let query = supabase
        .from('tours')
        .select('*')
        .eq('status', 'published');
      
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
        .eq('status', 'published')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching featured tours:', error);
      return [];
    }
  },

  async createOrUpdateFAQs(tourId: string, faqs: any[]): Promise<boolean> {
    if (!Array.isArray(faqs) || faqs.length === 0) {
      console.log('No FAQs to insert');
      return true; // Consider this a success as there's nothing to insert
    }
    
    try {
      // First, delete any existing FAQs for this tour to avoid duplicates
      const { error: deleteError } = await supabase
        .from('faqs')
        .delete()
        .eq('tour_id', tourId);
      
      if (deleteError) {
        console.error('Error deleting existing FAQs:', deleteError);
        // Continue with insertion even if deletion fails
      }
      
      // Prepare the FAQs for insertion
      const faqsToInsert = faqs.map(faq => ({
        tour_id: tourId,
        question: faq.question || '',
        answer: faq.answer || '',
        created_at: new Date().toISOString()
      }));
      
      console.log('Inserting FAQ data:', JSON.stringify(faqsToInsert, null, 2));
      
      // Insert the FAQs
      const { error: insertError } = await supabase
        .from('faqs')
        .insert(faqsToInsert);
      
      if (insertError) {
        console.error('Error inserting FAQs:', insertError);
        console.error('Error details:', JSON.stringify(insertError, null, 2));
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating/updating FAQs:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
  },

  async createTour(tour: Omit<Tour, 'id' | 'created_at' | 'updated_at'>): Promise<Tour | null> {
    try {
      const now = new Date().toISOString();
      
      // Extract arrays from tour data to handle separately
      const { itinerary, faqs, ...tourData } = tour;
      
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
      
      // If there's FAQs data, add it to the FAQs table
      if (faqs && Array.isArray(faqs) && faqs.length > 0 && createdTour.id) {
        try {
          const faqsSuccess = await this.createOrUpdateFAQs(createdTour.id, faqs);
          if (!faqsSuccess) {
            console.warn('Warning: Created tour but failed to save FAQs data');
          }
        } catch (faqsError) {
          console.error('Error saving FAQs:', faqsError);
          // Continue even if FAQs save fails - the tour was created successfully
        }
      } else {
        console.log('No FAQs data to save or FAQs were empty');
      }
      
      // Return the created tour with the additional data
      return {
        ...createdTour,
        itinerary: itinerary || [],
        faqs: faqs || []
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
      
      // Prepare the itinerary days for insertion - standardize field names
      const itineraryToInsert = itineraryDays.map((day, index) => {
        // Handle both frontend and admin form field naming conventions
        const dayNumber = day.day_number || day.day || index + 1;
        
        // Process meals to ensure it's always an array of strings
        let meals = [];
        if (Array.isArray(day.meals)) {
          meals = day.meals.filter(Boolean);
        } else if (typeof day.meals === 'string' && day.meals.trim()) {
          meals = day.meals.split(',').map(m => m.trim()).filter(Boolean);
        }
        
        // Process activities to ensure it's always an array of strings
        let activities = [];
        if (Array.isArray(day.activities)) {
          activities = day.activities.filter(Boolean);
        } else if (typeof day.activities === 'string' && day.activities.trim()) {
          activities = day.activities.split(',').map(a => a.trim()).filter(Boolean);
        }
        
        // Ensure all required fields are present
        const preparedDay = {
          tour_id: tourId,
          day_number: dayNumber,
          title: day.title || `Day ${dayNumber}`,
          description: day.description || '',
          location: day.location || '',
          distance: day.distance || '',
          elevation: day.elevation || '',
          accommodation: day.accommodation || '',
          meals: meals,
          activities: activities
        };
        
        console.log(`Prepared itinerary day ${dayNumber}:`, preparedDay);
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
      // Extract arrays from tour data to handle separately
      const { itinerary, faqs, ...tourData } = tour;
      
      // Convert numeric fields
      const processedTourData = {
        ...tourData,
        price: typeof tourData.price === 'string' ? parseFloat(tourData.price) : tourData.price,
        rating: typeof tourData.rating === 'string' ? parseFloat(tourData.rating) : tourData.rating,
        min_group_size: tourData.min_group_size ? Number(tourData.min_group_size) : undefined,
        max_group_size: tourData.max_group_size ? Number(tourData.max_group_size) : undefined
      };
      
      console.log('Updating tour with processed data:', JSON.stringify(processedTourData, null, 2));
      
      // If there's itinerary data, normalize it for storage in the database
      let processedItinerary = null;
      if (itinerary && Array.isArray(itinerary) && itinerary.length > 0) {
        // Convert from form format (day_number) to database format (day)
        processedItinerary = itinerary.map((day, index) => ({
          day: day.day_number || day.day || index + 1,
          title: day.title || `Day ${day.day_number || day.day || index + 1}`,
          description: day.description || '',
          location: day.location || '',
          distance: day.distance || '',
          accommodation: day.accommodation || '',
          meals: Array.isArray(day.meals) ? day.meals : [],
          activities: Array.isArray(day.activities) ? day.activities : [],
          elevation: day.elevation || ''
        }));
        
        console.log('Processed itinerary for database storage:', processedItinerary);
      }
      
      // Update the tour in the tours table
      const { data: updatedTour, error } = await supabase
        .from('tours')
        .update({
          ...processedTourData,
          itinerary: processedItinerary, // Store normalized itinerary data directly in the tours table
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // If there's itinerary data, always update it in the separate table too (for backwards compatibility)
      if (itinerary && Array.isArray(itinerary) && itinerary.length > 0) {
        try {
          const itineraryResult = await this.createOrUpdateItinerary(id, itinerary);
          if (!itineraryResult) {
            console.error('Failed to update itinerary data in separate table');
          }
        } catch (itineraryError) {
          console.error('Error updating itinerary in separate table:', itineraryError);
          // Continue even if separate table update fails - the tour was updated successfully
        }
      }
      
      // If there's FAQs data, update it
      if (faqs && faqs.length > 0) {
        await this.createOrUpdateFAQs(id, faqs);
      }
      
      // Get the updated tour with fresh itinerary and FAQs data
      const refreshedTour = await this.getTourById(id);
      
      // Return the updated tour with all the data
      return refreshedTour;
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
    // Map itinerary data from database format to frontend format
    const mappedItinerary = tour.itinerary?.map(day => ({
      day: day.day_number || day.day || 0,
      title: day.title || '',
      description: day.description || '',
      activities: Array.isArray(day.activities) ? day.activities : [],
      meals: Array.isArray(day.meals) ? day.meals : [],
      accommodation: day.accommodation || '',
      distance: day.distance || '',
      elevation: day.elevation || '',
      location: day.location || ''
    })) || [];

    console.log('Mapped itinerary for frontend:', mappedItinerary);

    // Map FAQs from database format
    const mappedFaqs = tour.faqs?.map(faq => ({
      question: faq.question,
      answer: faq.answer
    })) || [];

    // Generate special ID with prefix based on category
    // Create prefix that matches the URL route for proper filtering
    let specialId = tour.id;
    if (tour.category === 'cycling') {
      specialId = `mtb-${tour.id.substring(0, 6)}`;
    } else if (tour.category === 'hiking') {
      specialId = `hiking-${tour.id.substring(0, 6)}`;
    } else if (tour.category === '4x4') {
      specialId = `4x4-${tour.id.substring(0, 6)}`;
    } else if (tour.category === 'motocamping') {
      specialId = `moto-${tour.id.substring(0, 6)}`;
    } else if (tour.category === 'school') {
      specialId = `school-${tour.id.substring(0, 6)}`;
    }

    return {
      id: specialId,
      originalId: tour.id, // Preserve the original UUID
      title: tour.title,
      slug: tour.slug,
      duration: tour.duration,
      price: typeof tour.price === 'string' ? parseFloat(tour.price as string) : tour.price,
      location: tour.location,
      image: tour.image_url,
      rating: tour.rating || 0,
      description: tour.description,
      category: tour.category as any,
      featured: tour.featured,
      type: 'tour',
      difficulty: tour.difficulty as any,
      groupSize: tour.min_group_size && tour.max_group_size ? 
        { min: tour.min_group_size, max: tour.max_group_size } : undefined,
      startLocation: tour.start_location,
      endLocation: tour.end_location,
      highlights: tour.highlights || [],
      requirements: tour.requirements || [],
      gallery: tour.gallery || [],
      included: tour.included || [],
      excluded: tour.excluded || [],
      itinerary: mappedItinerary,
      faqs: mappedFaqs,
      bestSeason: tour.best_season,
      season: tour.season,
      accommodationType: tour.accommodation_type,
      createdAt: tour.created_at,
      updatedAt: tour.updated_at,
      status: tour.status || 'published'
    };
  }
};