import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-full transition-all duration-300 transform hover:scale-110
        ${isDark 
          ? 'bg-white/10 hover:bg-white/20 text-white' 
          : 'bg-gray-800/10 hover:bg-gray-800/20 text-gray-800'
        }
      `}
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`
            absolute inset-0 w-6 h-6 transition-all duration-300 transform
            ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `}
        />
        <Moon 
          className={`
            absolute inset-0 w-6 h-6 transition-all duration-300 transform
            ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;