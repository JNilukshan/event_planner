import React from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const { isDark } = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div
      onClick={onClick}
      className={`
        group cursor-pointer backdrop-blur-lg rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105
        ${isDark 
          ? 'bg-white/10 border border-white/20 hover:bg-white/20' 
          : 'bg-black/10 border border-black/20 hover:bg-black/20'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`
            text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            {event.name}
          </h3>
          <p className={`
            text-sm leading-relaxed transition-colors duration-300
            ${isDark ? 'text-white/70' : 'text-gray-600'}
          `}>
            {event.description}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
          <Calendar className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Calendar className={`
            h-4 w-4 transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `} />
          <span className={`
            text-sm transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-700'}
          `}>
            {formatDate(event.date)}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className={`
            h-4 w-4 transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `} />
          <span className={`
            text-sm transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-700'}
          `}>
            {formatTime(event.time)}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className={`
            h-4 w-4 transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `} />
          <span className={`
            text-sm transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-700'}
          `}>
            {event.venue}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Users className={`
            h-4 w-4 transition-colors duration-300
            ${isDark ? 'text-white/60' : 'text-gray-500'}
          `} />
          <span className={`
            text-sm transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-700'}
          `}>
            0 RSVPs
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <span className={`
            text-xs transition-colors duration-300
            ${isDark ? 'text-white/50' : 'text-gray-500'}
          `}>
            Created {new Date(event.createdAt).toLocaleDateString()}
          </span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;