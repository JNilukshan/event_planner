import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('admin@eventmaster.com');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      onClose();
      // The app will automatically redirect to dashboard via App.tsx
    } else {
      alert('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`
        w-full max-w-sm backdrop-blur-lg rounded-2xl p-4 sm:p-6 transition-all duration-300 max-h-[90vh] overflow-y-auto
        ${isDark 
          ? 'bg-white/10 border border-white/20' 
          : 'bg-black/10 border border-black/20'
        }
      `}>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className={`
            text-xl sm:text-2xl font-bold transition-colors duration-300
            ${isDark ? 'text-white' : 'text-gray-800'}
          `}>
            Welcome Back
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

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className={`
              block text-xs sm:text-sm font-medium mb-1 sm:mb-2 transition-colors duration-300
              ${isDark ? 'text-white/90' : 'text-gray-700'}
            `}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`
                absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base
                  ${isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                    : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                  }
                `}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className={`
              block text-xs sm:text-sm font-medium mb-1 sm:mb-2 transition-colors duration-300
              ${isDark ? 'text-white/90' : 'text-gray-700'}
            `}>
              Password
            </label>
            <div className="relative">
              <Lock className={`
                absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300
                ${isDark ? 'text-white/60' : 'text-gray-500'}
              `} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base
                  ${isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/60' 
                    : 'bg-black/10 border border-black/20 text-gray-800 placeholder-gray-500'
                  }
                `}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 font-medium text-sm sm:text-base"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className={`
            text-xs sm:text-sm transition-colors duration-300
            ${isDark ? 'text-white/70' : 'text-gray-600'}
          `}>
            Demo credentials are pre-filled above
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;