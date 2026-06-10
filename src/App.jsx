import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Audience from './components/Audience';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import StudentPortal from './components/StudentPortal';
import Footer from './components/Footer';
import EnrollmentForm from './components/EnrollmentForm';
import { ToastProvider } from './components/Toast';
import { WhatsAppFAB, ScrollToTop } from './components/FloatingActions';

export default function App() {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [prefilledProgram, setPrefilledProgram] = useState('');

  const handleOpenEnroll = (programName = '') => {
    setPrefilledProgram(typeof programName === 'string' ? programName : '');
    setIsEnrollOpen(true);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-primary-950 font-sans text-gray-100 flex flex-col selection:bg-brand-cyan/20 selection:text-brand-cyan">

        {/* Sticky Navigation */}
        <Navbar onOpenEnroll={handleOpenEnroll} />

        {/* Page Sections */}
        <main className="flex-grow">
          <Hero onOpenEnroll={handleOpenEnroll} />

          <div className="section-divider" />
          <About />

          <div className="section-divider" />
          <Programs onOpenEnroll={handleOpenEnroll} />

          <div className="section-divider" />
          <Audience onOpenEnroll={handleOpenEnroll} />

          <div className="section-divider" />
          <Testimonials />

          <div className="section-divider" />
          <FAQ onOpenEnroll={handleOpenEnroll} />

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
