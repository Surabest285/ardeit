
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileIcon, FileImage, FileVideo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  className?: string;
  description?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  previewUrl?: string;
  onRemove?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  value,
  accept = '.jpg,.jpeg,.png,.mp4,.mov',
  maxSize = 100,
  label = 'Upload File',
  className,
  description,
  isUploading = false,
  uploadProgress = 0,
  previewUrl,
  onRemove,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (file: File) => {
    setError(null);
    
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = accept.split(',').map(type => type.replace('.', '').toLowerCase());
    
    if (fileExtension && !acceptedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Accepted types: ${accept}`);
      return;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    onChange(file);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const handleRemove = () => {
    onChange(null);
    if (onRemove) {
      onRemove();
    }
  };
  
  const isImage = (file: File) => file.type.startsWith('image/');
  const isVideo = (file: File) => file.type.startsWith('video/');
  
  const getFileIcon = () => {
    if (value) {
      if (isImage(value)) return <FileImage className="h-8 w-8 text-blue-500" />;
      if (isVideo(value)) return <FileVideo className="h-8 w-8 text-purple-500" />;
      return <FileIcon className="h-8 w-8 text-gray-500" />;
    }
    return <Upload className="h-8 w-8 text-muted-foreground" />;
  };
  
  const renderPreview = () => {
    if (!value && !previewUrl) return null;
    
    const url = previewUrl || (value ? URL.createObjectURL(value) : '');
    
    if (value && isImage(value) || previewUrl?.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      return (
        <div className="relative w-full h-32 mb-2 rounded-md overflow-hidden">
          <img 
            src={url} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    if (value && isVideo(value) || previewUrl?.match(/\.(mp4|mov|webm|avi)$/i)) {
      return (
        <div className="relative w-full h-32 mb-2 rounded-md overflow-hidden">
          <video 
            src={url} 
            controls 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      {(value || previewUrl) ? (
        <div className="border rounded-md p-4">
          {renderPreview()}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getFileIcon()}
              <div className="text-sm truncate max-w-[200px]">
                {value?.name || previewUrl?.split('/').pop() || 'File'}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isUploading && (
            <div className="mt-2">
              <Progress value={uploadProgress} className="h-1" />
              <p className="text-xs text-muted-foreground mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-md px-6 py-8 flex flex-col items-center justify-center text-center",
            dragActive ? "border-primary bg-muted" : "border-muted-foreground/25",
            error && "border-destructive"
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              {description || `Supports ${accept} (max ${maxSize}MB)`}
            </p>
          </div>
          
          <Input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            id="file-upload"
          />
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              type="button"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select File
            </Button>
          </Label>
          
          {error && (
            <p className="text-xs text-destructive mt-2">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};
