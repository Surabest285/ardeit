import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Download, 
  FileText, 
  Loader2, 
  CheckCircle,
  Circle, 
  Video,
  Award
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Course {
  id: string;
  title: string;
  teacher_id: string;
}

interface Section {
  id: string;
  title: string;
  position: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  position: number;
  section_id: string;
  section_title: string;
  is_completed: boolean;
}

interface Material {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
}

const StudentClassroom = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateNumber, setCertificateNumber] = useState<string | null>(null);

  const handleJoinLiveClass = () => {
    if (!courseId) return;
    navigate(`/student/live-class/${courseId}`);
  };

  useEffect(() => {
    const fetchClassroomData = async () => {
      if (!user || !courseId) return;
      
      try {
        // Check enrollment first
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('id, progress')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (enrollmentError || !enrollmentData) {
          console.error('Error checking enrollment:', enrollmentError);
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not enrolled in this course.",
          });
          navigate('/student/courses');
          return;
        }
        
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('id, title, teacher_id')
          .eq('id', courseId)
          .single();
          
        if (courseError) {
          console.error('Error fetching course:', courseError);
          return;
        }
        
        setCourse(courseData);
        
        // Fetch course sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('course_sections')
          .select('id, title, position')
          .eq('course_id', courseId)
          .order('position', { ascending: true });
          
        if (sectionsError) {
          console.error('Error fetching sections:', sectionsError);
        } else {
          setSections(sectionsData || []);
        }
        
        // Fetch completed lessons
        const { data: completionsData, error: completionsError } = await supabase
          .from('lesson_completions')
          .select('lesson_id')
          .eq('user_id', user.id);
          
        const completedLessonIds = completionsData 
          ? completionsData.map(item => item.lesson_id) 
          : [];
          
        // Fetch all lessons with section data
        let allLessons: Lesson[] = [];
        
        for (const section of sectionsData || []) {
          const { data: lessonData, error: lessonError } = await supabase
            .from('course_lessons')
            .select('id, title, description, video_url, position')
            .eq('section_id', section.id)
            .order('position', { ascending: true });
            
          if (lessonError) {
            console.error(`Error fetching lessons for section ${section.id}:`, lessonError);
          } else if (lessonData) {
            const lessonsWithSection = lessonData.map(lesson => ({
              ...lesson,
              section_id: section.id,
              section_title: section.title,
              is_completed: completedLessonIds.includes(lesson.id)
            }));
            
            allLessons = [...allLessons, ...lessonsWithSection];
          }
        }
        
        setLessons(allLessons);
        
        // Calculate progress
        if (allLessons.length > 0) {
          const completedCount = allLessons.filter(lesson => lesson.is_completed).length;
          const progressPercentage = Math.round((completedCount / allLessons.length) * 100);
          setProgress(progressPercentage);
        }
        
        // Set current lesson to first uncompleted lesson, or first lesson if all completed
        if (allLessons.length > 0) {
          const firstUncompletedLesson = allLessons.find(lesson => !lesson.is_completed);
          const lessonToShow = firstUncompletedLesson || allLessons[0];
          setCurrentLessonId(lessonToShow.id);
          setCurrentLesson(lessonToShow);
          
          // Fetch materials for first lesson
          fetchLessonMaterials(lessonToShow.id);
        }
      } catch (error) {
        console.error('Exception in classroom data fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [user, courseId, navigate, toast]);

  const fetchLessonMaterials = async (lessonId: string) => {
    try {
      const { data, error } = await supabase
        .from('lesson_materials')
        .select('id, title, file_url, file_type')
        .eq('lesson_id', lessonId);
        
      if (error) {
        console.error('Error fetching materials:', error);
      } else {
        setMaterials(data || []);
      }
    } catch (error) {
      console.error('Exception fetching materials:', error);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLessonId(lesson.id);
    setCurrentLesson(lesson);
    fetchLessonMaterials(lesson.id);
  };

  const checkForExistingCertificate = async () => {
    if (!user || !courseId) return false;

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('id, certificate_number')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) {
        console.error('Error checking certificate:', error);
        return false;
      }

      if (data) {
        setCertificateNumber(data.certificate_number);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Exception checking certificate:', error);
      return false;
    }
  };

  const generateCertificate = async () => {
    if (!user || !courseId || !course) return;
    
    setCertificateLoading(true);
    
    try {
      // Check if certificate already exists
      const certificateExists = await checkForExistingCertificate();
      
      if (certificateExists) {
        setShowCertificateDialog(true);
        setCertificateLoading(false);
        return;
      }
      
      // Generate certificate number using the database function
      const { data: certNumberData, error: certNumberError } = await supabase
        .rpc('generate_certificate_number');
        
      if (certNumberError) {
        console.error('Error generating certificate number:', certNumberError);
        throw new Error('Failed to generate certificate number');
      }
      
      const generatedCertNumber = certNumberData;
      
      // Create the certificate
      const { data: certData, error: certError } = await supabase
        .from('certificates')
        .insert({
          user_id: user.id,
          course_id: courseId,
          certificate_number: generatedCertNumber
        })
        .select('certificate_number')
        .single();
        
      if (certError) {
        console.error('Error creating certificate:', certError);
        throw new Error('Failed to create certificate');
      }
      
      setCertificateNumber(certData.certificate_number);
      setShowCertificateDialog(true);
      
      toast({
        title: "Congratulations!",
        description: "You've earned a certificate for completing this course.",
      });
    } catch (error: any) {
      console.error('Exception generating certificate:', error);
      toast({
        variant: "destructive",
        title: "Certificate Error",
        description: error.message || "Failed to generate certificate. Please try again.",
      });
    } finally {
      setCertificateLoading(false);
    }
  };

  const viewCertificate = () => {
    navigate('/student/certificates');
  };

  const markLessonComplete = async () => {
    if (!user || !currentLessonId) return;
    
    setMarkingComplete(true);
    
    try {
      // Check if already completed
      if (currentLesson?.is_completed) {
        toast({
          title: "Already Completed",
          description: "You've already completed this lesson.",
        });
        setMarkingComplete(false);
        return;
      }
      
      // Add to lesson_completions
      const { error } = await supabase
        .from('lesson_completions')
        .insert({
          lesson_id: currentLessonId,
          user_id: user.id
        });
        
      if (error) {
        console.error('Error marking lesson complete:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to mark lesson as complete. Please try again.",
        });
      } else {
        // Update local state
        setLessons(prev => 
          prev.map(lesson => 
            lesson.id === currentLessonId 
              ? { ...lesson, is_completed: true } 
              : lesson
          )
        );
        
        if (currentLesson) {
          setCurrentLesson({ ...currentLesson, is_completed: true });
        }
        
        // Recalculate progress
        const completedCount = lessons.filter(lesson => 
          lesson.is_completed || lesson.id === currentLessonId
        ).length;
        const progressPercentage = Math.round((completedCount / lessons.length) * 100);
        setProgress(progressPercentage);
        
        toast({
          title: "Lesson Completed",
          description: "Your progress has been saved.",
        });
        
        // Update enrollment progress
        await supabase
          .from('enrollments')
          .update({
            progress: {
              completed: progressPercentage === 100,
              lessons_completed: completedCount,
              last_lesson_id: currentLessonId,
              updated_at: new Date().toISOString()
            }
          })
          .eq('course_id', courseId)
          .eq('user_id', user.id);
          
        // If course is 100% complete, check/generate certificate
        if (progressPercentage === 100) {
          const certificateExists = await checkForExistingCertificate();
          if (!certificateExists) {
            // Show certificate prompt
            setShowCertificateDialog(true);
          }
        }
      }
    } catch (error) {
      console.error('Exception marking lesson complete:', error);
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/10">
        <div className="container-custom">
          {/* Top navigation bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/student/courses')}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-serif text-ethiopia-terracotta">{course?.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleJoinLiveClass}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Video className="h-4 w-4 mr-2" />
                Join Live Class
              </Button>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">
                  {progress}% complete
                </div>
                <Progress value={progress} className="w-28 h-2" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with course content */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4 sticky top-24">
                <h2 className="font-medium text-ethiopia-earth mb-3">Course Content</h2>
                
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                  {sections.map((section, sIndex) => (
                    <div key={section.id} className="mb-4">
                      <h3 className="text-sm font-medium text-ethiopia-earth mb-2">
                        Section {sIndex + 1}: {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {lessons
                          .filter(lesson => lesson.section_id === section.id)
                          .map((lesson, lIndex) => (
                            <li 
                              key={lesson.id} 
                              className={`
                                text-sm p-2 rounded cursor-pointer flex items-start gap-2
                                ${currentLessonId === lesson.id ? 'bg-ethiopia-amber/10 text-ethiopia-earth' : 'hover:bg-ethiopia-parchment/30 text-gray-700'}
                              `}
                              onClick={() => handleLessonSelect(lesson)}
                            >
                              {lesson.is_completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              )}
                              <span>{lIndex + 1}. {lesson.title}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {currentLesson ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Video area */}
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    {currentLesson.video_url ? (
                      <div className="w-full h-full">
                        {/* Video player would go here */}
                        <iframe 
                          src={currentLesson.video_url} 
                          className="w-full h-full" 
                          title={currentLesson.title}
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="text-center text-white p-8">
                        <p>No video available for this lesson.</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Lesson content */}
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-ethiopia-earth mb-2">{currentLesson.title}</h2>
                      <p className="text-sm text-gray-500">{currentLesson.section_title}</p>
                    </div>
                    
                    <Tabs defaultValue="content">
                      <TabsList>
                        <TabsTrigger value="content">Lesson Content</TabsTrigger>
                        <TabsTrigger value="materials">Materials</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="content" className="mt-4">
                        <div className="prose max-w-none">
                          {currentLesson.description ? (
                            <p>{currentLesson.description}</p>
                          ) : (
                            <p className="text-gray-500 italic">No additional content for this lesson.</p>
                          )}
                        </div>
                        
                        <div className="mt-8 flex justify-between items-center">
                          <div className="flex items-center">
                            {currentLesson.is_completed ? (
                              <div className="flex items-center text-green-600 text-sm font-medium">
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Completed
                              </div>
                            ) : null}
                          </div>
                          
                          <Button 
                            onClick={markLessonComplete} 
                            className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
                            disabled={markingComplete || currentLesson.is_completed}
                          >
                            {markingComplete && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {currentLesson.is_completed ? 'Completed' : 'Mark as Complete'}
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="materials" className="mt-4">
                        {materials.length > 0 ? (
                          <ul className="space-y-3">
                            {materials.map(material => (
                              <li key={material.id} className="border border-ethiopia-sand/30 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 text-ethiopia-amber mr-3" />
                                  <div>
                                    <p className="font-medium text-ethiopia-earth">{material.title}</p>
                                    <p className="text-xs text-gray-500 uppercase">{material.file_type}</p>
                                  </div>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-ethiopia-amber text-ethiopia-earth hover:bg-ethiopia-amber hover:text-white"
                                  onClick={() => window.open(material.file_url, '_blank')}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">No materials available for this lesson.</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <p className="text-gray-500">No lessons available for this course.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Certificate Dialog */}
          <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-ethiopia-amber" />
                  Course Completed!
                </DialogTitle>
                <DialogDescription>
                  Congratulations on completing the course! You've earned a certificate.
                </DialogDescription>
              </DialogHeader>
              
              <div className="text-center py-6">
                <Award className="h-16 w-16 text-ethiopia-amber mx-auto mb-4" />
                <h3 className="text-xl font-medium text-ethiopia-earth mb-2">{course?.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You've successfully completed all lessons in this course.
                </p>
                
                {certificateNumber && (
                  <p className="text-xs font-mono text-ethiopia-earth/60 mt-4">
                    Certificate ID: {certificateNumber}
                  </p>
                )}
              </div>
              
              <DialogFooter className="sm:justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCertificateDialog(false)}
                >
                  Close
                </Button>
                <Button 
                  className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
                  onClick={certificateNumber ? viewCertificate : generateCertificate}
                  disabled={certificateLoading}
                >
                  {certificateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {certificateNumber ? 'View Certificate' : 'Generate Certificate'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentClassroom;
