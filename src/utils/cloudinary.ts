
import { supabase } from '@/integrations/supabase/client';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dfaltagfv';
const CLOUDINARY_API_KEY = '798521868951768';
const CLOUDINARY_UPLOAD_PRESET = 'ethiopian_edu'; // Keep your existing preset if it's configured
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}`;

/**
 * Upload a file to Cloudinary
 * @param file The file to upload
 * @param folder The folder to upload to (e.g., 'course-images', 'course-videos')
 * @returns The Cloudinary response with URL and other details
 */
export const uploadToCloudinary = async (file: File, folder: string) => {
  try {
    console.log(`Uploading file to Cloudinary folder: ${folder}`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('api_key', CLOUDINARY_API_KEY);
    
    const response = await fetch(`${CLOUDINARY_API_URL}/${file.type.startsWith('image') ? 'image' : 'video'}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload failed:', errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Cloudinary upload successful:', result);
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Define an Attachment type that matches our database schema
export interface Attachment {
  id: string;
  course_id: string;
  title: string;
  file_type: string;
  file_url: string;
  created_at: string;
}

/**
 * Save a course attachment to the database
 * @param courseId The course ID
 * @param title The attachment title
 * @param fileType The file type (e.g., 'image/jpeg', 'video/mp4')
 * @param fileUrl The URL of the uploaded file
 * @returns The created attachment data
 */
export const saveCourseAttachment = async (
  courseId: string,
  title: string,
  fileType: string,
  fileUrl: string
): Promise<Attachment> => {
  try {
    // Using explicit type assertion since the database types aren't in sync
    const { data, error } = await supabase
      .from('course_attachments' as any)
      .insert({
        course_id: courseId,
        title,
        file_type: fileType,
        file_url: fileUrl,
      })
      .select();
      
    if (error) {
      console.error('Error saving course attachment:', error);
      throw error;
    }
    
    // Ensure data has the expected structure before returning
    if (!data || data.length === 0) {
      throw new Error('No data returned from insert operation');
    }
    
    // Use type assertion to match our Attachment interface
    return data[0] as unknown as Attachment;
  } catch (error) {
    console.error('Exception saving course attachment:', error);
    throw error;
  }
};

/**
 * Fetch course attachments for a course
 * @param courseId The course ID
 * @returns Array of course attachments
 */
export const fetchCourseAttachments = async (courseId: string): Promise<Attachment[]> => {
  try {
    const { data, error } = await supabase
      .from('course_attachments' as any)
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching course attachments:', error);
      throw error;
    }
    
    // Type assertion with an explicit check
    if (!data) return [];
    
    // Use type assertion to match our Attachment interface
    return data as unknown as Attachment[];
  } catch (error) {
    console.error('Exception fetching course attachments:', error);
    throw error;
  }
};

/**
 * Delete a course attachment
 * @param attachmentId The attachment ID to delete
 */
export const deleteCourseAttachment = async (attachmentId: string) => {
  try {
    const { error } = await supabase
      .from('course_attachments' as any)
      .delete()
      .eq('id', attachmentId);
      
    if (error) {
      console.error('Error deleting course attachment:', error);
      throw error;
    }
  } catch (error) {
    console.error('Exception deleting course attachment:', error);
    throw error;
  }
};
