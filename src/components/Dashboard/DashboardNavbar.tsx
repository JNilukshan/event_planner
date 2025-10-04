import React, { useState } from 'react';
import { Calendar, Plus, User, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ThemeToggle';
import CreateEventModal from './CreateEventModal';

const DashboardNavbar: React.FC = () => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <nav className={`
        sticky top-0 z-40 backdrop-blur-lg transition-all duration-300
        ${isDark 
          ? 'bg-white/10 border-b border-white/20' 
          : 'bg-black/10 border-b border-black/20'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
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

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`
                    flex items-center space-x-2 p-2 rounded-full transition-colors duration-200
                    ${isDark 
                      ? 'hover:bg-white/10 text-white' 
                      : 'hover:bg-black/10 text-gray-800'
                    }
                  `}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className={`
                    hidden sm:inline transition-colors duration-300
                    ${isDark ? 'text-white' : 'text-gray-800'}
                  `}>
                    {user?.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className={`
                    absolute right-0 mt-2 w-48 backdrop-blur-lg rounded-xl shadow-lg transition-all duration-200
                    ${isDark 
                      ? 'bg-white/10 border border-white/20' 
                      : 'bg-black/10 border border-black/20'
                    }
                  `}>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className={`
                          w-full flex items-center space-x-2 px-4 py-2 text-left transition-colors duration-200
                          ${isDark 
                            ? 'text-white/90 hover:bg-white/10' 
                            : 'text-gray-700 hover:bg-black/10'
                          }
                        `}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CreateEventModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
};

export default DashboardNavbar;