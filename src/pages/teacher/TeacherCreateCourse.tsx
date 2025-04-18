import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, X, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileUpload } from '@/components/ui/file-upload';
import { uploadToCloudinary, fetchCourseAttachments, Attachment } from '@/utils/cloudinary';
import CourseAttachments from '@/components/course/CourseAttachments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters."
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters."
  }),
  image: z.string().optional(),
  duration: z.string().min(1, {
    message: "Duration is required."
  }),
  level: z.string().min(1, {
    message: "Level is required."
  }),
  lessons: z.coerce.number().min(1, {
    message: "Course must have at least 1 lesson."
  }),
  is_live: z.boolean().default(false),
  category_id: z.string().optional(),
});

interface Chapter {
  title: string;
  position: number;
  lessons: Lesson[];
}

interface Lesson {
  title: string;
  description: string;
  video_url: string;
  notes: string;
  position: number;
  is_free: boolean;
}

interface Category {
  id: string;
  name: string;
}

const TeacherCreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('course_categories')
          .select('id, name')
          .order('name');
          
        if (error) {
          console.error('Error fetching categories:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load categories. Please refresh the page.",
          });
        } else {
          setCategories(data || []);
        }
      } catch (error) {
        console.error('Exception fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, [toast]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      duration: "",
      level: "",
      lessons: 1,
      is_live: false,
      category_id: "",
    },
  });

  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        title: `Chapter ${chapters.length + 1}`,
        position: chapters.length,
        lessons: [],
      }
    ]);
  };

  const updateChapter = (index: number, title: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[index].title = title;
    setChapters(updatedChapters);
  };

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const addLesson = (chapterIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons.push({
      title: `Lesson ${updatedChapters[chapterIndex].lessons.length + 1}`,
      description: '',
      video_url: '',
      notes: '',
      position: updatedChapters[chapterIndex].lessons.length,
      is_free: false,
    });
    setChapters(updatedChapters);
  };

  const updateLesson = (
    chapterIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string | boolean
  ) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons[lessonIndex][field] = value as never;
    setChapters(updatedChapters);
  };

  const removeLesson = (chapterIndex: number, lessonIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons = updatedChapters[chapterIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setChapters(updatedChapters);
  };
  
  const handleCoverImageUpload = async () => {
    if (!coverImageFile) return null;
    
    setUploadingCoverImage(true);
    try {
      const result = await uploadToCloudinary(coverImageFile, 'course-covers');
      setUploadingCoverImage(false);
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Cover image upload failed. Please try again.",
      });
      setUploadingCoverImage(false);
      return null;
    }
  };
  
  const handleThumbnailUpload = async () => {
    if (!thumbnailFile) return form.getValues('image');
    
    setUploadingThumbnail(true);
    try {
      const result = await uploadToCloudinary(thumbnailFile, 'course-thumbnails');
      setUploadingThumbnail(false);
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Thumbnail upload failed. Please try again.",
      });
      setUploadingThumbnail(false);
      return form.getValues('image');
    }
  };
  
  const fetchAttachments = async (id: string) => {
    try {
      const data = await fetchCourseAttachments(id);
      setAttachments(data);
    } catch (error) {
      console.error('Exception fetching attachments:', error);
    }
  };
  
  const handleAttachmentAdded = (attachment: Attachment) => {
    setAttachments(prev => [attachment, ...prev]);
  };
  
  const handleAttachmentDeleted = (attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      let coverImageUrl = null;
      let thumbnailImageUrl = null;
      
      if (coverImageFile) {
        coverImageUrl = await handleCoverImageUpload();
      }
      
      if (thumbnailFile) {
        thumbnailImageUrl = await handleThumbnailUpload();
      }
      
      const courseData = {
        teacher_id: user.id,
        title: values.title,
        description: values.description,
        image: thumbnailImageUrl || values.image || "https://source.unsplash.com/random/800x600/?education",
        cover_image: coverImageUrl,
        duration: values.duration,
        level: values.level,
        lessons: values.lessons,
        rating: 0.0,
        category_id: values.category_id || null,
      };
      
      let courseResult;
      if (courseId) {
        const { data, error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', courseId)
          .select();
          
        if (error) throw error;
        courseResult = data[0];
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert(courseData)
          .select();
          
        if (error) throw error;
        courseResult = data[0];
        setCourseId(courseResult.id);
      }
      
      const newCourseId = courseResult.id;
      
      for (const chapter of chapters) {
        const { data: sectionData, error: sectionError } = await supabase
          .from('course_sections')
          .insert({
            course_id: newCourseId,
            title: chapter.title,
            position: chapter.position,
          })
          .select();
          
        if (sectionError) {
          throw sectionError;
        }
        
        const sectionId = sectionData[0].id;
        
        for (const lesson of chapter.lessons) {
          const { error: lessonError } = await supabase
            .from('course_lessons')
            .insert({
              section_id: sectionId,
              title: lesson.title,
              description: lesson.description,
              video_url: lesson.video_url,
              position: lesson.position,
              is_free: lesson.is_free,
            });
            
          if (lessonError) {
            throw lessonError;
          }
        }
      }
      
      toast({
        title: "Success",
        description: courseId ? "Course updated successfully!" : "Course created successfully!",
      });
      
      if (!courseId) {
        setCourseId(newCourseId);
        setActiveTab("attachments");
      } else {
        navigate('/teacher/courses');
      }
    } catch (error: any) {
      console.error('Exception in course creation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">
              {courseId ? "Edit Course" : "Create New Course"}
            </h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="attachments" disabled={!courseId}>
                  Attachments & Materials
                </TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <TabsContent value="basic" className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-ethiopia-earth font-medium">Course Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Introduction to Ethiopian Music" {...field} />
                              </FormControl>
                              <FormDescription>
                                A descriptive title for your course.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-ethiopia-earth font-medium">Course Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide a detailed description of the course content, objectives, and what students will learn."
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Explain what students will learn in this course.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <FormLabel className="text-ethiopia-earth font-medium">Course Thumbnail</FormLabel>
                            <FileUpload
                              label=""
                              accept=".jpg,.jpeg,.png,.webp"
                              onChange={setThumbnailFile}
                              value={thumbnailFile}
                              previewUrl={form.getValues('image')}
                              description="Upload a thumbnail image (16:9 ratio recommended)"
                              isUploading={uploadingThumbnail}
                              uploadProgress={uploadingThumbnail ? 50 : 0}
                            />
                            <FormField
                              control={form.control}
                              name="image"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input 
                                      placeholder="Or enter image URL directly" 
                                      {...field} 
                                      className={thumbnailFile ? "opacity-50" : ""}
                                      disabled={!!thumbnailFile}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <FormLabel className="text-ethiopia-earth font-medium">Cover Image (Optional)</FormLabel>
                            <FileUpload
                              label=""
                              accept=".jpg,.jpeg,.png,.webp"
                              onChange={setCoverImageFile}
                              value={coverImageFile}
                              description="Upload a cover image for the course page"
                              isUploading={uploadingCoverImage}
                              uploadProgress={uploadingCoverImage ? 50 : 0}
                            />
                          </div>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="category_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-ethiopia-earth font-medium">Course Category</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormDescription>
                                Choose the category that best fits your course.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="lessons"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-ethiopia-earth font-medium">Number of Lessons</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Total lessons in this course.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-ethiopia-earth font-medium">Course Duration</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                                      <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                                      <SelectItem value="1-2 months">1-2 months</SelectItem>
                                      <SelectItem value="3+ months">3+ months</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormDescription>
                                  Estimated time to complete the course.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-ethiopia-earth font-medium">Course Level</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="All Levels">All Levels</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormDescription>
                                Difficulty level of the course.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="is_live"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Live Course</FormLabel>
                                <FormDescription>
                                  Enable this if you want to teach this course live through video sessions.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="content" className="space-y-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Course Content</CardTitle>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={addChapter}
                          className="flex items-center"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Chapter
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {chapters.length === 0 ? (
                          <div className="text-center py-10 border-2 border-dashed rounded-md">
                            <p className="text-muted-foreground mb-4">No chapters added yet</p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={addChapter}
                              className="flex items-center"
                            >
                              <Plus className="mr-2 h-4 w-4" /> Add Your First Chapter
                            </Button>
                          </div>
                        ) : (
                          <Accordion type="multiple" className="space-y-4">
                            {chapters.map((chapter, chapterIndex) => (
                              <AccordionItem key={chapterIndex} value={`chapter-${chapterIndex}`} className="border rounded-lg">
                                <AccordionTrigger className="px-4">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                      <Input
                                        value={chapter.title}
                                        onChange={(e) => updateChapter(chapterIndex, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="mr-2"
                                        style={{ width: '300px' }}
                                      />
                                    </div>
                                    <div className="flex items-center">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeChapter(chapterIndex);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                  <div className="space-y-4">
                                    {chapter.lessons.map((lesson, lessonIndex) => (
                                      <Card key={lessonIndex} className="border">
                                        <CardHeader className="flex flex-row items-center justify-between p-4">
                                          <Input
                                            value={lesson.title}
                                            onChange={(e) => updateLesson(
                                              chapterIndex, 
                                              lessonIndex, 
                                              'title', 
                                              e.target.value
                                            )}
                                            placeholder="Lesson title"
                                            className="max-w-md"
                                          />
                                          <div className="flex items-center space-x-2">
                                            <div className="flex items-center space-x-2">
                                              <label className="text-sm text-muted-foreground">Free Preview</label>
                                              <Switch
                                                checked={lesson.is_free}
                                                onCheckedChange={(checked) => updateLesson(
                                                  chapterIndex,
                                                  lessonIndex,
                                                  'is_free',
                                                  checked
                                                )}
                                              />
                                            </div>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeLesson(chapterIndex, lessonIndex)}
                                              className="text-red-500 hover:text-red-700"
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 space-y-4">
                                          <div>
                                            <label className="block text-sm font-medium mb-1">Video URL</label>
                                            <Input
                                              value={lesson.video_url}
                                              onChange={(e) => updateLesson(
                                                chapterIndex,
                                                lessonIndex,
                                                'video_url',
                                                e.target.value
                                              )}
                                              placeholder="https://example.com/video.mp4"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium mb-1">Description</label>
                                            <Textarea
                                              value={lesson.description}
                                              onChange={(e) => updateLesson(
                                                chapterIndex,
                                                lessonIndex,
                                                'description',
                                                e.target.value
                                              )}
                                              placeholder="Describe what this lesson covers"
                                              rows={2}
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium mb-1">Notes</label>
                                            <Textarea
                                              value={lesson.notes}
                                              onChange={(e) => updateLesson(
                                                chapterIndex,
                                                lessonIndex,
                                                'notes',
                                                e.target.value
                                              )}
                                              placeholder="Additional notes for students"
                                              rows={3}
                                            />
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="w-full"
                                      onClick={() => addLesson(chapterIndex)}
                                    >
                                      <Plus className="mr-2 h-4 w-4" /> Add Lesson
                                    </Button>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="attachments" className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Attachments & Materials</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {courseId ? (
                          <CourseAttachments
                            courseId={courseId}
                            attachments={attachments}
                            onAttachmentAdded={handleAttachmentAdded}
                            onAttachmentDeleted={handleAttachmentDeleted}
                          />
                        ) : (
                          <div className="text-center py-10 border-2 border-dashed rounded-md">
                            <p className="text-muted-foreground mb-4">
                              You need to save the course first before adding attachments
                            </p>
                            <Button 
                              type="submit"
                              className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
                            >
                              Save Course First
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/teacher/courses')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {courseId ? "Update Course" : "Create Course"}
                    </Button>
                  </div>
                </form>
              </Form>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeacherCreateCourse;
