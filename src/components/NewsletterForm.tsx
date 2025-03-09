
import { useState } from 'react';
import { MailPlus, Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail('');
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        duration: 3000,
      });
    }, 1500);
  };
  
  return (
    <div className="glass-card max-w-3xl mx-auto">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-serif mb-2">Stay Connected</h3>
            <p className="text-muted-foreground">
              Subscribe to receive updates on new courses, events, and resources.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <MailPlus size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-ethiopia-sand bg-white focus:outline-none focus:ring-2 focus:ring-ethiopia-amber/50"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn-primary flex items-center justify-center gap-2 min-w-[120px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterForm;
