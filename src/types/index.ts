export interface Tour {
  id: string;
  title: string;
  duration: string;
  price: number;
  location: string;
  image: string;
  rating: number;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'corporate' | 'motorsport' | 'school' | 'trade';
  date: string;
  location: string;
  image: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  image: string;
  location: string;
}

export interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  latitude: number;
  longitude: number;
  tourTypes: string[];
  highlights: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  content: string;
}

/**
 * Form validation errors type
 * Keys represent field names and values are error messages
 */
export type FormErrors = Record<string, string>;