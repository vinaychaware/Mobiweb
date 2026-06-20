import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Trainer from './components/Trainer';
import Audience from './components/Audience';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Blogs from './components/Blogs';
import StudentPortal from './components/StudentPortal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import EnrollmentForm from './components/EnrollmentForm';
import { ToastProvider } from './components/Toast';
import { WhatsAppFAB, ScrollToTop } from './components/FloatingActions';

export default function App() {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [prefilledProgram, setPrefilledProgram] = useState('');
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      
      // If we switch views, scroll to top automatically
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenEnroll = (programName = '') => {
    setPrefilledProgram(typeof programName === 'string' ? programName : '');
    setIsEnrollOpen(true);
  };

  // Hash route matching for admin dashboard
  if (currentHash === '#admin') {
    return (
      <ToastProvider>
        <AdminDashboard theme={theme} toggleTheme={toggleTheme} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-primary-950 font-sans text-gray-100 flex flex-col selection:bg-brand-cyan/20 selection:text-brand-cyan">

        {/* Sticky Navigation */}
        <Navbar onOpenEnroll={handleOpenEnroll} theme={theme} toggleTheme={toggleTheme} />

        {/* Page Sections */}
        <main className="flex-grow">
          <Hero onOpenEnroll={handleOpenEnroll} />

          <div className="section-divider" />
          <About />

          <div className="section-divider" />
          <Programs onOpenEnroll={handleOpenEnroll} />

          <div className="section-divider" />
          <Trainer />

          <div className="section-divider" />
          <Audience onOpenEnroll={handleOpenEnroll} />

          <div className="section-divider" />
          <Testimonials />

          <div className="section-divider" />
          <FAQ onOpenEnroll={handleOpenEnroll} />

          <div className="section-divider" />
          <Blogs />

          <div className="section-divider" />
          <StudentPortal />
        </main>

        {/* Footer & Contact */}
        <Footer />

        {/* Global Modal: Enrollment Form */}
        <EnrollmentForm
          isOpen={isEnrollOpen}
          onClose={() => setIsEnrollOpen(false)}
          prefilledProgram={prefilledProgram}
        />

        {/* Floating Action Buttons */}
        <WhatsAppFAB />
        <ScrollToTop />

      </div>
    </ToastProvider>
  );
}
