import React from 'react';
import { UserCheck, School, GraduationCap, ArrowRight } from 'lucide-react';

export default function Audience({ onOpenEnroll }) {
  const segments = [
    {
      icon: <UserCheck className="w-8 h-8 text-cyan-400" />,
      title: 'For Engineering Students',
      subtitle: 'Build Real Portfolios',
      bullets: [
        'Gain structured technical experience that textbooks miss.',
        'Create production-grade code repositories to highlight on GitHub.',
        'Collaborate in small sprint teams to learn agile team dynamics.',
        'Master tools in high demand like Docker, GitHub, and Cloud platforms.'
      ],
      ctaText: 'Start Skill Building',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      icon: <School className="w-8 h-8 text-indigo-400" />,
      title: 'For Faculty & Colleges',
      subtitle: 'Accreditation & Quality',
      bullets: [
        'Close academic gaps with standard corporate training curricula.',
        'Obtain verified evaluation reports for NAAC / NBA audit checks.',
        'Organize high-turnout campus workshops on modern topics.',
        'Leverage expert guest lectures to motivate engineering cohorts.'
      ],
      ctaText: 'Request Institution Tie-up',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-purple-400" />,
      title: 'For Fresh Graduates',
      subtitle: 'Accelerated Placement',
      bullets: [
        'Tune your practical capabilities to pass technical assessments.',
        'Undergo mock review panels focused on live coding problems.',
        'Polish resume bullet points with validated industrial internship work.',
        'Access referral pipelines to leading software consultancies.'
      ],
      ctaText: 'Achieve Job Readiness',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section id="audience" className="py-24 relative overflow-hidden bg-slate-950/20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-4">
            <span>Tailored Benefits</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Designed for the{' '}
            <span className="gradient-text-purple-pink font-extrabold">Engineering Ecosystem</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 font-light">
            We align with your specific objectives. Explore how Mobiweb adds direct value to your career or institution.
          </p>
        </div>

        {/* Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {segments.map((seg, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-2xl p-8 border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative overflow-hidden"
            >
              {/* Radial background glowing highlight */}
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-slate-800/20 blur-2xl" />

              <div>
                {/* Header Icon + Title */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    {seg.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white">{seg.title}</h3>
                    <span className="text-xs text-cyan-400 font-medium tracking-wide uppercase">{seg.subtitle}</span>
                  </div>
                </div>

                {/* Bullet Points */}
                <ul className="mt-8 space-y-4 text-left">
                  {seg.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start space-x-3 text-sm text-gray-300 font-light">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Trigger */}
              <div className="pt-8 mt-8 border-t border-slate-800/60">
                <button
                  onClick={() => onOpenEnroll(seg.title)}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r ${seg.color} shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer`}
                >
                  <span>{seg.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
