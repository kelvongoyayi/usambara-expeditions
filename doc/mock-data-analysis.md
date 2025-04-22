# Mock Data Analysis

## Current Mock Data Usage

Our application currently uses mock data files in `src/data` to provide data for the UI. These files will eventually be replaced by real database queries through our service layer.

### Mock Data Files Analysis

| File | Used By | Replacement Path |
|------|---------|-----------------|
| `src/data/toursData.ts` | `tours.service.ts` | Supabase `tours` table queries |
| `src/data/eventsData.ts` | `events.service.ts` | Supabase `events` table queries |
| `src/data/destinationsData.ts` | `destinations.service.ts` | Supabase `destinations` table queries |
| `src/data/testimonials.ts` | Not directly used | Supabase `testimonials` table queries |

## Data Structure Mapping

### Tours Data

Current mock data structure:
```typescript
export interface FeaturedItem {
  id: string;
  title: string;
  duration: string;
  price: number;
  location: string;
  image: string;
  rating: number;
  description: string;
  category: 'all' | 'hiking' | 'cycling' | 'cultural' | 'event';
  // ...more fields
}
```

Maps to Supabase schema:
```sql
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  // ...more fields
);
```

### Events Data

Current mock data structure:
```typescript
export interface Event {
  id: string;
  title: string;
  type: 'corporate' | 'adventure' | 'education' | 'special';
  date: string;
  location: string;
  image: string;
  description: string;
  // ...more fields
}
```

Maps to Supabase schema:
```sql
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  event_type TEXT NOT NULL,
  location TEXT NOT NULL,
  // ...more fields
);
```

## Migration Strategy

For each mock data source:

1. Identify all properties in the mock data
2. Ensure the Supabase table has matching columns
3. Update the service to fetch from Supabase instead of importing mock data
4. Keep the same return types/interfaces to avoid breaking components
5. Implement proper error handling and loading states

## Example Migration (Tours Service)

Current implementation:
```typescript
import { toursData, getTourById } from '../data/toursData';

export const toursService = {
  async getTours(): Promise<Tour[]> {
    // Mock implementation
    return toursData;
  },
  
  async getTourById(id: string): Promise<Tour | null> {
    // Mock implementation
    return getTourById(id);
  },
  
  // ...other methods
}
```

Future implementation:
```typescript
import { supabase } from '../lib/supabase';

export const toursService = {
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
  },
  
  async getTourById(id: string): Promise<Tour | null> {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching tour with id ${id}:`, error);
      return null;
    }
  },
  
  // ...other methods
}
```

## Conclusion

The mock data files are essential for the current application functioning but will be phased out as we implement real backend connectivity. The service layer is designed to make this transition as smooth as possible by maintaining the same interfaces while changing the implementation details.