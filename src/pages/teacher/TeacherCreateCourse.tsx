
import React, { useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters."
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters."
  }),
  image: z.string().url({
    message: "Please provide a valid image URL."
  }).optional(),
  duration: z.string().min(1, {
    message: "Duration is required."
  }),
  level: z.string().min(1, {
    message: "Level is required."
  }),
  lessons: z.coerce.number().min(1, {
    message: "Course must have at least 1 lesson."
  }),
});

const TeacherCreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "https://source.unsplash.com/random/800x600/?education",
      duration: "",
      level: "",
      lessons: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          teacher_id: user.id,
          title: values.title,
          description: values.description,
          image: values.image || "https://source.unsplash.com/random/800x600/?education",
          duration: values.duration,
          level: values.level,
          lessons: values.lessons,
          rating: 0.0, // Default rating for new courses
        })
        .select();
        
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to create course. Please try again.",
        });
        console.error('Error creating course:', error);
      } else {
        toast({
          title: "Success",
          description: "Course created successfully!",
        });
        navigate('/teacher/courses');
      }
    } catch (error) {
      console.error('Exception in course creation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">Create New Course</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ethiopia-earth font-medium">Course Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL for the course thumbnail image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ethiopia-earth font-medium">Course Duration</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                  
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-ethiopia-earth font-medium">Course Level</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/teacher/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Course
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeacherCreateCourse;
