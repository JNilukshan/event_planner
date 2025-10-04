import React from 'react';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
    <footer className={`
      backdrop-blur-lg pt-16 pb-8 transition-all duration-300
      ${isDark 
        ? 'bg-black/20 border-t border-white/10' 
        : 'bg-white/20 border-t border-black/10'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className={`
                text-xl font-bold transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                EventMaster
              </span>
            </div>
            <p className={`
              leading-relaxed transition-colors duration-300
              ${isDark ? 'text-white/70' : 'text-gray-600'}
            `}>
              The ultimate event planning platform that makes organizing memorable experiences effortless and enjoyable.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`
                    p-2 rounded-lg transition-colors duration-200
                    ${isDark 
                      ? 'bg-white/10 hover:bg-white/20' 
                      : 'bg-black/10 hover:bg-black/20'
                    }
                  `}
                >
                  <Social className={`
                    h-5 w-5 transition-colors duration-300
                    ${isDark ? 'text-white' : 'text-gray-800'}
                  `} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className={`
              text-lg font-semibold transition-colors duration-300
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
              Quick Links
            </h3>
            <div className="space-y-2">
              {['Home', 'About', 'Features', 'Pricing', 'Support', 'Blog'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className={`
                    block transition-colors duration-200
                    ${isDark 
                      ? 'text-white/70 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className={`
              text-lg font-semibold transition-colors duration-300
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
              Features
            </h3>
            <div className="space-y-2">
              {[
                'Event Management',
                'RSVP System',
                'QR Code Check-ins',
                'Analytics Dashboard',
                'Mobile App',
                'API Access'
              ].map((feature) => (
                <a
                  key={feature}
                  href="#"
                  className={`
                    block transition-colors duration-200
                    ${isDark 
                      ? 'text-white/70 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  {feature}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className={`
              text-lg font-semibold transition-colors duration-300
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <span className={`
                  transition-colors duration-300
                  ${isDark ? 'text-white/70' : 'text-gray-600'}
                `}>
                  hello@eventmaster.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-400" />
                <span className={`
                  transition-colors duration-300
                  ${isDark ? 'text-white/70' : 'text-gray-600'}
                `}>
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span className={`
                  transition-colors duration-300
                  ${isDark ? 'text-white/70' : 'text-gray-600'}
                `}>
                  San Francisco, CA
                </span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="pt-4">
              <h4 className={`
                font-medium mb-2 transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                Stay Updated
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`
                    flex-1 px-3 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                    ${isDark 
                      ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                      : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                    }
                  `}
                />
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-r-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`
          pt-8 transition-all duration-300
          ${isDark ? 'border-t border-white/10' : 'border-t border-black/10'}
        `}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className={`
              text-sm transition-colors duration-300
              ${isDark ? 'text-white/60' : 'text-gray-500'}
            `}>
              © 2025 EventMaster. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className={`
                transition-colors duration-200
                ${isDark 
                  ? 'text-white/60 hover:text-white' 
                  : 'text-gray-500 hover:text-gray-800'
                }
              `}>
                Privacy Policy
              </a>
              <a href="#" className={`
                transition-colors duration-200
                ${isDark 
                  ? 'text-white/60 hover:text-white' 
                  : 'text-gray-500 hover:text-gray-800'
                }
              `}>
                Terms of Service
              </a>
              <a href="#" className={`
                transition-colors duration-200
                ${isDark 
                  ? 'text-white/60 hover:text-white' 
                  : 'text-gray-500 hover:text-gray-800'
                }
              `}>
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;