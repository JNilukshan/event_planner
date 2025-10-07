import React, { useState } from 'react';
import { Calendar, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  onSignupClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 backdrop-blur-lg transition-all duration-300
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className={`
                transition-colors duration-200
                ${isDark 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}>
                Home
              </a>
              <a href="#about" className={`
                transition-colors duration-200
                ${isDark 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}>
                About
              </a>
              <ThemeToggle />
              <button
                onClick={() => setIsLoginOpen(true)}
                className={`
                  transition-colors duration-200
                  ${isDark 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                  }
                `}
              >
                Login
              </button>
              <button
                onClick={onSignupClick}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`
                    p-2 transition-colors duration-200
                    ${isDark ? 'text-white' : 'text-gray-800'}
                  `}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`
            md:hidden backdrop-blur-lg transition-all duration-300
            ${isDark 
              ? 'bg-white/10 border-t border-white/20' 
              : 'bg-black/10 border-t border-black/20'
            }
          `}>
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a
                href="#home"
                className={`
                  block px-3 py-2 transition-colors duration-200
                  ${isDark 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#about"
                className={`
                  block px-3 py-2 transition-colors duration-200
                  ${isDark 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <button
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMenuOpen(false);
                }}
                className={`
                  block w-full text-left px-3 py-2 transition-colors duration-200
                  ${isDark 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-gray-700 hover:text-gray-900'
                  }
                `}
              >
                Login
              </button>
              <button
                onClick={() => {
                  onSignupClick();
                  setIsMenuOpen(false);
                }}
                className="block w-full mt-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;