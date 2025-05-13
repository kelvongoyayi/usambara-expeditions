import { 
  createBrowserRouter, 
  createRoutesFromElements,
  Route
} from 'react-router-dom';

// Import all the route components
import Home from '../pages/Home';
import BookNow from '../pages/BookNow';
import TourDetail from '../pages/tours/TourDetail';
import TourListing from '../pages/tours/TourListing';
import EventDetail from '../pages/events/EventDetail';
import EventListing from '../pages/events/EventListing';
import SearchResults from '../pages/SearchResults';
import Contact from '../pages/Contact';
import About from '../pages/About';
import Destinations from '../pages/Destinations';
import AccessDenied from '../pages/AccessDenied';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminTours from '../pages/admin/tours/AdminTours';
import CreateTour from '../pages/admin/tours/CreateTour';
import EditTour from '../pages/admin/tours/EditTour';
import Categories from '../pages/admin/tours/Categories';
import AdminEvents from '../pages/admin/events/AdminEvents';
import CreateEvent from '../pages/admin/events/CreateEvent';
import EditEvent from '../pages/admin/events/EditEvent';
import EventTypes from '../pages/admin/events/EventTypes';
import AdminBookings from '../pages/admin/bookings/AdminBookings';
import AdminDestinations from '../pages/admin/destinations/AdminDestinations';
import AdminUsers from '../pages/admin/users/AdminUsers';
import AdminMedia from '../pages/admin/media/AdminMedia';
import AdminBlog from '../pages/admin/blog/AdminBlog';
import AdminBlogCreate from '../pages/admin/blog/create/AdminBlogCreate';
import BlogCategories from '../pages/admin/blog/categories/BlogCategories';
import AdminHelp from '../pages/admin/help/AdminHelp';
import AdminAnalytics from '../pages/admin/analytics/AdminAnalytics';
import AdminSettings from '../pages/admin/settings/AdminSettings';
import AdminMessages from '../pages/admin/messages/AdminMessages';

// Create router without future flags for now
// React Router will eventually be upgraded to v7 which will include these features by default
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Main Website Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/book" element={<BookNow />} />
      
      {/* Tour Routes */}
      <Route path="/tours" element={<TourListing />} />
      <Route path="/tours/:tourType" element={<TourListing />} />
      <Route path="/tour/:tourId" element={<TourDetail />} />
      
      {/* Event Routes */}
      <Route path="/events" element={<EventListing />} />
      <Route path="/events/:eventType" element={<EventListing />} />
      <Route path="/event/:eventId" element={<EventDetail />} />
      
      {/* Destinations Route */}
      <Route path="/destinations" element={<Destinations />} />
      
      {/* Search Results */}
      <Route path="/search" element={<SearchResults />} />
      
      {/* About & Contact */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Auth Routes */}
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Admin Routes - Protected with isAdmin check */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/tours" element={<ProtectedRoute requireAdmin><AdminTours /></ProtectedRoute>} />
      <Route path="/admin/tours/create" element={<ProtectedRoute requireAdmin><CreateTour /></ProtectedRoute>} />
      <Route path="/admin/tours/edit/:tourId" element={<ProtectedRoute requireAdmin><EditTour /></ProtectedRoute>} />
      <Route path="/admin/tours/categories" element={<ProtectedRoute requireAdmin><Categories /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute requireAdmin><AdminEvents /></ProtectedRoute>} />
      <Route path="/admin/events/create" element={<ProtectedRoute requireAdmin><CreateEvent /></ProtectedRoute>} />
      <Route path="/admin/events/edit/:eventId" element={<ProtectedRoute requireAdmin><EditEvent /></ProtectedRoute>} />
      <Route path="/admin/events/types" element={<ProtectedRoute requireAdmin><EventTypes /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/destinations" element={<ProtectedRoute requireAdmin><AdminDestinations /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/media" element={<ProtectedRoute requireAdmin><AdminMedia /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute requireAdmin><AdminBlog /></ProtectedRoute>} />
      <Route path="/admin/blog/create" element={<ProtectedRoute requireAdmin><AdminBlogCreate /></ProtectedRoute>} />
      <Route path="/admin/blog/categories" element={<ProtectedRoute requireAdmin><BlogCategories /></ProtectedRoute>} />
      <Route path="/admin/help" element={<ProtectedRoute requireAdmin><AdminHelp /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute requireAdmin><AdminMessages /></ProtectedRoute>} />
    </>
  )
); 