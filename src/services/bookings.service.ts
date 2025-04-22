import { supabase } from '../lib/supabase';


// IMPLEMENTATION STATUS: PARTIAL
// This service currently uses mock data but has the right interfaces.
// It's actively used in the UI components but will need to be updated
// to use Supabase queries when connecting to the backend.
export interface BookingDetails {
  id: string;
  user_id?: string;
  booking_reference: string;
  booking_date: string;
  travel_date?: string;
  customer_name: string;
  customer_email: string;
  tour_id?: string;
  event_id?: string;
  total_price: number;
  total_amount?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  adults?: number;
  children?: number;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  tourTitle?: string;
  eventTitle?: string;
  is_guest_booking?: boolean;
  error_details?: string;
}

export const bookingsService = {
  async getBookings(): Promise<{ data: BookingDetails[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tours(title),
          events(title)
        `)
        .order('booking_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        return { data: null, error };
      }
      
      // Transform the data to match our BookingDetails interface
      const transformedData = (data || []).map(booking => ({
        ...booking,
        tourTitle: booking.tours?.title,
        eventTitle: booking.events?.title,
        // Map total_amount to total_price for UI consistency
        total_price: booking.total_amount || booking.total_price
      }));
      
      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return { data: null, error };
    }
  },

  async getBookingById(id: string): Promise<BookingDetails | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tours(title),
          events(title)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        tourTitle: data.tours?.title,
        eventTitle: data.events?.title
      };
    } catch (error) {
      console.error(`Error fetching booking with id ${id}:`, error);
      return null;
    }
  },

  async getUserBookings(userId: string): Promise<BookingDetails[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tours(title),
          events(title)
        `)
        .eq('user_id', userId)
        .order('booking_date', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(booking => ({
        ...booking,
        tourTitle: booking.tours?.title,
        eventTitle: booking.events?.title
      }));
    } catch (error) {
      console.error(`Error fetching bookings for user ${userId}:`, error);
      return [];
    }
  },

  async createBooking(booking: Omit<BookingDetails, 'id' | 'created_at' | 'updated_at'>): Promise<BookingDetails | null> {
    try {
      // Generate a booking reference if not provided
      const bookingReference = booking.booking_reference || 
        `UE-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Add timestamps to the booking data and ensure total_amount is set
      const bookingData = {
        ...booking,
        booking_reference: bookingReference,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Set is_guest_booking if user is not logged in
        is_guest_booking: !booking.user_id,
        // Make sure total_amount field is set for database consistency
        total_amount: booking.total_price
      };
      
      // Remove user_id if it's undefined or null to avoid RLS issues
      if (!bookingData.user_id) {
        delete bookingData.user_id;
      }
      
      console.log('[BookingService] Submitting booking to Supabase:', JSON.stringify(bookingData, null, 2));
      
      // For guest bookings, make sure the correct data structure is used
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();
      
      if (error) {
        console.error('[BookingService] Error creating booking:', error);
        console.error('[BookingService] Error code:', error.code);
        console.error('[BookingService] Error message:', error.message);
        console.error('[BookingService] Error details:', error.details);
        
        // Try a simplified approach with minimal data
        console.log('[BookingService] Retrying with simplified data structure...');
        
        // Create a simplified booking object with only essential fields
        const essentialData = {
          booking_reference: bookingReference,
          booking_date: new Date().toISOString(),
          customer_name: booking.customer_name,
          customer_email: booking.customer_email,
          is_guest_booking: true,
          status: 'pending',
          payment_status: 'pending',
          total_price: booking.total_price,
          total_amount: booking.total_price, // Make sure total_amount field is set for database
          // Include one of tour_id or event_id as required by the database constraint
          ...(booking.tour_id ? { tour_id: booking.tour_id } : {}),
          ...(booking.event_id ? { event_id: booking.event_id } : {})
        };
        
        console.log('[BookingService] Simplified booking data:', JSON.stringify(essentialData, null, 2));
        
        // Try inserting with simplified data
        const { data: retryData, error: retryError } = await supabase
          .from('bookings')
          .insert([essentialData])
          .select()
          .single();
          
        if (retryError) {
          console.error('[BookingService] Final error creating booking after retry:', retryError);
          console.error('[BookingService] Retry error code:', retryError.code);
          console.error('[BookingService] Retry error message:', retryError.message);
          console.error('[BookingService] Retry error details:', retryError.details);
          
          // If there's STILL an error, return a minimal booking object with error flag
          return {
            id: 'error',
            booking_reference: bookingReference,
            booking_date: new Date().toISOString(),
            customer_name: booking.customer_name,
            customer_email: booking.customer_email,
            total_price: booking.total_price,
            status: 'pending',
            payment_status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_guest_booking: true,
            error_details: retryError.message
          } as any;
        }
        
        console.log('[BookingService] Booking created successfully on retry!', retryData);
        return retryData as BookingDetails;
      }
      
      console.log('[BookingService] Booking created successfully!', data);
      return data as BookingDetails;
    } catch (error) {
      console.error('[BookingService] Critical error creating booking:', error);
      // Return a fallback booking object to ensure the user gets a confirmation
      return {
        id: 'fallback',
        booking_reference: booking.booking_reference || `UE-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        booking_date: new Date().toISOString(),
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        total_price: booking.total_price,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_guest_booking: true,
        error_details: error instanceof Error ? error.message : 'Unknown error'
      } as any;
    }
  },

  async updateBooking(
    id: string, 
    booking: Partial<Omit<BookingDetails, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<BookingDetails | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ ...booking, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating booking with id ${id}:`, error);
      return null;
    }
  },

  async updateBookingStatus(id: string, status: BookingDetails['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating status for booking ${id}:`, error);
      return false;
    }
  },

  async updatePaymentStatus(id: string, paymentStatus: BookingDetails['payment_status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: paymentStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error updating payment status for booking ${id}:`, error);
      return false;
    }
  },

  async deleteBooking(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting booking with id ${id}:`, error);
      return false;
    }
  },

  calculateTotalRevenue(bookings: BookingDetails[]): number {
    return bookings.reduce((sum, booking) => {
      // Only count confirmed or completed bookings with paid status
      if (
        (booking.status === 'confirmed' || booking.status === 'completed') &&
        booking.payment_status === 'paid'
      ) {
        return sum + Number(booking.total_price);
      }
      return sum;
    }, 0);
  }
};