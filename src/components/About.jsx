import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Award, Zap, Users } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

// ─── Animated Counter Hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const num = parseFloat(target);
    const frame = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(frame);
      else setCount(num);
    };
    requestAnimationFrame(frame);
  }, [start, target, duration]);
  return count;
}

// ─── Stat Counter Component ───────────────────────────────────────────────────
function StatCounter({ count, label, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [inView, delay]);

  const num = useCountUp(count, 1800, started);

  return (
    <div ref={ref} className="text-center">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: delay / 1000 }}
        className="block font-heading text-3xl sm:text-4xl font-extrabold gradient-text-cyan-indigo"
      >
        {num}{suffix}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: (delay + 200) / 1000 }}
        className="block text-gray-400 text-xs sm:text-sm font-medium tracking-wide mt-2"
      >
        {label}
      </motion.span>
    </div>
  );
}

// ─── Main About Component ─────────────────────────────────────────────────────
const values = [
  {
    icon: <Users className="w-6 h-6 text-cyan-400" />,
    title: 'Expert Mentors',
    description: 'Learn from industry developers and technical consultants with decades of collective experience building real products.',
  },
  {
    icon: <Zap className="w-6 h-6 text-indigo-400" />,
    title: 'Hands-on Labs',
    description: 'Step away from passive textbook learning. Build real, deployable products in our intensive laboratory environments.',
  },
  {
    icon: <Award className="w-6 h-6 text-purple-400" />,
    title: 'Industry Aligned',
    description: 'Our curricula are co-designed with corporate engineering teams to ensure your skills are highly marketable.',
  },
];

const stats = [
  { count: 10000, suffix: '+', label: 'Engineers Trained' },
  { count: 50,    suffix: '+', label: 'College Partners' },
  { count: 95,    suffix: '%', label: 'Placement Rate' },
  { count: 100,   suffix: '%', label: 'Hands-on Work' },
];

export default function About() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-24 relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-slate-950/50 to-primary-950" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-left"
          >
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

            {/* Core Values */}
            <div className="space-y-5 pt-4">
              {values.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
                    {val.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-white">{val.title}</h3>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed font-light">{val.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Animated Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 opacity-15 blur-xl animate-pulse-slow" />
            <div className="glass-card rounded-2xl p-8 border-slate-800/60 relative z-10 space-y-8">
              <h3 className="font-heading text-xl font-bold text-center text-white pb-4 border-b border-slate-800">
                Mobiweb by the Numbers
              </h3>

              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, idx) => (
                  <StatCounter
                    key={idx}
                    count={stat.count}
                    suffix={stat.suffix}
                    label={stat.label}
                    delay={idx * 150}
                  />
                ))}
              </div>

              {/* Trust Badge */}
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 flex items-center space-x-3 text-left">
                <ShieldCheck className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="text-white text-sm font-semibold block">University Accredited Programs</span>
                  <span className="text-gray-400 text-xs block font-light mt-0.5">
                    All training modules are co-certified and compliant with NAAC / NBA accreditation standards.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
