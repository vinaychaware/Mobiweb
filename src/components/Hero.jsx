import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Award, Layers } from 'lucide-react';

export default function Hero({ onOpenEnroll }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url('/tech_hero_bg.png')` }}
      />
      {/* Sleek Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/90 to-primary-950" />
      
      {/* Glowing accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse-slow" />

      {/* Tech Grid Lines Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-700/50 rounded-full px-4 py-1.5 text-xs sm:text-sm text-cyan-400 font-medium tracking-wider uppercase backdrop-blur-md">
            <Award className="w-4 h-4" />
            <span>Bridging Academia & Industry</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants} 
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-none"
          >
            Empowering Future Engineers with{' '}
            <span className="gradient-text-cyan-indigo animate-glow">
              Industry-Ready Skills
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants} 
            className="text-gray-300 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
          >
            Join expert-led training programs, workshops, internships, and webinars conducted by Mobiweb Global Solutions. Built to accelerate your engineering career.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4"
          >
            <button
              onClick={onOpenEnroll}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 transition-all duration-300 shadow-lg glow-teal hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#programs"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold tracking-wide text-gray-300 bg-slate-900/60 border border-slate-700 hover:text-white hover:bg-slate-800/80 transition-all duration-300 hover:border-slate-500 flex items-center justify-center space-x-2 backdrop-blur-md cursor-pointer"
            >
              <span>Explore Programs</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </a>
          </motion.div>

          {/* Feature Badges */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 text-left"
          >
            {[
              { label: 'Interactive Hands-on Labs', desc: '100% Practical Learning' },
              { label: 'Industry Expert Mentors', desc: 'Guided by Professionals' },
              { label: 'Assured Certification', desc: 'Verify your Credentials' },
              { label: 'Placement Assistance', desc: 'Resume & Interview Prep' }
            ].map((feat, i) => (
              <div key={i} className="glass-card p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300">
                <span className="text-brand-cyan text-sm font-semibold tracking-wide block">{feat.label}</span>
                <span className="text-gray-400 text-xs mt-1 block">{feat.desc}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1.5 opacity-60">
        <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll Down</span>
        <div className="w-6 h-10 border-2 border-slate-600 rounded-full p-1 flex justify-center">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-brand-cyan rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
