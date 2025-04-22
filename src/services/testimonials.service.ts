import { supabase } from '../lib/supabase';
import { Testimonial } from '../types';

// This service is currently not used in the application but the interface is needed
// Will be implemented when connecting to the backend

// IMPLEMENTATION STATUS: PLACEHOLDER
// This service contains the interface but is not currently used in the application.
// Will be implemented when connecting to the backend.
export const testimonialsService = {
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our Testimonial interface
      return (data || []).map(test => ({
        id: test.id,
        name: test.name,
        rating: test.rating,
        comment: test.comment,
        image: test.image_url || 'https://via.placeholder.com/150',
        location: test.location
      }));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },

  async createTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial | null> {
    try {
      // Transform to match database structure
      const testimonialData = {
        name: testimonial.name,
        rating: testimonial.rating,
        comment: testimonial.comment,
        image_url: testimonial.image,
        location: testimonial.location,
        is_approved: false // New testimonials need approval
      };
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonialData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform back to our Testimonial interface
      return {
        id: data.id,
        name: data.name,
        rating: data.rating,
        comment: data.comment,
        image: data.image_url || 'https://via.placeholder.com/150',
        location: data.location
      };
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return null;
    }
  },

  async approveTestimonial(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: true })
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error approving testimonial with id ${id}:`, error);
      return false;
    }
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting testimonial with id ${id}:`, error);
      return false;
    }
  }
};