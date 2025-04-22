import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Save, Edit, Trash2, ArrowLeft, Plus, AlertCircle,
  ChevronLeft, ChevronRight, Search, Tag, Check, MoreHorizontal,
  Briefcase, Users, Map, Activity, Calendar, Compass, Bike, Loader
} from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at: string;
}

// Available icon options for categories
const iconOptions = [
  { name: 'Mountain', value: 'mountain' },
  { name: 'Bike', value: 'bike' },
  { name: 'Map', value: 'map' },
  { name: 'Activity', value: 'activity' },
  { name: 'Users', value: 'users' },
  { name: 'Compass', value: 'compass' },
  { name: 'Calendar', value: 'calendar' },
  { name: 'Briefcase', value: 'briefcase' }
];

const renderIcon = (iconName: string | undefined, className: string = 'w-5 h-5') => {
  switch (iconName) {
    case 'mountain':
      return <Map className={className} />;
    case 'bike':
      return <Bike className={className} />;
    case 'map':
      return <Map className={className} />;
    case 'activity':
      return <Activity className={className} />;
    case 'users':
      return <Users className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    default:
      return <Tag className={className} />;
  }
};

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tour_categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again later.');
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
      errors.name = 'Category name is required';
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
    const existingCategory = categories.find(
      c => c.slug === formData.slug && c.id !== editingId
    );
    
    if (existingCategory) {
      errors.slug = 'This slug is already in use';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setSubmitting(true);
    
    try {
      if (editingId) {
        // Update existing category
        const { error } = await supabase
          .from('tour_categories')
          .update({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          icon: formData.icon || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);
          
        if (error) throw error;
        
        // Update locally
        setCategories(prev => prev.map(category => 
          category.id === editingId ? {
            ...category,
            name: formData.name,
            slug: formData.slug,
            description: formData.description || null,
            icon: formData.icon || null,
          } : category
        ));

        toast.success(`Category "${formData.name}" updated successfully`);
        setSuccessMessage(`Category "${formData.name}" updated successfully`);
      } else {
        // Create new category
        const { data, error } = await supabase
          .from('tour_categories')
          .insert({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          icon: formData.icon || null,
          created_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Add to local state
        if (data) {
          setCategories(prev => [...prev, data as Category]);
        }
        
        toast.success(`New category "${formData.name}" created successfully`);
        setSuccessMessage(`New category "${formData.name}" created successfully`);
      }
      
      // Reset form
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error managing category:', error);
      toast.error(`Failed to ${editingId ? 'update' : 'create'} category: ${error.message}`);
      setError('Failed to save category. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || ''
    });
    setEditingId(category.id);
    setShowForm(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      // First check if any tours are using this category
      const { data: toursUsingCategory, error: checkError } = await supabase
        .from('tours')
        .select('id')
        .eq('category', id);
        
      if (checkError) throw checkError;
      
      if (toursUsingCategory && toursUsingCategory.length > 0) {
        throw new Error(`This category is used by ${toursUsingCategory.length} tours and cannot be deleted.`);
      }
      
      // Delete from database
      const { error } = await supabase
        .from('tour_categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setCategories(prev => prev.filter(category => category.id !== id));
      setShowDeleteConfirm(null);
      toast.success("Category deleted successfully");
      setSuccessMessage("Category deleted successfully");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
      setError(error.message || 'Failed to delete category. It may be in use by existing tours.');
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

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/tours')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tour Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Manage tour classification and organization</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          disabled={showForm}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
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

      {/* Category Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {editingId ? `Edit Category: ${formData.name}` : 'Add New Category'}
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
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${
                    formErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
                  }`}
                  disabled={submitting}
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
                      formErrors.slug ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500'
                    }`}
                    placeholder="e.g. hiking-tours"
                    disabled={submitting}
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  placeholder="Brief description of the category"
                  disabled={submitting}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="mt-1 grid grid-cols-4 gap-3">
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
                        disabled={submitting}
                      />
                      <label
                        htmlFor={`icon-${icon.value}`}
                        className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.icon === icon.value
                            ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500 shadow-sm'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        } ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <div className={`p-2 rounded-full ${
                          formData.icon === icon.value ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {renderIcon(icon.value)}
                        </div>
                        <span className={`mt-2 text-xs font-medium ${
                          formData.icon === icon.value ? 'text-brand-700' : 'text-gray-900'
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                <Save className="w-4 h-4 mr-2" />
                {editingId ? 'Update Category' : 'Save Category'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Search and Filter */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <div className="relative flex-grow mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards */}
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
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all overflow-hidden"
            >
              <div className="p-5 flex justify-between items-start">
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg bg-brand-50 text-brand-600 mr-4 flex-shrink-0`}>
                    {renderIcon(category.icon)}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900">{category.name}</h3>
                    <div className="text-xs text-gray-500 mt-1 mb-2">
                      Slug: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{category.slug}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description || <span className="text-gray-400 italic">No description provided</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0 relative">
                  <div className="flex space-x-1">
                    {showDeleteConfirm === category.id ? (
                      <div className="flex items-center space-x-2 bg-red-50 p-2 rounded-lg">
                        <span className="text-xs text-red-700">Delete?</span>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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
                          onClick={() => handleEditCategory(category)}
                          className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(category.id)}
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

              <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500 flex justify-between items-center">
                <div className="flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                  <span>ID: <span className="font-mono">{category.id}</span></span>
                </div>
                <div>
                  {new Date(category.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Tag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try different search terms' : 'Start by adding your first tour category'}
            </p>
            {!searchTerm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <Plus className="w-4 h-4 mr-2" />
                Add Category
            </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Categories;