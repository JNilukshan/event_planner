import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  currentEventId?: string;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  showSidebar = false, 
  currentEventId,
  activeSection = 'home',
  onSectionChange
}) => {
  const { isDark } = useTheme();
  const [isSidebarMinimized, setIsSidebarMinimized] = React.useState(false);

  return (
    <div className={`
      min-h-screen transition-all duration-500
      ${isDark 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }
    `}>
      {/* Background Effects */}
      <div className={`
        fixed inset-0 transition-all duration-500
        ${isDark 
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-blue-900/20 to-transparent' 
          : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/40 via-blue-100/40 to-transparent'
        }
      `}></div>
      <div className={`
        fixed inset-0 transition-opacity duration-500
        ${isDark 
          ? 'bg-[url(\'data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-20' 
          : 'bg-[url(\'data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%236B7280%22 fill-opacity=%220.08%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-30'
        }
      `}></div>

      {/* Content */}
      <div className="relative z-10">
        <DashboardNavbar />
        <div className="flex">
          {showSidebar && currentEventId && onSectionChange && (
            <>
              <Sidebar 
                eventId={currentEventId} 
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                isMinimized={isSidebarMinimized}
              />
              
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
                className={`
                  fixed top-20 z-40 p-2 backdrop-blur-lg rounded-r-lg transition-all duration-300 hover:scale-110
                  ${isSidebarMinimized ? 'left-16' : 'left-80'}
                  ${isDark 
                    ? 'bg-white/10 border border-l-0 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-black/10 border border-l-0 border-black/20 text-gray-800 hover:bg-black/20'
                  }
                `}
                title={isSidebarMinimized ? 'Expand Sidebar' : 'Minimize Sidebar'}
              >
                {isSidebarMinimized ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            </>
          )}
          <main className={`
            flex-1 transition-all duration-300
            ${showSidebar ? (isSidebarMinimized ? 'ml-16' : 'ml-80') : ''}
          `}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;