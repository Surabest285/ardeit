
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Video, Users, Mic, MicOff, VideoOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface LiveClassroomProps {
  roomName: string;
  courseTitle: string;
  isTeacher?: boolean;
  onClose?: () => void;
}

const LiveClassroom: React.FC<LiveClassroomProps> = ({
  roomName,
  courseTitle,
  isTeacher = false,
  onClose
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [jitsiAPI, setJitsiAPI] = useState<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Jitsi Meet API script
    const loadJitsiScript = () => {
      if (!document.getElementById('jitsi-api-script')) {
        const script = document.createElement('script');
        script.id = 'jitsi-api-script';
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
      } else if (window.JitsiMeetExternalAPI) {
        setScriptLoaded(true);
      }
    };

    loadJitsiScript();

    return () => {
      // Clean up Jitsi instance when component unmounts
      if (jitsiAPI) {
        jitsiAPI.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // Initialize Jitsi Meet when the script is loaded and container is available
    if (scriptLoaded && jitsiContainerRef.current && user && profile) {
      try {
        const domain = 'meet.jit.si';
        const options = {
          roomName: `mezmur-melodies-${roomName}`,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          lang: 'en',
          userInfo: {
            displayName: profile.full_name || user.email,
            email: user.email
          },
          configOverwrite: {
            prejoinPageEnabled: false,
            startWithAudioMuted: !isTeacher,
            disableDeepLinking: true,
            startScreenSharing: isTeacher,
            toolbarButtons: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'settings', 'raisehand', 'videoquality', 'filmstrip',
              'participants-pane'
            ]
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'fullscreen', 'hangup',
              'profile', 'chat', 'recording', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'participants-pane'
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: '#ffffff'
          }
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        // Event listeners
        api.addEventListeners({
          videoConferenceJoined: () => {
            console.log('User joined the conference');
            toast({
              title: "Joined Live Class",
              description: `You've joined the live class for ${courseTitle}`,
            });
          },
          videoConferenceLeft: () => {
            console.log('User left the conference');
            if (onClose) {
              onClose();
            }
          },
          participantJoined: (participant: any) => {
            console.log('Participant joined:', participant);
          },
          participantLeft: (participant: any) => {
            console.log('Participant left:', participant);
          }
        });

        setJitsiAPI(api);
      } catch (error) {
        console.error('Failed to initialize Jitsi Meet:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect to the live class. Please try again.",
        });
      }
    }
  }, [scriptLoaded, roomName, courseTitle, user, profile, isTeacher, toast, onClose]);

  const handleExit = () => {
    if (jitsiAPI) {
      jitsiAPI.executeCommand('hangup');
    }
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleExit}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-serif text-ethiopia-terracotta">
            <span className="flex items-center">
              <Video className="h-5 w-5 mr-2 text-ethiopia-amber" />
              Live Class: {courseTitle}
            </span>
          </h1>
        </div>
        <Button 
          variant="destructive" 
          onClick={handleExit}
          size="sm"
        >
          Exit Class
        </Button>
      </div>
      
      <div 
        ref={jitsiContainerRef} 
        className="flex-1"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        {!scriptLoaded && (
          <div className="flex flex-col items-center justify-center h-full">
            <Video className="h-12 w-12 animate-pulse text-ethiopia-amber mb-4" />
            <p className="text-ethiopia-earth">Setting up live classroom...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassroom;
