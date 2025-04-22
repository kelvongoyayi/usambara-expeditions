import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search, Filter, ArrowUp, ArrowDown, Calendar, DollarSign, User, Check, X, Trash, CheckCircle2, XCircle, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { BookingDetails } from '../../../services/bookings.service';

interface BookingListProps {
  bookings: BookingDetails[];
  isLoading: boolean;
  onDelete: (id: string, title: string) => void;
  onUpdateStatus: (id: string, status: BookingDetails['status']) => void;
  onUpdatePaymentStatus: (id: string, status: BookingDetails['payment_status']) => void;
}

const BookingList: React.FC<BookingListProps> = ({ 
  bookings, 
  isLoading, 
  onDelete,
  onUpdateStatus,
  onUpdatePaymentStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof BookingDetails>('booking_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);
  const [paymentMenuOpen, setPaymentMenuOpen] = useState<string | null>(null);

  // Get unique statuses from bookings
  const statuses = ['all', ...new Set(bookings.map(booking => booking.status))];

  // Handle sort
  const handleSort = (field: keyof BookingDetails) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => 
      (filterStatus === 'all' || booking.status === filterStatus) &&
      (booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
       (booking.tourTitle && booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (booking.eventTitle && booking.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
       booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === bValue) return 0;
      
      if (sortDirection === 'asc') {
        // Handle undefined values by treating them as empty strings
        return (aValue ?? '') < (bValue ?? '') ? -1 : 1;
      } else {
        return (aValue ?? '') > (bValue ?? '') ? -1 : 1;
      }
    });

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status badge style
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: keyof BookingDetails) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 ml-1" /> : 
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <Check className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <h3 className="text-lg font-medium text-gray-900">Bookings Management</h3>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 min-w-0">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by booking reference, customer name, or tour/event name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-row space-x-4">
            <div className="w-full md:w-auto">
              <label htmlFor="status-filter" className="sr-only">
                Filter by Status
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="status-filter"
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' 
                        ? 'All Statuses' 
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredBookings.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('booking_reference')}
                >
                  <div className="flex items-center">
                    Reference
                    {renderSortIndicator('booking_reference')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('booking_date')}
                >
                  <div className="flex items-center">
                    Date
                    {renderSortIndicator('booking_date')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    Item Details
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('customer_name')}
                >
                  <div className="flex items-center">
                    Customer
                    {renderSortIndicator('customer_name')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('total_price')}
                >
                  <div className="flex items-center">
                    Amount
                    {renderSortIndicator('total_price')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {renderSortIndicator('status')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.booking_reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1 text-brand-500" />
                      <span>{formatDate(booking.booking_date)}</span>
                    </div>
                    {booking.travel_date && (
                      <div className="text-xs text-gray-400 mt-1">
                        Travel: {formatDate(booking.travel_date)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.tourTitle && (
                      <div className="flex items-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-100 text-brand-800 mr-2">
                          Tour
                        </span>
                        <span className="text-sm text-gray-900">{booking.tourTitle}</span>
                      </div>
                    )}
                    {booking.eventTitle && (
                      <div className="flex items-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent-100 text-accent-800 mr-2">
                          Event
                        </span>
                        <span className="text-sm text-gray-900">{booking.eventTitle}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{booking.customer_name}</span>
                      {booking.is_guest_booking && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Guest
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {booking.customer_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                      <span>${Number(booking.total_price).toFixed(2)}</span>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setPaymentMenuOpen(paymentMenuOpen === booking.id ? null : booking.id);
                          setStatusMenuOpen(null);
                        }}
                        className={`text-xs mt-1 inline-flex items-center rounded-full px-2 py-0.5 ${getPaymentStatusBadge(booking.payment_status)}`}
                      >
                        {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </button>
                      
                      {/* Payment Status Dropdown */}
                      {paymentMenuOpen === booking.id && (
                        <div className="absolute left-0 mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            {['pending', 'paid', 'refunded', 'failed'].map(status => (
                              <button
                                key={status}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  status === booking.payment_status ? 'bg-gray-100 font-medium' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                  onUpdatePaymentStatus(booking.id, status as BookingDetails['payment_status']);
                                  setPaymentMenuOpen(null);
                                }}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setStatusMenuOpen(statusMenuOpen === booking.id ? null : booking.id);
                          setPaymentMenuOpen(null);
                        }}
                        className={`inline-flex items-center text-xs leading-5 font-semibold rounded-full px-2 py-0.5 ${getStatusBadge(booking.status)}`}
                      >
                        <span className="mr-1">{getStatusIcon(booking.status)}</span>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </button>
                      
                      {/* Status Dropdown */}
                      {statusMenuOpen === booking.id && (
                        <div className="absolute left-0 mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            {['pending', 'confirmed', 'cancelled', 'completed'].map(status => (
                              <button
                                key={status}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  status === booking.status ? 'bg-gray-100 font-medium' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                  onUpdateStatus(booking.id, status as BookingDetails['status']);
                                  setStatusMenuOpen(null);
                                }}
                              >
                                <span className="inline-block mr-2 align-text-bottom">{getStatusIcon(status)}</span>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <Link 
                        to={`/admin/bookings/${booking.id}`} 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      {deleteConfirm === booking.id ? (
                        <div className="flex items-center space-x-1 bg-red-50 p-1 rounded">
                          <button
                            onClick={() => onDelete(booking.id, booking.booking_reference)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Confirm Delete"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(booking.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No bookings found matching your search criteria.</p>
          </div>
        )}
      </div>
      
      {/* Pagination could be added here if needed */}
    </div>
  );
};

export default BookingList;