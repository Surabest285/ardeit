
import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Paperclip, X, FileIcon, FileImage, FileVideo } from 'lucide-react';
import { uploadToCloudinary, saveCourseAttachment, deleteCourseAttachment } from '@/utils/cloudinary';
import { useToast } from '@/components/ui/use-toast';

interface Attachment {
  id: string;
  title: string;
  file_type: string;
  file_url: string;
  created_at: string;
}

interface CourseAttachmentsProps {
  courseId?: string;
  attachments: Attachment[];
  onAttachmentAdded: (attachment: Attachment) => void;
  onAttachmentDeleted: (attachmentId: string) => void;
}

const CourseAttachments: React.FC<CourseAttachmentsProps> = ({
  courseId,
  attachments,
  onAttachmentAdded,
  onAttachmentDeleted
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    if (newFile && !title) {
      // Set default title from filename without extension
      setTitle(newFile.name.split('.').slice(0, -1).join('.'));
    }
  };
  
  const handleUpload = async () => {
    if (!file || !title || !courseId) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Determine the folder based on file type
      const folder = file.type.startsWith('image') 
        ? 'course-images' 
        : file.type.startsWith('video') 
          ? 'course-videos' 
          : 'course-materials';
          
      // Upload to Cloudinary
      setUploadProgress(30);
      const uploadResult = await uploadToCloudinary(file, folder);
      setUploadProgress(70);
      
      // Save attachment in database
      const attachment = await saveCourseAttachment(
        courseId,
        title,
        file.type,
        uploadResult.secure_url
      );
      
      setUploadProgress(100);
      
      // Add to local state
      onAttachmentAdded(attachment);
      
      // Reset form
      setFile(null);
      setTitle('');
      
      toast({
        title: "Success",
        description: "Attachment uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your attachment. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleDelete = async (attachmentId: string) => {
    try {
      await deleteCourseAttachment(attachmentId);
      onAttachmentDeleted(attachmentId);
      
      toast({
        title: "Success",
        description: "Attachment deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting attachment:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting the attachment. Please try again.",
      });
    }
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-5 w-5 text-blue-500" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-5 w-5 text-purple-500" />;
    return <FileIcon className="h-5 w-5 text-gray-500" />;
  };
  
  return (
    <div className="space-y-4">
      {courseId && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <FileUpload
              onChange={handleFileChange}
              value={file}
              accept=".jpg,.jpeg,.png,.gif,.mp4,.pdf,.doc,.docx,.ppt,.pptx"
              label="Upload Attachment"
              description="Upload images, videos, or documents for your course"
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
            
            <Input
              placeholder="Attachment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
            
            <Button
              onClick={handleUpload}
              disabled={!file || !title || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Paperclip className="mr-2 h-4 w-4" />
                  Upload Attachment
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Current Attachments</h3>
          
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div 
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-muted rounded-md"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(attachment.file_type)}
                  <div>
                    <p className="text-sm font-medium">{attachment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(attachment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    asChild
                  >
                    <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(attachment.id)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAttachments;
