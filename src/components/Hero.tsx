import React from 'react';
import { Calendar, Users, QrCode, BarChart3, ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeroProps {
  onSignupClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSignupClick }) => {
  const { isDark } = useTheme();
  
  const features = [
    { icon: Calendar, text: 'Event Management' },
    { icon: Users, text: 'RSVP Tracking' },
    { icon: QrCode, text: 'QR Check-ins' },
    { icon: BarChart3, text: 'Analytics' }
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className={`
            text-5xl md:text-7xl font-bold mb-6 leading-tight transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            Plan Events
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h1>
          <p className={`
            text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-600'}
          `}>
            Create stunning events, manage RSVPs effortlessly, and track everything with powerful analytics. 
            The all-in-one platform for modern event planning.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                flex items-center space-x-2 px-4 py-2 backdrop-blur-lg rounded-full transition-all duration-200
                ${isDark 
                  ? 'bg-white/10 border border-white/20 text-white/90 hover:bg-white/20' 
                  : 'bg-black/10 border border-black/20 text-gray-700 hover:bg-black/20'
                }
              `}
            >
              <feature.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button 
            onClick={onSignupClick}
            className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-semibold text-lg flex items-center space-x-2"
          >
            <span>Start Planning Now</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button className={`
            px-8 py-4 backdrop-blur-lg rounded-full transition-all duration-200 font-semibold text-lg
            ${isDark 
              ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' 
              : 'bg-black/10 border border-black/20 text-gray-800 hover:bg-black/20'
            }
          `}>
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className={`
              text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
              10K+
            </div>
            <div className={`
              transition-colors duration-300
              ${isDark ? 'text-white/70' : 'text-gray-600'}
            `}>
              Events Created
            </div>
          </div>
          <div className="text-center">
            <div className={`
              text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
              500K+
            </div>
            <div className={`
              transition-colors duration-300
              ${isDark ? 'text-white/70' : 'text-gray-600'}
            `}>
              RSVPs Managed
            </div>
          </div>
          <div className="text-center">
            <div className={`
              text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
              99.9%
            </div>
            <div className={`
              transition-colors duration-300
              ${isDark ? 'text-white/70' : 'text-gray-600'}
            `}>
              Uptime
            </div>
          </div>
          <div className="text-center">
            <div className={`
              text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300
              ${isDark ? 'text-white' : 'text-gray-800'}
            `}>
              24/7
            </div>
            <div className={`
              transition-colors duration-300
              ${isDark ? 'text-white/70' : 'text-gray-600'}
            `}>
              Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;