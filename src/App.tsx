import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import RSVPForm from './components/RSVPForm';
import SignupModal from './components/SignupModal';
import { useTheme } from './contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const { isDark } = useTheme();
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);
  
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
        <Navbar onSignupClick={openSignupModal} />
        <Hero onSignupClick={openSignupModal} />
        <About />
        <Footer />
      </div>
      
      {/* Signup Modal */}
      <SignupModal isOpen={isSignupOpen} onClose={closeSignupModal} />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Dashboard />;
  }
  
  return <LandingPage />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/rsvp/:eventId" element={<RSVPForm />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;