# Tours Service Implementation Plan

This document outlines the specific steps to update the Tours Service to connect to Supabase instead of using mock data.

## Current Status

The `tours.service.ts` file currently:
- Defines appropriate TypeScript interfaces matching our database schema
- Implements methods that return mock data from `src/data/toursData.ts`
- Is used throughout the application, especially in admin components

## Implementation Steps

### 1. Update Service Dependencies

```typescript
// BEFORE
import { toursData, getTourById } from '../data/toursData';

// AFTER
import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import toast from 'react-hot-toast';

// Define the Tour type based on the database schema
type Tour = Database['public']['Tables']['tours']['Row'];
```

### 2. Implement `getTours` Method

```typescript
async getTours(): Promise<Tour[]> {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}
```

### 3. Implement `getTourById` Method

```typescript
async getTourById(id: string): Promise<Tour | null> {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        tour_categories(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Error fetching tour with id ${id}:`, error);
    return null;
  }
}
```

### 4. Implement `getToursByCategory` Method

```typescript
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
}
```

### 5. Implement `createTour` Method

```typescript
async createTour(tour: Omit<Tour, 'id' | 'created_at' | 'updated_at'>): Promise<Tour | null> {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('tours')
      .insert([{
        ...tour,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Tour created successfully');
    return data;
  } catch (error) {
    console.error('Error creating tour:', error);
    toast.error('Failed to create tour');
    return null;
  }
}
```

### 6. Implement `updateTour` Method

```typescript
async updateTour(id: string, tour: Partial<Omit<Tour, 'id' | 'created_at' | 'updated_at'>>): Promise<Tour | null> {
  try {
    const { data, error } = await supabase
      .from('tours')
      .update({
        ...tour,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Tour updated successfully');
    return data;
  } catch (error) {
    console.error(`Error updating tour with id ${id}:`, error);
    toast.error('Failed to update tour');
    return null;
  }
}
```

### 7. Implement `deleteTour` Method

```typescript
async deleteTour(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('tours').delete().eq('id', id);
    
    if (error) throw error;
    
    toast.success('Tour deleted successfully');
    return true;
  } catch (error) {
    console.error(`Error deleting tour with id ${id}:`, error);
    toast.error('Failed to delete tour');
    return false;
  }
}
```

### 8. Implement `getTourCategories` Method

```typescript
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
    // Return default categories if fetching fails
    return [
      { id: 'hiking', name: 'Hiking' },
      { id: 'cycling', name: 'Cycling' },
      { id: 'cultural', name: 'Cultural' },
      { id: '4x4', name: '4x4 Expedition' },
      { id: 'motocamping', name: 'Motocamping' },
      { id: 'school', name: 'School Tours' }
    ];
  }
}
```

### 9. Keep Helper Functions

Keep any helper functions like `toFeaturedItem` that transform database data to the format expected by components:

```typescript
toFeaturedItem(tour: Tour): FeaturedItem {
  // Transform database tour to FeaturedItem format
  // This ensures components still get data in the expected format
  return {
    id: tour.id,
    title: tour.title,
    duration: tour.duration,
    price: tour.price,
    location: tour.location,
    image: tour.image_url,
    // ... and so on
  };
}
```

### 10. Update Component Error Handling

Update components that use this service to properly handle loading states and errors:

```tsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchTours = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const toursData = await toursService.getTours();
      setTours(toursData);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to load tours. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  fetchTours();
}, []);

// In render:
{loading && <LoadingIndicator />}
{error && <ErrorMessage message={error} />}
{!loading && !error && <ToursList tours={tours} />}
```

## Testing

After implementation, test the following:

1. Tour listing - verify all tours load correctly
2. Tour details - verify individual tour data loads correctly
3. Tour creation - verify new tours are saved to the database
4. Tour updates - verify changes are saved correctly
5. Tour deletion - verify tours are properly removed
6. Error handling - verify appropriate error messages when things go wrong

## Rollback Plan

If issues occur:
1. Revert to using mock data
2. Diagnose and fix the issues
3. Try again with proper testing

This implementation approach ensures we maintain application functionality while transitioning to the Supabase backend.