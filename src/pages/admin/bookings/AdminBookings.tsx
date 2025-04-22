import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { bookingsService, BookingDetails } from '../../../services/bookings.service';
import BookingList from '../../../components/admin/Bookings/BookingList';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';

const AdminBookings: React.FC = () => {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAdmin) return;

      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching bookings as admin...');
        // Direct query to bypass any RLS issues
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            tours(title),
            events(title)
          `)
          .order('booking_date', { ascending: false });
          
        if (error) {
          throw error;
        }
          
        // Transform the data to match our BookingDetails interface
        const transformedData = (data || []).map(booking => ({
          ...booking,
          tourTitle: booking.tours?.title,
          eventTitle: booking.events?.title
        }));
          
        console.log('Fetched bookings:', transformedData.length);
        setBookings(transformedData);
          
        if (transformedData.length === 0) {
          console.log('No bookings found. You may need to run the sample bookings migration.');
          toast.info('No bookings found. Try running the sample bookings migration.');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAdmin]);

  const handleUpdateBookingStatus = async (id: string, status: BookingDetails['status']) => {
    try {
      setLoading(true);
      const success = await bookingsService.updateBookingStatus(id, status);
      
      if (success) {
        // Update the booking in the state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === id ? { ...booking, status } : booking
          )
        );
        toast.success(`Booking status updated to ${status}`);
      } else {
        throw new Error('Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      toast.error('Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (id: string, paymentStatus: BookingDetails['payment_status']) => {
    try {
      setLoading(true);
      const success = await bookingsService.updatePaymentStatus(id, paymentStatus);
      
      if (success) {
        // Update the booking in the state
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === id ? { ...booking, payment_status: paymentStatus } : booking
          )
        );
        toast.success(`Payment status updated to ${paymentStatus}`);
      } else {
        throw new Error('Failed to update payment status');
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
      toast.error('Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string, reference: string) => {
    if (!window.confirm(`Are you sure you want to delete booking ${reference}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const success = await bookingsService.deleteBooking(id);
      
      if (success) {
        // Remove the booking from the state
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
        toast.success('Booking deleted successfully');
      } else {
        throw new Error('Failed to delete booking');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      toast.error('Failed to delete booking');
    } finally {
      setLoading(false);
    }
  };

  const refreshBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Direct query to bypass any RLS issues
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tours(title),
          events(title)
        `)
        .order('booking_date', { ascending: false });
        
      if (error) {
        throw error;
      }
        
      // Transform the data to match our BookingDetails interface
      const transformedData = (data || []).map(booking => ({
        ...booking,
        tourTitle: booking.tours?.title,
        eventTitle: booking.events?.title
      }));
        
      setBookings(transformedData);
      toast.success('Bookings refreshed successfully');
    } catch (err) {
      console.error('Error refreshing bookings:', err);
      setError('Failed to refresh bookings. Please try again later.');
      toast.error('Failed to refresh bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={async () => {
              try {
                setLoading(true);
                // Run the sample bookings migration
                const { error } = await supabase.rpc('exec_sql', { 
                  sql_query: `
                    -- Insert a sample booking if none exist
                    INSERT INTO bookings (
                      id,
                      booking_reference,
                      booking_date,
                      travel_date,
                      customer_name,
                      customer_email,
                      tour_id,
                      total_amount,
                      status,
                      payment_status,
                      adults,
                      children,
                      created_at,
                      updated_at
                    )
                    SELECT 
                      gen_random_uuid(),
                      'UE-SAMPLE',
                      now(),
                      now() + interval '14 days',
                      'Sample Customer',
                      'sample@example.com',
                      (SELECT id FROM tours LIMIT 1),
                      299.99,
                      'pending',
                      'pending',
                      2,
                      0,
                      now(),
                      now()
                    WHERE NOT EXISTS (SELECT 1 FROM bookings LIMIT 1);
                  `
                });
                
                if (error) throw error;
                
                // Refresh bookings
                await refreshBookings();
                toast.success('Sample booking added successfully');
              } catch (err) {
                console.error('Error adding sample booking:', err);
                toast.error('Failed to add sample booking');
              } finally {
                setLoading(false);
              }
            }}
            className="px-4 py-2 bg-accent-500 text-white rounded-md hover:bg-accent-600 transition-colors"
          >
            Add Sample Booking
          </button>
        <button
          onClick={refreshBookings}
          className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors"
        >
          Refresh Bookings
        </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {bookings.length === 0 && !loading && !error && (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-6">
          No bookings found. You may need to run the sample bookings migration or create a booking through the booking page.
        </div>
      )}

      <BookingList 
        bookings={bookings} 
        isLoading={loading}
        onDelete={handleDeleteBooking}
        onUpdateStatus={handleUpdateBookingStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
      />
    </AdminLayout>
  );
};

export default AdminBookings;