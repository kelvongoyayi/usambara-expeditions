import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Save, Edit, Trash2, ArrowLeft, Plus, AlertCircle,
  Calendar, Search, Tag, Check, Briefcase, Mountain, 
  Bookmark, Gift, UserPlus, GraduationCap, Users, Award
} from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface EventType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at: string;
}

// Available icon options for event types
const iconOptions = [
  { name: 'Briefcase', value: 'briefcase' },
  { name: 'Mountain', value: 'mountain' },
  { name: 'Graduation Cap', value: 'graduation-cap' },
  { name: 'Gift', value: 'gift' },
  { name: 'Users', value: 'users' },
  { name: 'Award', value: 'award' },
  { name: 'Calendar', value: 'calendar' },
  { name: 'Bookmark', value: 'bookmark' }
];

// Function to render icon based on name
const renderIcon = (iconName: string | undefined, className: string = 'w-5 h-5') => {
  switch (iconName) {
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'mountain':
      return <Mountain className={className} />;
    case 'graduation-cap':
      return <GraduationCap className={className} />;
    case 'gift':
      return <Gift className={className} />;
    case 'users':
      return <Users className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'bookmark':
      return <Bookmark className={className} />;
    default:
      return <Tag className={className} />;
  }
};

const EventTypes: React.FC = () => {
  const navigate = useNavigate();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    slug: ''
  });

  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch event types on component mount
  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    setLoading(true);
    try {
      // Fetch event types from the database
      const { data, error } = await supabase
        .from('event_types')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setEventTypes(data);
      } else {
        // If no data, use default types
        setEventTypes([
          {
            id: 'corporate',
            name: 'Corporate',
            slug: 'corporate',
            description: 'Team building events, conferences, and retreats designed for businesses and organizations',
            icon: 'briefcase',
            created_at: new Date().toISOString()
          },
          {
            id: 'adventure',
            name: 'Adventure',
            slug: 'adventure',
            description: 'Exciting outdoor activities and challenges for thrill seekers',
            icon: 'mountain',
            created_at: new Date().toISOString()
          },
          {
            id: 'education',
            name: 'Educational',
            slug: 'education',
            description: 'Learning experiences, workshops, and educational tours for schools and individuals',
            icon: 'graduation-cap',
            created_at: new Date().toISOString()
          },
          {
            id: 'special',
            name: 'Special Occasion',
            slug: 'special',
            description: 'Weddings, celebrations, and memorable events for special moments',
            icon: 'gift',
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching event types:', error);
      setError('Failed to load event types. Please try again later.');
      
      // Fall back to default mock data
      setEventTypes([
        {
          id: 'corporate',
          name: 'Corporate',
          slug: 'corporate',
          description: 'Team building events, conferences, and retreats designed for businesses and organizations',
          icon: 'briefcase',
          created_at: new Date().toISOString()
        },
        {
          id: 'adventure',
          name: 'Adventure',
          slug: 'adventure',
          description: 'Exciting outdoor activities and challenges for thrill seekers',
          icon: 'mountain',
          created_at: new Date().toISOString()
        },
        {
          id: 'education',
          name: 'Educational',
          slug: 'education',
          description: 'Learning experiences, workshops, and educational tours for schools and individuals',
          icon: 'graduation-cap',
          created_at: new Date().toISOString()
        },
        {
          id: 'special',
          name: 'Special Occasion',
          slug: 'special',
          description: 'Weddings, celebrations, and memorable events for special moments',
          icon: 'gift',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from name
    if (name === 'name' && !editingId) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }));
    }
    
    // Clear validation errors when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      slug: ''
    };
    let isValid = true;
    
    if (!formData.name.trim()) {
      errors.name = 'Event type name is required';
      isValid = false;
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
      isValid = false;
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
      isValid = false;
    }
    
    // Check for duplicate slugs
    const existingType = eventTypes.find(
      c => c.slug === formData.slug && c.id !== editingId
    );
    
    if (existingType) {
      errors.slug = 'This slug is already in use';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const eventTypeData = {
        id: editingId || formData.slug,
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        icon: formData.icon || null
      };
      
      if (editingId) {
        // Update existing type
        const { error } = await supabase
          .from('event_types')
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            icon: formData.icon || null
          })
          .eq('id', editingId);
        
        if (error) throw error;
        
        // Update in our local state
        setEventTypes(prev => prev.map(type => 
          type.id === editingId ? {...eventTypeData, created_at: type.created_at} : type
        ));

        toast.success(`Event type "${formData.name}" updated successfully`);
        setSuccessMessage(`Event type "${formData.name}" updated successfully`);
      } else {
        // Create new type
        const now = new Date().toISOString();
        const newType: EventType = {
          id: formData.slug,
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          icon: formData.icon || null,
          created_at: now
        };
        
        const { error } = await supabase
          .from('event_types')
          .insert([newType]);
          
        if (error) throw error;
        
        // Add to our local state
        setEventTypes(prev => [...prev, newType]);
        toast.success(`New event type "${formData.name}" created successfully`);
        setSuccessMessage(`New event type "${formData.name}" created successfully`);
      }
      
      // Reset form
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error saving event type:', error);
      setError(`Failed to save event type: ${error.message || 'Unknown error'}`);
      toast.error('Failed to save event type');
    }
  };

  const handleEditType = (type: EventType) => {
    setFormData({
      name: type.name,
      slug: type.slug,
      description: type.description || '',
      icon: type.icon || ''
    });
    setEditingId(type.id);
    setShowForm(true);
  };

  const handleDeleteType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from our local state
      setEventTypes(prev => prev.filter(type => type.id !== id));
      setShowDeleteConfirm(null);
      toast.success("Event type deleted successfully");
      setSuccessMessage("Event type deleted successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error deleting event type:', error);
      setError(`Failed to delete event type: ${error.message || 'It may be in use by existing events.'}`);
      toast.error('Failed to delete event type');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: ''
    });
    setEditingId(null);
    setShowForm(false);
    setFormErrors({
      name: '',
      slug: ''
    });
  };

  // Filter event types based on search term
  const filteredEventTypes = eventTypes.filter(type => 
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/events')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
            <p className="text-sm text-gray-500 mt-1">Manage event classification and organization</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          disabled={showForm}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event Type
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Event Type Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {editingId ? `Edit Event Type: ${formData.name}` : 'Add New Event Type'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    formErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent-500 focus:ring-accent-500'
                  }`}
                  placeholder="e.g. Conference"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`pl-10 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.slug ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-accent-500 focus:ring-accent-500'
                    }`}
                    placeholder="e.g. conference"
                  />
                </div>
                {formErrors.slug ? (
                  <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    Used in URLs. Use lowercase letters, numbers, and hyphens only.
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                  placeholder="Brief description of this event type"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="mt-1 grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {iconOptions.map(icon => (
                    <div key={icon.value} className="relative">
                      <input
                        type="radio"
                        id={`icon-${icon.value}`}
                        name="icon"
                        value={icon.value}
                        checked={formData.icon === icon.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`icon-${icon.value}`}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.icon === icon.value
                            ? 'bg-accent-50 border-accent-500 ring-2 ring-accent-500'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          formData.icon === icon.value ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {renderIcon(icon.value)}
                        </div>
                        <span className={`mt-2 text-xs font-medium ${
                          formData.icon === icon.value ? 'text-accent-700' : 'text-gray-900'
                        }`}>
                          {icon.name}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? 'Update Event Type' : 'Save Event Type'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Event Type Search */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <div className="relative flex-grow mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search event types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredEventTypes.length} {filteredEventTypes.length === 1 ? 'type' : 'types'}
            </div>
          </div>
        </div>
      </div>

      {/* Event Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="mt-4 h-16 bg-gray-100 rounded"></div>
            </div>
          ))
        ) : filteredEventTypes.length > 0 ? (
          filteredEventTypes.map((type) => (
            <div 
              key={type.id} 
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all overflow-hidden"
            >
              <div className="p-5 flex justify-between items-start">
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg bg-accent-50 text-accent-600 mr-4 flex-shrink-0`}>
                    {renderIcon(type.icon)}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900">{type.name}</h3>
                    <div className="text-xs text-gray-500 mt-1 mb-2">
                      ID: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{type.id}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {type.description || <span className="text-gray-400 italic">No description provided</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0 relative">
                  <div className="flex space-x-1">
                    {showDeleteConfirm === type.id ? (
                      <div className="flex items-center space-x-2 bg-red-50 p-2 rounded-lg">
                        <span className="text-xs text-red-700">Delete?</span>
                        <button
                          onClick={() => handleDeleteType(type.id)}
                          className="p-1 text-red-600 hover:text-white hover:bg-red-600 rounded"
                          title="Confirm Delete"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditType(type)}
                          className="p-1.5 text-gray-500 hover:text-accent-600 hover:bg-accent-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(type.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    <span>Created: {new Date(type.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : searchTerm ? (
          <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-dark-800 mb-2">No event types found</h3>
            <p className="text-gray-600">
              No event types match your search for "<strong>{searchTerm}</strong>".
            </p>
            <button 
              className="mt-4 text-accent-600 hover:text-accent-700 font-medium"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-dark-800 mb-2">No event types yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first event type to organize your events.
            </p>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Event Type
            </button>
          </div>
        )}
      </div>

      {/* Event Types Table View */}
      {filteredEventTypes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="py-4 px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Event Types Table View</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEventTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {type.icon && (
                          <div className="bg-accent-50 p-1.5 rounded-full mr-3 flex-shrink-0">
                            {renderIcon(type.icon, 'w-4 h-4')}
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">{type.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                        {type.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {type.description || <span className="text-gray-400 italic">No description</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="text-gray-500">
                        {new Date(type.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-3">
                        <button 
                          onClick={() => handleEditType(type)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {showDeleteConfirm === type.id ? (
                          <div className="flex items-center space-x-1 bg-red-50 px-2 py-1 rounded">
                            <button
                              onClick={() => handleDeleteType(type.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Confirm Delete"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setShowDeleteConfirm(type.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8">
        <div className="bg-accent-50 border border-accent-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-accent-800 mb-4">Event Type Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-accent-100 p-2 rounded-full mr-3 flex-shrink-0">
                <Check className="w-4 h-4 text-accent-600" />
              </div>
              <div>
                <h4 className="font-medium text-accent-700 text-sm">Use Broad Categories</h4>
                <p className="text-sm text-accent-600">Create categories that are broad enough to encompass multiple events but specific enough to be meaningful.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-accent-100 p-2 rounded-full mr-3 flex-shrink-0">
                <Check className="w-4 h-4 text-accent-600" />
              </div>
              <div>
                <h4 className="font-medium text-accent-700 text-sm">Consistent Naming</h4>
                <p className="text-sm text-accent-600">Use a consistent naming convention for all your event types to maintain a professional appearance.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-accent-100 p-2 rounded-full mr-3 flex-shrink-0">
                <Check className="w-4 h-4 text-accent-600" />
              </div>
              <div>
                <h4 className="font-medium text-accent-700 text-sm">Descriptive Details</h4>
                <p className="text-sm text-accent-600">Include detailed descriptions that help both your team and potential attendees understand each event type.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-accent-100 p-2 rounded-full mr-3 flex-shrink-0">
                <Check className="w-4 h-4 text-accent-600" />
              </div>
              <div>
                <h4 className="font-medium text-accent-700 text-sm">Meaningful Icons</h4>
                <p className="text-sm text-accent-600">Choose icons that visually represent the nature of the events in each category for easier recognition.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EventTypes;