
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-semibold text-ethiopia-terracotta">
                <span className="text-ethiopia-amber">Mezmur</span> Melodies
              </span>
            </div>
            <p className="text-muted-foreground">
              An immersive e-learning platform dedicated to preserving and sharing Ethiopian Orthodox musical traditions.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-foreground hover:text-ethiopia-amber transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-foreground hover:text-ethiopia-amber transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-foreground hover:text-ethiopia-amber transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-foreground hover:text-ethiopia-amber transition-colors" aria-label="Youtube">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-base font-medium mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#courses" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="#instruments" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  Instruments
                </a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#instructors" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  Instructors
                </a>
              </li>
              <li>
                <a href="#blog" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-base font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-base font-medium mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-ethiopia-amber" />
                <a href="mailto:info@mezmurmelodies.com" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  info@mezmurmelodies.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-ethiopia-amber" />
                <a href="tel:+251112345678" className="text-muted-foreground hover:text-ethiopia-amber transition-colors">
                  +251 11 234 5678
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-ethiopia-amber mt-1" />
                <address className="text-muted-foreground not-italic">
                  Addis Ababa, Ethiopia<br />
                  Near St. Mary Church
                </address>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-muted pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mezmur Melodies Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-ethiopia-amber transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-ethiopia-amber transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-ethiopia-amber transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
