
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Download, ExternalLink, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface Certificate {
  id: string;
  course_id: string;
  issue_date: string;
  certificate_number: string;
  verified: boolean;
  course: {
    title: string;
    description: string;
    image: string;
    level: string;
    duration: string;
  };
}

const StudentCertificates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('certificates')
          .select(`
            id,
            course_id,
            issue_date,
            certificate_number,
            verified,
            course:course_id (
              title,
              description,
              image,
              level,
              duration
            )
          `)
          .eq('user_id', user.id)
          .order('issue_date', { ascending: false });
          
        if (error) {
          console.error('Error fetching certificates:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load certificates. Please try again.",
          });
        } else {
          console.log('Fetched certificates:', data);
          setCertificates(data || []);
        }
      } catch (error) {
        console.error('Exception fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user, toast]);

  const viewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setDialogOpen(true);
  };

  const downloadCertificate = () => {
    // In a real application, this would generate and download a PDF certificate
    toast({
      title: "Download started",
      description: "Your certificate is being downloaded.",
    });
  };

  const verifyCertificate = () => {
    // In a real application, this would redirect to a verification page
    toast({
      title: "Certificate verified",
      description: "This certificate is authentic and valid.",
    });
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">My Certificates</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
            </div>
          ) : certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="overflow-hidden border border-ethiopia-sand/30 hover:shadow-md transition duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden bg-ethiopia-earth/5">
                    {certificate.course?.image ? (
                      <img
                        src={certificate.course.image}
                        alt={certificate.course.title}
                        className="w-full h-full object-cover opacity-20"
                      />
                    ) : null}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <Award className="h-16 w-16 text-ethiopia-amber mb-4" />
                      <h3 className="text-xl font-bold text-ethiopia-terracotta">
                        {certificate.course?.title || 'Course Certificate'}
                      </h3>
                      <p className="text-sm text-ethiopia-earth mt-2">Certificate of Completion</p>
                      <p className="text-xs text-ethiopia-earth/70 mt-1">
                        Issued on {format(new Date(certificate.issue_date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-ethiopia-earth/60 font-mono">
                          {certificate.certificate_number}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-ethiopia-amber text-ethiopia-earth hover:bg-ethiopia-amber hover:text-white"
                        onClick={() => viewCertificate(certificate)}
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-ethiopia-sand/30">
              <Award className="h-16 w-16 text-ethiopia-sand mx-auto mb-4" />
              <h3 className="text-xl font-medium text-ethiopia-earth mb-4">No certificates yet</h3>
              <p className="text-gray-500 mb-6">
                Complete courses to earn certificates that showcase your achievements.
              </p>
            </div>
          )}
          
          {/* Certificate Detail Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            {selectedCertificate && (
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Certificate of Completion</DialogTitle>
                </DialogHeader>
                <div className="p-6 bg-ethiopia-parchment/20 rounded-lg border border-ethiopia-sand/30">
                  <div className="text-center mb-8">
                    <Award className="h-16 w-16 text-ethiopia-amber mx-auto mb-4" />
                    <h2 className="text-2xl font-serif text-ethiopia-terracotta mb-2">Certificate of Completion</h2>
                    <p className="text-sm text-ethiopia-earth">
                      This certifies that
                    </p>
                    <p className="text-xl font-medium text-ethiopia-earth my-3">
                      {user?.email?.split('@')[0] || 'Student'}
                    </p>
                    <p className="text-sm text-ethiopia-earth">
                      has successfully completed the course
                    </p>
                    <h3 className="text-xl font-bold text-ethiopia-terracotta my-3">
                      {selectedCertificate.course?.title || 'Untitled Course'}
                    </h3>
                    <p className="text-sm text-ethiopia-earth/70">
                      Issued on {format(new Date(selectedCertificate.issue_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-ethiopia-sand/30">
                    <div className="text-xs font-mono text-ethiopia-earth/60">
                      Certificate ID: {selectedCertificate.certificate_number}
                    </div>
                    {selectedCertificate.verified && (
                      <div className="flex items-center text-green-600 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Button 
                    variant="outline" 
                    onClick={verifyCertificate}
                    className="flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                  <Button 
                    onClick={downloadCertificate}
                    className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentCertificates;
