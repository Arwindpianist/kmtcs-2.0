import { supabase } from '@/app/lib/supabase';
import type { Service, ServiceType } from '@/app/types/service';

// Types
export interface Consultant {
  id: string;
  name: string;
  role: string;
  image_url: string;
  short_bio: string;
  full_bio: string;
  academic_qualifications?: string;
  professional_certifications?: string;
  career_experiences?: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone: string;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Service Functions
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }

  return data;
}

export async function getServiceById(id: string): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    throw error;
  }

  return data;
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }

  return data;
}

export async function updateService(id: string, service: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .update(service)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }

  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

// Consultant Functions
export async function fetchConsultants(): Promise<Consultant[]> {
  try {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching consultants:', error);
      throw new Error('Failed to fetch consultants');
    }

    return (data || []) as Consultant[];
  } catch (error) {
    console.error('Error in fetchConsultants:', error);
    throw new Error('Failed to fetch consultants');
  }
}

export async function fetchConsultantById(id: string): Promise<Consultant | null> {
  const { data, error } = await supabase
    .from('consultants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching consultant:', error);
    throw error;
  }

  return data;
}

export async function createConsultant(consultant: Omit<Consultant, 'id' | 'created_at' | 'updated_at'>): Promise<Consultant> {
  const { data, error } = await supabase
    .from('consultants')
    .insert([consultant])
    .select()
    .single();

  if (error) {
    console.error('Error creating consultant:', error);
    throw error;
  }

  return data;
}

export async function updateConsultant(id: string, consultant: Partial<Consultant>): Promise<Consultant> {
  const { data, error } = await supabase
    .from('consultants')
    .update(consultant)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating consultant:', error);
    throw error;
  }

  return data;
}

export async function deleteConsultant(id: string): Promise<void> {
  const { error } = await supabase
    .from('consultants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting consultant:', error);
    throw error;
  }
}

// Enquiry Functions
export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'updated_at'>): Promise<Enquiry> {
  const response = await fetch('/api/contact-submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enquiry),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create enquiry');
  }

  const result = await response.json();
  return result.data;
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enquiries:', error);
    throw error;
  }

  return data || [];
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status']): Promise<Enquiry> {
  const { data, error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating enquiry status:', error);
    throw error;
  }

  return data;
}

// Service-Consultant Relationship Functions
export async function assignConsultantToService(serviceId: string, consultantId: string): Promise<void> {
  const { error } = await supabase
    .from('service_consultants')
    .insert([{ service_id: serviceId, consultant_id: consultantId }]);

  if (error) {
    console.error('Error assigning consultant to service:', error);
    throw error;
  }
}

export async function removeConsultantFromService(serviceId: string, consultantId: string): Promise<void> {
  const { error } = await supabase
    .from('service_consultants')
    .delete()
    .eq('service_id', serviceId)
    .eq('consultant_id', consultantId);

  if (error) {
    console.error('Error removing consultant from service:', error);
    throw error;
  }
}

interface ServiceConsultantResponse {
  consultant: {
    id: string;
    name: string;
    role: string;
    image_url: string;
    short_bio: string;
    full_bio: string;
    email: string;
    phone: string;
    status: boolean;
    created_at: string;
    updated_at: string;
  };
}

export async function fetchServiceConsultants(serviceId: string): Promise<Consultant[]> {
  try {
    const { data, error } = await supabase
      .from('service_consultants')
      .select(`
        consultant:consultants (
          id,
          name,
          role,
          image_url,
          short_bio,
          full_bio,
          email,
          phone,
          status,
          created_at,
          updated_at
        )
      `)
      .eq('service_id', serviceId);

    if (error) {
      console.error('Error fetching service consultants:', error);
      throw new Error('Failed to fetch service consultants');
    }

    // First cast to unknown, then to our expected type
    const typedData = (data as unknown) as ServiceConsultantResponse[];
    
    // Extract the consultant objects from the nested structure and ensure type safety
    const consultants = (typedData || []).map(item => ({
      id: item.consultant.id,
      name: item.consultant.name,
      role: item.consultant.role,
      image_url: item.consultant.image_url,
      short_bio: item.consultant.short_bio,
      full_bio: item.consultant.full_bio,
      email: item.consultant.email,
      phone: item.consultant.phone,
      status: item.consultant.status,
      created_at: item.consultant.created_at,
      updated_at: item.consultant.updated_at
    }));

    return consultants;
  } catch (error) {
    console.error('Error in fetchServiceConsultants:', error);
    throw new Error('Failed to fetch service consultants');
  }
}

// Storage bucket functions
const CONSULTANT_IMAGES_BUCKET = 'consultant_images';

export async function uploadConsultantImage(file: File): Promise<string> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `consultant_images/${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(CONSULTANT_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw new Error('Failed to upload image');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(CONSULTANT_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadConsultantImage:', error);
    throw new Error('Failed to upload consultant image');
  }
}

export async function deleteConsultantImage(imageUrl: string): Promise<void> {
  try {
    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(urlParts.indexOf(CONSULTANT_IMAGES_BUCKET) + 1).join('/');

    // Delete the file
    const { error: deleteError } = await supabase.storage
      .from(CONSULTANT_IMAGES_BUCKET)
      .remove([filePath]);

    if (deleteError) {
      console.error('Error deleting image:', deleteError);
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error in deleteConsultantImage:', error);
    throw new Error('Failed to delete consultant image');
  }
} 