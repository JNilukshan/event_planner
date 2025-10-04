import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import DashboardLayout from './DashboardLayout';
import EventCard from './EventCard';
import CreateEventModal from './CreateEventModal';
import TaskChecklist from './TaskChecklist';
import Notes from './Notes';
import FileUpload from './FileUpload';
import ResourceTracker from './ResourceTracker';
import RSVPFormBuilder from './RSVPFormBuilder';
import RSVPDashboard from './RSVPDashboard';
import QRCodes from './QRCodes';
import { Event } from '../../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        console.log('Loaded events from localStorage:', parsedEvents);
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error parsing saved events:', error);
      }
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    console.log('Saving events to localStorage:', events);
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'userId'>) => {
    console.log('Creating event with data:', eventData);
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user?.id || ''
    };
    
    console.log('New event created:', newEvent);
    setEvents(prev => [...prev, newEvent]);
    setIsCreateModalOpen(false);
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setActiveSection('home');
  };

  const handleBackToDashboard = () => {
    setSelectedEvent(null);
    setActiveSection('home');
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderEventContent = () => {
    if (!selectedEvent) return null;

    switch (activeSection) {
      case 'tasks':
        return <TaskChecklist eventId={selectedEvent.id} />;
      case 'notes':
        return <Notes eventId={selectedEvent.id} />;
      case 'files':
        return <FileUpload eventId={selectedEvent.id} />;
      case 'resources':
        return <ResourceTracker eventId={selectedEvent.id} />;
      case 'rsvp-form':
        return <RSVPFormBuilder eventId={selectedEvent.id} />;
      case 'rsvp-dashboard':
        return <RSVPDashboard eventId={selectedEvent.id} />;
      case 'qr-codes':
        return <QRCodes eventId={selectedEvent.id} />;
      case 'home':
      default:
        return (
          <div className="p-6">
            <div className="mb-6">
              <button
                onClick={handleBackToDashboard}
                className={`
                  mb-4 px-4 py-2 rounded-lg transition-all duration-200
                  ${isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-gray-800'
                  }
                `}
              >
                ← Back to Dashboard
              </button>
              <h1 className={`
                text-3xl font-bold mb-2 transition-colors duration-300
                ${isDark ? 'text-white' : 'text-gray-900'}
              `}>
                {selectedEvent.name}
              </h1>
              <p className={`
                text-lg mb-4 transition-colors duration-300
                ${isDark ? 'text-white/80' : 'text-gray-600'}
              `}>
                {selectedEvent.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`
                  p-4 rounded-xl transition-all duration-300
                  ${isDark 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-black/5 border border-black/10'
                  }
                `}>
                  <Calendar className="h-5 w-5 mb-2 text-purple-400" />
                  <p className={`
                    text-sm transition-colors duration-300
                    ${isDark ? 'text-white/60' : 'text-gray-500'}
                  `}>
                    Date
                  </p>
                  <p className={`
                    font-medium transition-colors duration-300
                    ${isDark ? 'text-white' : 'text-gray-800'}
                  `}>
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`
                  p-4 rounded-xl transition-all duration-300
                  ${isDark 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-black/5 border border-black/10'
                  }
                `}>
                  <MapPin className="h-5 w-5 mb-2 text-purple-400" />
                  <p className={`
                    text-sm transition-colors duration-300
                    ${isDark ? 'text-white/60' : 'text-gray-500'}
                  `}>
                    Venue
                  </p>
                  <p className={`
                    font-medium transition-colors duration-300
                    ${isDark ? 'text-white' : 'text-gray-800'}
                  `}>
                    {selectedEvent.venue}
                  </p>
                </div>
                <div className={`
                  p-4 rounded-xl transition-all duration-300
                  ${isDark 
                    ? 'bg-white/5 border border-white/10' 
                    : 'bg-black/5 border border-black/10'
                  }
                `}>
                  <Users className="h-5 w-5 mb-2 text-purple-400" />
                  <p className={`
                    text-sm transition-colors duration-300
                    ${isDark ? 'text-white/60' : 'text-gray-500'}
                  `}>
                    RSVPs
                  </p>
                  <p className={`
                    font-medium transition-colors duration-300
                    ${isDark ? 'text-white' : 'text-gray-800'}
                  `}>
                    0 responses
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className={`
        w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300
        ${isDark 
          ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30' 
          : 'bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200'
        }
      `}>
        <Calendar className={`
          w-12 h-12 transition-colors duration-300
          ${isDark ? 'text-purple-400' : 'text-purple-600'}
        `} />
      </div>
      
      <h2 className={`
        text-2xl font-bold mb-4 transition-colors duration-300
        ${isDark ? 'text-white' : 'text-gray-900'}
      `}>
        Welcome to EventMaster
      </h2>
      
      <p className={`
        text-lg mb-8 max-w-md transition-colors duration-300
        ${isDark ? 'text-white/80' : 'text-gray-600'}
      `}>
        Start planning your first event and manage RSVPs like a pro
      </p>
      
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Your First Event
      </button>
    </div>
  );

  const renderEventGrid = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`
            text-3xl font-bold transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            My Events
          </h1>
          <p className={`
            mt-2 transition-colors duration-300
            ${isDark ? 'text-white/80' : 'text-gray-600'}
          `}>
            Manage and track your events
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`
            px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300
            ${isDark 
              ? 'bg-white/10 border border-white/20' 
              : 'bg-black/10 border border-black/20'
            }
          `}>
            <span className={`
              text-sm font-medium transition-colors duration-300
              ${isDark ? 'text-white/80' : 'text-gray-600'}
            `}>
              Total Events: {events.length}
            </span>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Create Event</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => handleEventSelect(event)}
          />
        ))}
      </div>
    </div>
  );

  console.log('Current events state:', events);
  console.log('Events length:', events.length);
  
  return (
    <DashboardLayout 
      showSidebar={!!selectedEvent}
      currentEventId={selectedEvent?.id}
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
    >
      <div className="p-6">
        {selectedEvent ? renderEventContent() : (events.length === 0 ? renderEmptyState() : renderEventGrid())}
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
    </DashboardLayout>
  );
};

export default Dashboard;