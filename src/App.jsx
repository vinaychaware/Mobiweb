import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Audience from './components/Audience';
import StudentPortal from './components/StudentPortal';
import Footer from './components/Footer';
import EnrollmentForm from './components/EnrollmentForm';

export default function App() {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [prefilledProgram, setPrefilledProgram] = useState('');

  const handleOpenEnroll = (programName = '') => {
    // Check if program name is string or standard event
    if (typeof programName === 'string') {
      setPrefilledProgram(programName);
    } else {
      setPrefilledProgram('');
    }
    setIsEnrollOpen(true);
  };

  return (
    <div className="min-h-screen bg-primary-950 font-sans text-gray-100 flex flex-col justify-between selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* Sticky Header */}
      <Navbar onOpenEnroll={handleOpenEnroll} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Banner */}
        <Hero onOpenEnroll={handleOpenEnroll} />

        {/* Mission and Value Propositions */}
        <About />

        {/* Grid of Course Offerings */}
        <Programs onOpenEnroll={handleOpenEnroll} />

        {/* Audience Specific Segment Cards */}
        <Audience onOpenEnroll={handleOpenEnroll} />

        {/* Premium Interactive Student Portal Prototype */}
        <StudentPortal />
      </main>

      {/* Interactive Footer & Contact Lead Capture Form */}
      <Footer />

      {/* Shared Application Modal Overlay */}
      <EnrollmentForm 
        isOpen={isEnrollOpen} 
        onClose={() => setIsEnrollOpen(false)} 
        prefilledProgram={prefilledProgram}
      />
    </div>
  );
}
