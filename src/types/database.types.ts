export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      destinations: {
        Row: {
          id: string
          name: string
          description: string
          location: string
          latitude: number | null
          longitude: number | null
          image_url: string | null
          highlights: string[] | null
          best_time: string | null
          climate: string | null
          tour_types: string[] | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          location: string
          latitude?: number | null
          longitude?: number | null
          image_url?: string | null
          highlights?: string[] | null
          best_time?: string | null
          climate?: string | null
          tour_types?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          location?: string
          latitude?: number | null
          longitude?: number | null
          image_url?: string | null
          highlights?: string[] | null
          best_time?: string | null
          climate?: string | null
          tour_types?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      tours: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          price: number
          duration: number
          category: string
          location: string
          destination_id: string | null
          image_url: string | null
          difficulty: string | null
          max_participants: number
          min_participants: number
          highlights: string[] | null
          included: string[] | null
          excluded: string[] | null
          requirements: string[] | null
          featured: boolean
          rating: number
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          price: number
          duration: number
          category: string
          location: string
          destination_id?: string | null
          image_url?: string | null
          difficulty?: string | null
          max_participants?: number
          min_participants?: number
          highlights?: string[] | null
          included?: string[] | null
          excluded?: string[] | null
          requirements?: string[] | null
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          price?: number
          duration?: number
          category?: string
          location?: string
          destination_id?: string | null
          image_url?: string | null
          difficulty?: string | null
          max_participants?: number
          min_participants?: number
          highlights?: string[] | null
          included?: string[] | null
          excluded?: string[] | null
          requirements?: string[] | null
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      tour_itinerary: {
        Row: {
          id: string
          tour_id: string
          day_number: number
          title: string
          description: string
          activities: string[] | null
          meals: string[] | null
          accommodation: string | null
          distance: string | null
          elevation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tour_id: string
          day_number: number
          title: string
          description: string
          activities?: string[] | null
          meals?: string[] | null
          accommodation?: string | null
          distance?: string | null
          elevation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tour_id?: string
          day_number?: number
          title?: string
          description?: string
          activities?: string[] | null
          meals?: string[] | null
          accommodation?: string | null
          distance?: string | null
          elevation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          price: number
          event_type: string
          location: string
          destination_id: string | null
          image_url: string | null
          start_date: string
          end_date: string
          duration: number
          max_participants: number
          min_participants: number
          highlights: string[] | null
          included: string[] | null
          featured: boolean
          rating: number
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          price: number
          event_type: string
          location: string
          destination_id?: string | null
          image_url?: string | null
          start_date: string
          end_date: string
          duration: number
          max_participants?: number
          min_participants?: number
          highlights?: string[] | null
          included?: string[] | null
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          price?: number
          event_type?: string
          location?: string
          destination_id?: string | null
          image_url?: string | null
          start_date?: string
          end_date?: string
          duration?: number
          max_participants?: number
          min_participants?: number
          highlights?: string[] | null
          included?: string[] | null
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      event_schedule: {
        Row: {
          id: string
          event_id: string
          day_number: number
          title: string
          description: string
          activities: string[] | null
          meals: string[] | null
          accommodation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          day_number: number
          title: string
          description: string
          activities?: string[] | null
          meals?: string[] | null
          accommodation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          day_number?: number
          title?: string
          description?: string
          activities?: string[] | null
          meals?: string[] | null
          accommodation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          booking_reference: string
          user_id: string
          tour_id: string | null
          event_id: string | null
          booking_date: string
          travel_date: string
          adults: number
          children: number
          total_price: number
          status: string
          payment_status: string
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_reference: string
          user_id: string
          tour_id?: string | null
          event_id?: string | null
          booking_date?: string
          travel_date: string
          adults: number
          children?: number
          total_price: number
          status?: string
          payment_status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_reference?: string
          user_id?: string
          tour_id?: string | null
          event_id?: string | null
          booking_date?: string
          travel_date?: string
          adults?: number
          children?: number
          total_price?: number
          status?: string
          payment_status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          user_id: string | null
          name: string
          location: string
          rating: number
          comment: string
          tour_id: string | null
          event_id: string | null
          image_url: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          location: string
          rating: number
          comment: string
          tour_id?: string | null
          event_id?: string | null
          image_url?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          location?: string
          rating?: number
          comment?: string
          tour_id?: string | null
          event_id?: string | null
          image_url?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      gallery_images: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          tour_id: string | null
          event_id: string | null
          destination_id: string | null
          alt_text: string | null
          is_featured: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          tour_id?: string | null
          event_id?: string | null
          destination_id?: string | null
          alt_text?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          tour_id?: string | null
          event_id?: string | null
          destination_id?: string | null
          alt_text?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          tour_id: string | null
          event_id: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          question: string
          answer: string
          tour_id?: string | null
          event_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          tour_id?: string | null
          event_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type DbTables = Database['public']['Tables']