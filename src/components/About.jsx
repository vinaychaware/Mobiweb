import React from 'react';
import { ShieldCheck, Award, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const values = [
    {
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      title: "Expert Mentors",
      description: "Learn from industry developers and technical consultants who have decades of collective experience."
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-400" />,
      title: "Hands-on Labs",
      description: "Step away from standard textbooks. Build real products in our intensive laboratory environments."
    },
    {
      icon: <Award className="w-6 h-6 text-purple-400" />,
      title: "Industry Aligned",
      description: "Our curricula are co-designed with corporate engineering teams to ensure your skills are highly marketable."
    }
  ];

  const stats = [
    { count: "10K+", label: "Engineers Trained" },
    { count: "50+", label: "College Partners" },
    { count: "95%", label: "Placement Rate" },
    { count: "100%", label: "Hands-on Work" }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-slate-950/60 to-primary-950" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <span>Our Mission</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Bridging the Divide Between{' '}
              <span className="gradient-text-cyan-indigo font-extrabold">Academia and Industry</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              Mobiweb Global Solutions was founded on a simple premise: engineering graduates deserve practical, hands-on exposure that directly qualifies them for corporate roles.
            </p>
            <p className="text-gray-400 leading-relaxed font-light">
              We design specialized workshops, internships, and intensive training bootcamps in collaboration with engineering colleges. By emphasizing project-centered curricula over passive learning, we empower the next generation of developers and software engineers to add business value from day one.
            </p>

            {/* Core Values Rows */}
            <div className="space-y-6 pt-6">
              {values.map((val, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    {val.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-white">{val.title}</h3>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed font-light">{val.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Metrics / Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 opacity-20 blur-xl animate-pulse-slow" />
            <div className="glass-card rounded-2xl p-8 border-slate-800 relative z-10 space-y-8">
              <h3 className="font-heading text-xl font-bold text-center text-white pb-4 border-b border-slate-800">
                Mobiweb by the Numbers
              </h3>
              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <span className="block font-heading text-3xl sm:text-4xl font-extrabold text-white bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                      {stat.count}
                    </span>
                    <span className="block text-gray-400 text-xs sm:text-sm font-medium tracking-wide mt-2">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Verified Trust Statement */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex items-center space-x-3 text-left">
                <ShieldCheck className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="text-white text-xs sm:text-sm font-semibold block">University Accredited Programs</span>
                  <span className="text-gray-400 text-xs block font-light">All training modules are co-certified and compliant with college accreditation standards.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
