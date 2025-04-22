import { supabase } from '../lib/supabase';
import { Destination } from '../types';

// This service is currently not used in the application but the interface is needed
// Will be implemented when connecting to the backend

// IMPLEMENTATION STATUS: PARTIAL
// This service currently uses mock data but has the right interfaces.
// It's actively used in the UI components but will need to be updated
// to use Supabase queries when connecting to the backend.
export const destinationsService = {
  async getDestinations(): Promise<Destination[]> {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match our Destination interface
      return (data || []).map(dest => ({
        id: dest.id,
        name: dest.name,
        image: dest.image_url,
        description: dest.description,
        latitude: dest.latitude,
        longitude: dest.longitude,
        tourTypes: dest.tour_types || [],
        highlights: dest.highlights || []
      }));
    } catch (error) {
      console.error('Error fetching destinations:', error);
      return [];
    }
  },

  async getDestinationById(id: string): Promise<Destination | null> {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Transform to match our Destination interface
      return {
        id: data.id,
        name: data.name,
        image: data.image_url,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        tourTypes: data.tour_types || [],
        highlights: data.highlights || []
      };
    } catch (error) {
      console.error(`Error fetching destination with id ${id}:`, error);
      return null;
    }
  },

  async createDestination(destination: Omit<Destination, 'id'>): Promise<Destination | null> {
    try {
      // Transform to match database structure
      const destinationData = {
        name: destination.name,
        description: destination.description,
        image_url: destination.image,
        latitude: destination.latitude,
        longitude: destination.longitude,
        tour_types: destination.tourTypes,
        highlights: destination.highlights
      };
      
      const { data, error } = await supabase
        .from('destinations')
        .insert([destinationData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform back to our Destination interface
      return {
        id: data.id,
        name: data.name,
        image: data.image_url,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        tourTypes: data.tour_types || [],
        highlights: data.highlights || []
      };
    } catch (error) {
      console.error('Error creating destination:', error);
      return null;
    }
  },

  async updateDestination(id: string, destination: Partial<Omit<Destination, 'id'>>): Promise<Destination | null> {
    try {
      // Transform to match database structure
      const destinationData: any = {};
      
      if (destination.name) destinationData.name = destination.name;
      if (destination.description) destinationData.description = destination.description;
      if (destination.image) destinationData.image_url = destination.image;
      if (destination.latitude) destinationData.latitude = destination.latitude;
      if (destination.longitude) destinationData.longitude = destination.longitude;
      if (destination.tourTypes) destinationData.tour_types = destination.tourTypes;
      if (destination.highlights) destinationData.highlights = destination.highlights;
      
      const { data, error } = await supabase
        .from('destinations')
        .update(destinationData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Transform back to our Destination interface
      return {
        id: data.id,
        name: data.name,
        image: data.image_url,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        tourTypes: data.tour_types || [],
        highlights: data.highlights || []
      };
    } catch (error) {
      console.error(`Error updating destination with id ${id}:`, error);
      return null;
    }
  },

  async deleteDestination(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('destinations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting destination with id ${id}:`, error);
      return false;
    }
  }
};