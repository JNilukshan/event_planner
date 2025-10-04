import React, { useState } from 'react';
import { 
  Home, 
  CheckSquare, 
  FileText, 
  Upload, 
  Package, 
  Users, 
  QrCode,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  eventId: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMinimized?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ eventId, activeSection, onSectionChange, isMinimized = false }) => {
  const { isDark } = useTheme();
  const [isPlanningExpanded, setIsPlanningExpanded] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Dashboard Home', icon: Home },
    { id: 'planning', label: 'Event Planning', icon: Settings, hasSubmenu: true },
    { id: 'rsvp-form', label: 'RSVP Form', icon: FileText },
    { id: 'rsvp-dashboard', label: 'RSVP Dashboard', icon: Users },
    { id: 'qr-codes', label: 'QR Codes', icon: QrCode }
  ];

  const planningSubmenu = [
    { id: 'tasks', label: 'Task Checklist', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'files', label: 'File Uploads', icon: Upload },
    { id: 'resources', label: 'Resource Tracker', icon: Package }
  ];

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'planning') {
      setIsPlanningExpanded(!isPlanningExpanded);
      return;
    }
    onSectionChange(sectionId);
  };
  
  return (
    <div className={`
      fixed left-0 top-16 h-[calc(100vh-4rem)] backdrop-blur-lg transition-all duration-300 z-30
      ${isMinimized ? 'w-16' : 'w-80'}
      ${isDark 
        ? 'bg-white/10 border-r border-white/20' 
        : 'bg-black/10 border-r border-black/20'
      }
    `}>
      <div className={`${isMinimized ? 'p-2' : 'p-6'}`}>
        {!isMinimized && (
          <h2 className={`
            text-lg font-semibold mb-6 transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            Event Management
          </h2>
        )}

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleSectionClick(item.id)}
                className={`
                  w-full flex items-center rounded-xl transition-all duration-200
                  ${isMinimized ? 'justify-center px-2 py-3' : 'justify-between px-4 py-3'}
                  ${(activeSection === item.id || (item.id === 'planning' && isPlanningExpanded))
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : isDark
                      ? 'text-white/80 hover:bg-white/10'
                      : 'text-gray-700 hover:bg-black/10'
                  }
                `}
                title={isMinimized ? item.label : undefined}
              >
                <div className={`flex items-center ${isMinimized ? '' : 'space-x-3'}`}>
                  <item.icon className="h-5 w-5" />
                  {!isMinimized && <span className="font-medium">{item.label}</span>}
                </div>
                {item.hasSubmenu && !isMinimized && (
                  <ChevronRight className={`
                    h-4 w-4 transition-transform duration-200
                    ${isPlanningExpanded ? 'rotate-90' : ''}
                  `} />
                )}
              </button>

              {/* Planning Submenu */}
              {item.id === 'planning' && isPlanningExpanded && !isMinimized && (
                <div className="ml-4 mt-2 space-y-1">
                  {planningSubmenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleSectionClick(subItem.id)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200
                        ${activeSection === subItem.id
                          ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                          : isDark 
                            ? 'text-white/70 hover:bg-white/10 hover:text-white' 
                            : 'text-gray-600 hover:bg-black/10 hover:text-gray-800'
                        }
                      `}
                    >
                      <subItem.icon className="h-4 w-4" />
                      <span className="text-sm">{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Event Info */}
        {!isMinimized && (
          <div className={`
            mt-8 p-4 rounded-xl transition-all duration-300
            ${isDark 
              ? 'bg-white/5 border border-white/10' 
              : 'bg-black/5 border border-black/10'
            }
          `}>
            <h3 className={`
              text-sm font-semibold mb-2 transition-colors duration-300
              ${isDark ? 'text-white/90' : 'text-gray-800'}
            `}>
              Current Event
            </h3>
            <p className={`
              text-xs transition-colors duration-300
              ${isDark ? 'text-white/60' : 'text-gray-600'}
            `}>
              Event ID: {eventId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;