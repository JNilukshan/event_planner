import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Check, Upload } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { RSVPForm as RSVPFormType, RSVPResponse, Event } from '../types';

const RSVPForm: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { isDark } = useTheme();
  const [form, setForm] = useState<RSVPFormType | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    // Load form and event data
    const savedForm = localStorage.getItem(`rsvp_form_${eventId}`);
    const savedEvents = localStorage.getItem('events');

    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch (error) {
        console.error('Error loading RSVP form:', error);
      }
    }

    if (savedEvents) {
      try {
        const events = JSON.parse(savedEvents);
        const currentEvent = events.find((e: Event) => e.id === eventId);
        setEvent(currentEvent || null);
      } catch (error) {
        console.error('Error loading event:', error);
      }
    }
  }, [eventId]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleFileUpload = (fieldName: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      handleInputChange(fieldName, e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !eventId) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create response
    const response: RSVPResponse = {
      id: Date.now().toString(),
      formId: form.id,
      eventId,
      responses: formData,
      submittedAt: new Date().toISOString(),
      qrCode: `QR${Date.now().toString().slice(-6)}`
    };

    // Save response
    const existingResponses = localStorage.getItem(`rsvp_responses_${eventId}`);
    const responses = existingResponses ? JSON.parse(existingResponses) : [];
    responses.push(response);
    localStorage.setItem(`rsvp_responses_${eventId}`, JSON.stringify(responses));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (!form || !event) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center transition-all duration-500
        ${isDark 
          ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }
      `}>
        <div className="text-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto
            ${isDark ? 'bg-white/10' : 'bg-black/10'}
          `}>
            <Calendar className={`h-8 w-8 ${isDark ? 'text-white' : 'text-gray-800'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            RSVP Form Not Found
          </h2>
          <p className={`${isDark ? 'text-white/70' : 'text-gray-600'}`}>
            This event doesn't have an active RSVP form.
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className={`
        min-h-screen flex items-center justify-center p-4 transition-all duration-500
        ${isDark 
          ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }
      `}>
        <div className={`
          max-w-md w-full text-center p-8 rounded-2xl backdrop-blur-lg
          ${isDark 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-black/10 border border-black/20'
          }
        `}>
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-white" />
          </div>
          
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            RSVP Submitted!
          </h2>
          
          <p className={`mb-6 leading-relaxed ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
            {form.thankYouMessage}
          </p>
          
          <div className={`
            p-4 rounded-xl mb-6
            ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}
          `}>
            <p className={`text-sm mb-2 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
              Your QR Code:
            </p>
            <p className={`font-mono text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
              QR{Date.now().toString().slice(-6)}
            </p>
          </div>
          
          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            Please save this confirmation for your records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen p-4 transition-all duration-500
      ${isDark 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }
    `}>
      <div className="max-w-2xl mx-auto py-8">
        {/* Event Header */}
        <div className={`
          p-6 rounded-2xl mb-6 backdrop-blur-lg
          ${isDark 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-black/10 border border-black/20'
          }
        `}>
          <div className="text-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 inline-block mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {event.name}
            </h1>
            <p className={`text-lg mb-4 ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
              {event.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className={`h-5 w-5 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Date</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className={`h-5 w-5 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Time</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {event.time}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className={`h-5 w-5 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
              <div>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Venue</p>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {event.venue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Form */}
        <div className={`
          p-6 rounded-2xl backdrop-blur-lg
          ${isDark 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-black/10 border border-black/20'
          }
        `}>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            RSVP Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id}>
                <label className={`
                  block text-sm font-medium mb-2
                  ${isDark ? 'text-white/90' : 'text-gray-700'}
                `}>
                  {field.name} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    required={field.required}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                      ${isDark 
                        ? 'bg-white/10 border border-white/20 text-white' 
                        : 'bg-black/10 border border-black/20 text-gray-800'
                      }
                    `}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === 'radio' ? (
                  <div className="space-y-3">
                    {field.options?.map((option, index) => (
                      <label key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name={field.name}
                          value={option}
                          required={field.required}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-4 h-4 text-purple-500"
                        />
                        <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : field.type === 'checkbox' ? (
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      required={field.required}
                      onChange={(e) => handleInputChange(field.name, e.target.checked)}
                      className="w-4 h-4 text-purple-500 rounded"
                    />
                    <span className={`${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                      {field.placeholder}
                    </span>
                  </label>
                ) : field.type === 'file' ? (
                  <div>
                    <input
                      type="file"
                      required={field.required}
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(field.name, e.target.files[0])}
                      className="hidden"
                      id={`file-${field.id}`}
                    />
                    <label
                      htmlFor={`file-${field.id}`}
                      className={`
                        flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300
                        ${isDark 
                          ? 'border-white/20 hover:border-white/40 text-white/80' 
                          : 'border-gray-300 hover:border-gray-400 text-gray-600'
                        }
                      `}
                    >
                      <Upload className="h-5 w-5" />
                      <span>{field.placeholder || 'Choose file'}</span>
                    </label>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300
                      ${isDark 
                        ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                        : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                      }
                    `}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit RSVP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RSVPForm;