import React, { useState } from 'react';
import { Laptop, Code, GraduationCap, Users2, ShieldAlert, CheckCircle2, ArrowUpRight, X } from 'lucide-react';

export default function Programs({ onOpenEnroll }) {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const programs = [
    {
      id: 'training',
      title: 'College Training Programs',
      badge: 'Full-Semester / Customized',
      icon: <GraduationCap className="w-8 h-8 text-cyan-400" />,
      description: 'Integrated engineering training curriculum running alongside academic semesters, focusing on industry-ready stacks.',
      details: 'Our long-term academic tie-up programs deliver deep technical competency directly inside the college campus.',
      features: [
        'Curriculum mapped to active university credit requirements',
        'Stack: Full-Stack Web Dev (MERN), AI/ML with Python, or cloud infrastructure',
        'Continuous assessments, mid-terms, and final project exhibitions',
        'Accreditation documentation and student performance matrices'
      ],
      duration: '45 to 90 Hours',
      audience: '1st to 3rd Year Engineering Students'
    },
    {
      id: 'workshops',
      title: 'Hands-on Workshops',
      badge: '2 to 3 Days Bootcamps',
      icon: <Code className="w-8 h-8 text-indigo-400" />,
      description: 'Immersive coding sprints and technical bootcamps to build, deploy, and showcase working applications.',
      details: 'Intense, high-impact weekend or boot-camp format events structured around building a single production-ready project.',
      features: [
        'Project: Dockerizing microservices, GitOps pipelines, or UI design with Figma/React',
        '100% practical, zero slide-only lectures',
        'Interactive team hackathons on the final day',
        'Instant digital verified certificate of completion'
      ],
      duration: '16 Hours (Intense)',
      audience: 'Open to All Branches & Streams'
    },
    {
      id: 'internships',
      title: 'Industrial Internships',
      badge: '4 to 12 Weeks',
      icon: <Laptop className="w-8 h-8 text-purple-400" />,
      description: 'Guided corporate internships where students work on client briefs under senior tech mentors.',
      details: 'Bridge the gap from developer to employee. Experience Agile standups, code reviews, and project management tools first-hand.',
      features: [
        'Experience real software lifecycle sprints with Jira and Git',
        'Dual mentorship: Tech leads + Career guidance counsellors',
        'Letters of recommendation for top-performing interns',
        'Guaranteed interview calls with partner recruiters'
      ],
      duration: '1 to 3 Months',
      audience: 'Final & Pre-Final Year Students'
    },
    {
      id: 'webinars',
      title: 'Webinars & Guest Lectures',
      badge: 'Free Live Events',
      icon: <Users2 className="w-8 h-8 text-cyan-400" />,
      description: 'Expert talks on emerging technologies, career roadmaps, and resume-building strategies.',
      details: 'Connect with technical experts from top MNCs. Discover what skills are in demand and how to prepare for interviews.',
      features: [
        'Topic-centric sessions (e.g. AI-driven development, entering Web3, cloud careers)',
        'Live Q&A with tech architects and talent acquisition managers',
        'Access to webinars library, slides, and code templates',
        'Network with peer students across different states'
      ],
      duration: '2 Hours Sessions',
      audience: 'Students, Faculty & Fresh Graduates'
    }
  ];

  return (
    <section id="programs" className="py-24 relative overflow-hidden bg-slate-900/30 border-y border-slate-900/60">
      {/* Workshops anchor for nav link */}
      <div id="workshops" className="absolute -top-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-4">
            <span>Specialized Offerings</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Our Custom-Tailored{' '}
            <span className="gradient-text-cyan-indigo font-extrabold">Training Programs</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 font-light">
            Whether you are a student wanting practical coding, a faculty coordinator seeking quality academic tie-ups, or a graduate seeking jobs, we have a pathway.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((prog) => (
            <div 
              key={prog.id}
              className="glass-card rounded-2xl p-8 border-slate-800 flex flex-col justify-between glass-card-hover transition-all duration-300 relative group"
            >
              {/* Corner Accent Line */}
              <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-t-2xl" />

              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                    {prog.icon}
                  </div>
                  <span className="bg-slate-900 text-cyan-400 border border-slate-800/80 rounded-full px-3.5 py-1 text-xs font-semibold tracking-wider">
                    {prog.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-heading text-2xl font-bold text-white mt-6 group-hover:text-cyan-400 transition-colors">
                  {prog.title}
                </h3>
                <p className="text-gray-400 text-base mt-4 leading-relaxed font-light">
                  {prog.description}
                </p>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-800/60">
                <button 
                  onClick={() => setSelectedProgram(prog)}
                  className="text-white hover:text-cyan-400 text-sm font-semibold tracking-wider flex items-center space-x-1 cursor-pointer transition-colors duration-200"
                >
                  <span>Learn Details</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenEnroll(prog.title)}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-gray-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Enroll directly
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl glass-modal rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header Banner */}
            <div className="bg-gradient-to-r from-cyan-900/40 to-indigo-950/40 p-6 border-b border-slate-800 flex justify-between items-start">
              <div>
                <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">{selectedProgram.badge}</span>
                <h3 className="font-heading text-2xl font-bold text-white mt-1">{selectedProgram.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Overview</h4>
                <p className="text-gray-300 mt-2 font-light leading-relaxed">{selectedProgram.details}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Key Learning Modules</h4>
                <ul className="mt-3 space-y-2.5">
                  {selectedProgram.features.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2 text-gray-300 font-light text-sm">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/60">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                  <span className="block text-white text-sm font-semibold mt-1">{selectedProgram.duration}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Eligibility</span>
                  <span className="block text-white text-sm font-semibold mt-1">{selectedProgram.audience}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 flex justify-end space-x-4">
              <button 
                onClick={() => setSelectedProgram(null)}
                className="px-5 py-2.5 rounded-lg border border-slate-800 text-sm font-semibold text-gray-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Details
              </button>
              <button 
                onClick={() => {
                  setSelectedProgram(null);
                  onOpenEnroll(selectedProgram.title);
                }}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-bold text-sm text-white shadow-lg shadow-cyan-500/10 cursor-pointer"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
