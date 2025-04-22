import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { FeaturedItem } from '../types/tours';

interface AdminStats {
  totalTours: number;
  totalEvents: number;
  totalBookings: number;
  totalUsers: number;
  recentBookings: any[];
  popularTours: any[];
}

interface AdminContextType {
  stats: AdminStats | null;
  loading: boolean;
  error: Error | null;
  refreshStats: () => Promise<void>;
  createTour: (tourData: any) => Promise<boolean>;
  updateTour: (id: string, tourData: any) => Promise<boolean>;
  deleteTour: (id: string) => Promise<boolean>;
  createEvent: (eventData: any) => Promise<boolean>;
  updateEvent: (id: string, eventData: any) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      // Use the get_admin_stats RPC function
      const { data, error } = await supabase.rpc('get_admin_stats');
      
      if (error) {
        console.error('Error fetching admin stats:', error);
        throw error;
      }
      
      setStats({
        totalTours: data.total_tours || 0,
        totalEvents: data.total_events || 0,
        totalBookings: data.total_bookings || 0,
        totalUsers: data.total_users || 0,
        recentBookings: data.recent_bookings || [],
        popularTours: data.popular_tours || []
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch admin stats'));
      
      // Set default values to prevent UI errors
      setStats({
        totalTours: 0,
        totalEvents: 0,
        totalBookings: 0,
        totalUsers: 0,
        recentBookings: [],
        popularTours: []
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    setLoading(true);
    await fetchStats();
  };

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  // Modified to avoid using RPC during development
  const logAdminAction = async (
    actionType: string,
    tableName: string,
    recordId: string,
    details?: any
  ) => {
    try {
      // Use the log_admin_action RPC function
      await supabase.rpc('log_admin_action', {
        action_type: actionType,
        table_name: tableName,
        record_id: recordId,
        details: details ? details : null
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
      // Don't throw error, just log it. This prevents errors in the main operation
    }
  };

  const createTour = async (tourData: any): Promise<boolean> => {
    try {
      // Add timestamps
      const now = new Date().toISOString();
      const dataWithTimestamps = {
        ...tourData,
        created_at: now,
        updated_at: now
      };
      
      const { data, error } = await supabase
        .from('tours')
        .insert([dataWithTimestamps])
        .select()
        .single();

      if (error) throw error;

      try {
        await logAdminAction('create', 'tours', data.id, tourData);
      } catch (logError) {
        console.error('Failed to log admin action, but tour was created:', logError);
      }
      
      toast.success('Tour created successfully');
      await refreshStats();
      return true;
    } catch (error) {
      console.error('Error creating tour:', error);
      toast.error('Failed to create tour');
      return false;
    }
  };

  const updateTour = async (id: string, tourData: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tours')
        .update({
          ...tourData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      try {
        await logAdminAction('update', 'tours', id, tourData);
      } catch (logError) {
        console.error('Failed to log admin action, but tour was updated:', logError);
      }
      
      toast.success('Tour updated successfully');
      await refreshStats();
      return true;
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Failed to update tour');
      return false;
    }
  };

  const deleteTour = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', id);

      if (error) throw error;

      try {
        await logAdminAction('delete', 'tours', id);
      } catch (logError) {
        console.error('Failed to log admin action, but tour was deleted:', logError);
      }
      
      toast.success('Tour deleted successfully');
      await refreshStats();
      return true;
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour');
      return false;
    }
  };

  const createEvent = async (eventData: any): Promise<boolean> => {
    try {
      // Add timestamps
      const now = new Date().toISOString();
      const dataWithTimestamps = {
        ...eventData,
        created_at: now,
        updated_at: now
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert([dataWithTimestamps])
        .select()
        .single();

      if (error) throw error;

      try {
        await logAdminAction('create', 'events', data.id, eventData);
      } catch (logError) {
        console.error('Failed to log admin action, but event was created:', logError);
      }
      
      toast.success('Event created successfully');
      await refreshStats();
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      return false;
    }
  };

  const updateEvent = async (id: string, eventData: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      try {
        await logAdminAction('update', 'events', id, eventData);
      } catch (logError) {
        console.error('Failed to log admin action, but event was updated:', logError);
      }
      
      toast.success('Event updated successfully');
      await refreshStats();
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      return false;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      try {
        await logAdminAction('delete', 'events', id);
      } catch (logError) {
        console.error('Failed to log admin action, but event was deleted:', logError);
      }
      
      toast.success('Event deleted successfully');
      await refreshStats();
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  };

  const value = {
    stats,
    loading,
    error,
    refreshStats,
    createTour,
    updateTour,
    deleteTour,
    createEvent,
    updateEvent,
    deleteEvent
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};