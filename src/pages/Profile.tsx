
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload, User, UserRound, Mail, BookOpen, Calendar } from 'lucide-react';

const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
    },
  });

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
        <span className="ml-2">Loading your profile...</span>
      </div>
    );
  }

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          bio: values.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      
      const files = event.target.files;
      if (!files || files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: data.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully.',
      });
      
      // Refresh the page to show updated avatar
      window.location.reload();
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error uploading avatar',
        variant: 'destructive',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U';
  };

  const joinedDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : 'Unknown';

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom max-w-4xl">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="text-base">
                <User className="mr-2 h-4 w-4" />
                Profile Information
              </TabsTrigger>
              <TabsTrigger value="account" className="text-base">
                <UserRound className="mr-2 h-4 w-4" />
                Account Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-4 border-ethiopia-amber">
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} />
                        ) : (
                          <AvatarFallback className="bg-ethiopia-amber text-white text-2xl">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
                      >
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingAvatar}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{profile?.full_name || 'User Profile'}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {user.email} 
                        <span className="mx-2">•</span>
                        <span className="capitalize flex items-center">
                          <UserRound className="h-4 w-4 mr-1" />
                          {profile?.role || 'User'}
                        </span>
                      </CardDescription>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {joinedDate}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpdateProfile)}>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us a bit about yourself" 
                                className="resize-none min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="btn-primary"
                        disabled={updating || !form.formState.isDirty}
                      >
                        {updating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Profile'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    View and manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex">
                      <Input
                        value={user.email || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your email is used for important notifications and login
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="flex">
                      <Input
                        value={profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : ''}
                        disabled
                        className="bg-muted capitalize"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your role determines what features you can access
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Account Created</Label>
                    <div className="flex">
                      <Input
                        value={joinedDate}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col items-start space-y-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-ethiopia-earth" />
                    <span className="text-sm">
                      {profile?.role === 'student' ? 'View your enrolled courses' : 'Manage your courses'}
                    </span>
                  </div>
                  <Button 
                    onClick={() => {
                      if (profile?.role === 'teacher') {
                        window.location.href = '/teacher/courses';
                      } else {
                        window.location.href = '/student/courses';
                      }
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    {profile?.role === 'teacher' ? 'Go to My Courses' : 'View My Learning'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
