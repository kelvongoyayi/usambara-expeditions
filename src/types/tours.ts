export interface FeaturedItem {
  id: string;
  originalId?: string;
  title: string;
  slug?: string;
  duration: string;
  price: number;
  location: string;
  image: string;
  rating: number;
  description: string;
  category: 'all' | 'hiking' | 'cycling' | 'cultural' | 'event' | '4x4' | 'motocamping' | 'school';
  featured?: boolean;
  type: 'tour' | 'event';
  date?: string;
  itinerary?: DayItinerary[];
  included?: string[];
  excluded?: string[];
  difficulty?: 'easy' | 'moderate' | 'challenging';
  groupSize?: { min: number; max: number };
  startLocation?: string;
  endLocation?: string;
  highlights?: string[];
  requirements?: string[];
  gallery?: string[];
  faqs?: FAQ[];
  bestSeason?: string;
  season?: string;
  accommodationType?: string;
  status?: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: ('breakfast' | 'lunch' | 'dinner')[];
  accommodation?: string;
  distance?: string;
  elevation?: string;
  location?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}