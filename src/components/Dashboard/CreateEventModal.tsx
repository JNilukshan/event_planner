import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, FileText } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Event } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'userId'>) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onCreateEvent }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    // Call the parent's create event handler
    onCreateEvent(formData);

    // Reset form and close modal
    setFormData({
      name: '',
      description: '',
      date: '',
      time: '',
      venue: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`
        w-full max-w-lg backdrop-blur-lg rounded-2xl p-6 transition-all duration-300
        ${isDark 
          ? 'bg-white/10 border border-white/20' 
          : 'bg-black/10 border border-black/20'
        }
      `}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`
            text-2xl font-bold transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            Create New Event
          </h2>
          <button
            onClick={onClose}
            className={`
              p-2 rounded-full transition-colors duration-200
              ${isDark 
                ? 'hover:bg-white/10 text-white' 
                : 'hover:bg-black/10 text-gray-800'
              }
            `}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`
              block text-sm font-medium mb-2 transition-colors duration-300
              ${isDark ? 'text-white/90' : 'text-gray-700'}
            `}>
              Event Name
            </label>
            <div className="relative">
              <Calendar className={`
                absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`
                  w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                  ${isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                    : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                  }
                `}
                placeholder="Enter event name"
                required
              />
            </div>
          </div>

          <div>
            <label className={`
              block text-sm font-medium mb-2 transition-colors duration-300
              ${isDark ? 'text-white/90' : 'text-gray-700'}
            `}>
              Description
            </label>
            <div className="relative">
              <FileText className={`
                absolute left-3 top-3 h-5 w-5 transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `} />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`
                  w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none
                  ${isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                    : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                  }
                `}
                placeholder="Describe your event"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`
                block text-sm font-medium mb-2 transition-colors duration-300
                ${isDark ? 'text-white/90' : 'text-gray-700'}
              `}>
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                  ${isDark 
                    ? 'bg-white/10 border border-white/20 text-white' 
                    : 'bg-black/10 border border-black/20 text-gray-800'
                  }
                `}
                required
              />
            </div>

            <div>
              <label className={`
                block text-sm font-medium mb-2 transition-colors duration-300
                ${isDark ? 'text-white/90' : 'text-gray-700'}
              `}>
                Time
              </label>
              <div className="relative">
                <Clock className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300
                  ${isDark ? 'text-white/60' : 'text-gray-500'}
                `} />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                    ${isDark 
                      ? 'bg-white/10 border border-white/20 text-white' 
                      : 'bg-black/10 border border-black/20 text-gray-800'
                    }
                  `}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`
              block text-sm font-medium mb-2 transition-colors duration-300
              ${isDark ? 'text-white/90' : 'text-gray-700'}
            `}>
              Venue
            </label>
            <div className="relative">
              <MapPin className={`
                absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `} />
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className={`
                  w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                  ${isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                    : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                  }
                `}
                placeholder="Enter venue location"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-medium"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;