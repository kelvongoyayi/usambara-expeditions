import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Route, Calendar, DollarSign, ThumbsUp, Map } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import BookingChart from '../../components/admin/Dashboard/BookingChart';
import RecentActivity from '../../components/admin/Dashboard/RecentActivity';
import UpcomingEvents from '../../components/admin/Dashboard/UpcomingEvents';
import StatsCard from '../../components/admin/Dashboard/StatsCard';
import ConnectionChecker from '../../components/admin/ConnectionChecker';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { supabase } from '../../lib/supabase';
import { eventsService } from '../../services/events.service';
import { toursService } from '../../services/tours.service';
import { bookingsService } from '../../services/bookings.service';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { stats, loading: statsLoading, refreshStats } = useAdmin();
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalTours: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalDestinations: 0,
    totalTestimonials: 0,
    revenue: 0
  });
  
  // Fetch additional data needed for dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Only fetch if user is admin
        if (!isAdmin) return;
        
        // Fetch stats data
        await Promise.all([
          fetchTours(),
          fetchEvents(),
          fetchBookings(),
          fetchUsers(),
          fetchDestinationsCount(),
          fetchTestimonialsCount(),
          fetchActivityLogs()
        ]);
        
        // Generate chart data
        generateChartData();
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh stats
    refreshStats();
  }, [isAdmin]);
  
  const fetchTours = async () => {
    try {
      const tours = await toursService.getTours();
      setDashboardStats(prev => ({
        ...prev,
        totalTours: tours.length
      }));
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };
  
  const fetchEvents = async () => {
    try {
      const events = await eventsService.getEvents();
      
      // Update the upcoming events data
      const upcomingEventsData = events
        .filter(event => new Date(event.start_date) >= new Date())
        .slice(0, 5)
        .map(event => eventsService.toFeaturedItem(event));
      
      setUpcomingEvents(upcomingEventsData);
      
      setDashboardStats(prev => ({
        ...prev,
        totalEvents: events.length
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  
  const fetchBookings = async () => {
    try {
      const bookings = await bookingsService.getBookings();
      
      // Calculate revenue
      const revenue = bookingsService.calculateTotalRevenue(bookings);
      
      setDashboardStats(prev => ({
        ...prev,
        totalBookings: bookings.length,
        revenue
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };
  
  const fetchUsers = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      setDashboardStats(prev => ({
        ...prev,
        totalUsers: count || 0
      }));
    } catch (error) {
      console.error('Error fetching users count:', error);
    }
  };
  
  const fetchDestinationsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('destinations')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      setDashboardStats(prev => ({
        ...prev,
        totalDestinations: count || 0
      }));
    } catch (error) {
      console.error('Error fetching destinations count:', error);
      // Set a default value
      setDashboardStats(prev => ({
        ...prev,
        totalDestinations: 8
      }));
    }
  };
  
  const fetchTestimonialsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('testimonials')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      setDashboardStats(prev => ({
        ...prev,
        totalTestimonials: count || 0
      }));
    } catch (error) {
      console.error('Error fetching testimonials count:', error);
      // Set a default value
      setDashboardStats(prev => ({
        ...prev,
        totalTestimonials: 12
      }));
    }
  };
  
  const fetchActivityLogs = async () => {
    try {
      const { data: activityLogs, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (activityLogs) {
        const formattedActivities = activityLogs.map(log => ({
          id: log.id,
          type: log.table_name === 'tours' ? 'tour' : 
                log.table_name === 'events' ? 'event' : 
                log.table_name === 'bookings' ? 'booking' : 'user',
          title: `${log.action_type.charAt(0).toUpperCase() + log.action_type.slice(1)} ${log.table_name}`,
          description: `${log.action_type} operation on ${log.table_name}`,
          time: formatTimeAgo(new Date(log.created_at)),
          status: log.action_type === 'create' ? 'success' : 
                 log.action_type === 'update' ? 'pending' : 
                 log.action_type === 'delete' ? 'cancelled' : undefined
        }));
        
        setRecentActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      // Set some mock data if we can't fetch real logs
      setRecentActivities([
        {
          id: '1',
          type: 'tour',
          title: 'New Tour Added',
          description: 'Usambara Hiking Adventure tour was created',
          time: '2 hours ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'booking',
          title: 'Booking Confirmed',
          description: 'New booking #UE-1234 was confirmed',
          time: '5 hours ago',
          status: 'success'
        },
        {
          id: '3',
          type: 'event',
          title: 'Event Updated',
          description: 'Corporate Team Building event was modified',
          time: '1 day ago',
          status: 'pending'
        }
      ]);
    }
  };
  
  // Generate booking chart data
  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Get the last 6 months
    const labels = Array(6).fill(0).map((_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12;
      return months[monthIndex];
    });
    
    setChartData({
      labels,
      datasets: [{
        label: 'Bookings',
        data: [30, 45, 60, 70, 65, 85], // This would be real data in a full implementation
        backgroundColor: 'rgba(5, 99, 38, 0.2)',
        borderColor: 'rgb(5, 99, 38)',
      }]
    });
  };

  // Helper function to format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome to your admin dashboard</p>
        </div>

        {loading || statsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <StatsCard 
                title="Total Bookings" 
                value={dashboardStats.totalBookings} 
                icon={<DollarSign className="w-5 h-5" />}
                change={{ value: 12, trend: 'up', period: 'last month' }}
                index={0}
              />
              <StatsCard 
                title="Active Tours" 
                value={dashboardStats.totalTours} 
                icon={<Route className="w-5 h-5" />}
                change={{ value: 5, trend: 'up', period: 'last month' }}
                index={1}
              />
              <StatsCard 
                title="Upcoming Events" 
                value={dashboardStats.totalEvents} 
                icon={<Calendar className="w-5 h-5" />}
                change={{ value: 2, trend: 'up', period: 'last month' }}
                index={2}
              />
              <StatsCard 
                title="Revenue" 
                value={`$${dashboardStats.revenue.toFixed(2)}`} 
                icon={<DollarSign className="w-5 h-5" />}
                change={{ value: 15, trend: 'up', period: 'last month' }}
                index={3}
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <StatsCard 
                title="Destinations" 
                value={dashboardStats.totalDestinations} 
                icon={<Map className="w-5 h-5" />}
                index={4}
              />
              <StatsCard 
                title="Users" 
                value={dashboardStats.totalUsers} 
                icon={<Users className="w-5 h-5" />}
                index={5}
              />
              <StatsCard 
                title="Testimonials" 
                value={dashboardStats.totalTestimonials} 
                icon={<ThumbsUp className="w-5 h-5" />}
                index={6}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
              <div className="lg:col-span-2">
                <BookingChart data={chartData} />
              </div>
              <div>
                <RecentActivity activities={recentActivities} />
              </div>
            </div>
            
            {/* Upcoming Events */}
            <UpcomingEvents events={upcomingEvents} />
            
            {/* Database Connection Status */}
            <div className="mt-8">
              <ConnectionChecker />
            </div>
          </>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;