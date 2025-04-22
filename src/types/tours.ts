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
}

export interface FAQ {
  question: string;
  answer: string;
}