import React from 'react';
import { Calendar, Users, QrCode, BarChart3, MapPin, FileText, CheckSquare, Upload, Mail, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const About: React.FC = () => {
  const { isDark } = useTheme();
  
  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create, edit, and delete events with comprehensive details. Each event gets a unique RSVP link for easy sharing.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Smart RSVP System',
      description: 'Customizable RSVP forms with required fields, optional questions, and guest photo uploads. Mobile-responsive design.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: QrCode,
      title: 'QR Code Features',
      description: 'Generate QR codes for guests, email them automatically, and use web scanning for seamless event check-ins.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track RSVPs with live charts, filter responses, and export data to Excel for comprehensive event insights.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: CheckSquare,
      title: 'Planning Tools',
      description: 'Manage task checklists, save notes, track resources, and upload files - everything you need in one place.',
      color: 'from-pink-500 to-purple-500'
    },
    {
      icon: MapPin,
      title: 'Venue Preview',
      description: 'Add venue addresses and preview locations with embedded Google Maps for guest convenience.',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee'
    },
    {
      icon: Mail,
      title: 'Email Integration',
      description: 'Automated emails with QR codes and event confirmations'
    },
    {
      icon: Upload,
      title: 'File Management',
      description: 'Upload and organize flyers, PDFs, and event materials'
    },
    {
      icon: FileText,
      title: 'Export Ready',
      description: 'Export guest lists and data in multiple formats'
    }
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`
            text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            Everything You Need for
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Perfect Events
            </span>
          </h2>
          <p className={`
            text-xl max-w-3xl mx-auto transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-600'}
          `}>
            From initial planning to final check-in, EventMaster provides all the tools 
            you need to create memorable experiences that your guests will love.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                group p-8 backdrop-blur-lg rounded-2xl transition-all duration-300 transform hover:-translate-y-2
                ${isDark 
                  ? 'bg-white/10 border border-white/20 hover:bg-white/20' 
                  : 'bg-black/10 border border-black/20 hover:bg-black/20'
                }
              `}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className={`
                text-2xl font-bold mb-4 transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {feature.title}
              </h3>
              <p className={`
                leading-relaxed transition-colors duration-300
                ${isDark ? 'text-white/70' : 'text-gray-600'}
              `}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`
                text-center p-6 backdrop-blur-lg rounded-xl transition-all duration-200
                ${isDark 
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10' 
                  : 'bg-black/5 border border-black/10 hover:bg-black/10'
                }
              `}
            >
              <div className={`
                inline-flex p-3 rounded-full mb-4
                ${isDark ? 'bg-white/10' : 'bg-black/10'}
              `}>
                <benefit.icon className={`
                  h-6 w-6 transition-colors duration-300
                  ${isDark ? 'text-white' : 'text-gray-800'}
                `} />
              </div>
              <h4 className={`
                text-lg font-semibold mb-2 transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-800'}
              `}>
                {benefit.title}
              </h4>
              <p className={`
                text-sm transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-600'}
              `}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Process Flow */}
        <div className="text-center">
          <h3 className={`
            text-3xl font-bold mb-12 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            Simple 4-Step Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Event', desc: 'Set up your event details and customize RSVP form' },
              { step: '02', title: 'Share Link', desc: 'Send the unique RSVP link to your guests' },
              { step: '03', title: 'Track RSVPs', desc: 'Monitor responses and generate QR codes' },
              { step: '04', title: 'Check-in Guests', desc: 'Scan QR codes for seamless event entry' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h4 className={`
                    text-xl font-semibold mb-2 transition-colors duration-300
                    ${isDark ? 'text-white' : 'text-gray-800'}
                  `}>
                    {item.title}
                  </h4>
                  <p className={`
                    text-center transition-colors duration-300
                    ${isDark ? 'text-white/70' : 'text-gray-600'}
                  `}>
                    {item.desc}
                  </p>
                </div>
                {index < 3 && (
                  <div className={`
                    hidden md:block absolute top-8 left-full w-full h-0.5 transform -translate-y-1/2
                    ${isDark 
                      ? 'bg-gradient-to-r from-purple-500/50 to-transparent' 
                      : 'bg-gradient-to-r from-purple-500/30 to-transparent'
                    }
                  `}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;