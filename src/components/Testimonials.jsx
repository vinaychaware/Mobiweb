import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at TCS',
    college: 'VIT Pune, 2024 Graduate',
    avatar: 'PS',
    color: 'from-cyan-500 to-teal-600',
    rating: 5,
    text: "The MERN Stack bootcamp at Mobiweb was a complete game-changer for me. Within 3 months of completing the internship, I landed a full-time offer at TCS. The hands-on lab sessions and mock interviews were incredibly practical. I would strongly recommend every engineering student to enroll."
  },
  {
    name: 'Rahul Verma',
    role: 'Final Year Student, CSE',
    college: 'MIT Aurangabad',
    avatar: 'RV',
    color: 'from-indigo-500 to-purple-600',
    rating: 5,
    text: "I attended the Docker & DevOps workshop during my 7th semester and it completely transformed how I think about software deployment. The instructors were from the industry and gave us real-world problems to solve — something our college curriculum never did. Worth every minute."
  },
  {
    name: 'Dr. Anjali Patil',
    role: 'HOD, Computer Engineering',
    college: 'SPIT Mumbai',
    avatar: 'AP',
    color: 'from-purple-500 to-pink-600',
    rating: 5,
    text: "We partnered with Mobiweb for our department's skill development initiative. Their training program was excellently aligned with NAAC accreditation requirements, and the faculty engagement was exceptional. Our students showed a 40% improvement in technical placement scores after the program."
  },
  {
    name: 'Kiran Joshi',
    role: 'Junior Developer at Infosys',
    college: 'PICT Pune, 2025 Graduate',
    avatar: 'KJ',
    color: 'from-teal-500 to-cyan-600',
    rating: 5,
    text: "Mobiweb's internship program gave me real sprint experience using Jira, GitHub, and Agile workflows. I had daily standups with senior developers and worked on live client projects. That experience was more valuable than 2 years of college lab work."
  },
  {
    name: 'Sneha Kulkarni',
    role: 'AI/ML Engineer at Wipro',
    college: 'VJTI Mumbai',
    avatar: 'SK',
    color: 'from-orange-500 to-red-500',
    rating: 5,
    text: "The AI/ML with Python training program was comprehensive and well-paced. I went from basic Python knowledge to building and deploying ML models in 8 weeks. The instructors were patient and always available for doubt-solving. Highly recommend for any CSE or IT student."
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const autoRef = useRef(null);

  const startAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 6000);
  };

  useEffect(() => {
    startAuto();
    return () => clearInterval(autoRef.current);
  }, []);

  const go = (dir) => {
    setDirection(dir);
    setCurrent(prev => (prev + dir + testimonials.length) % testimonials.length);
    startAuto();
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-slate-950/40 to-primary-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 text-xs text-yellow-400 font-semibold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            <span>Student Success Stories</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            What Our{' '}
            <span className="gradient-text-gold font-extrabold">Alumni Say</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 font-light max-w-2xl mx-auto">
            Over 10,000 engineers trained. Here's what some of them achieved after Mobiweb programs.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative min-h-[320px] flex items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full"
            >
              <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
                {/* Accent */}
                <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${t.color}`} />

                {/* Quote icon */}
                <Quote className="w-10 h-10 text-indigo-500/30 mb-6" />

                {/* Text */}
                <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-light italic max-w-3xl">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-heading font-bold text-white text-sm flex-shrink-0`}>
                      {t.avatar}
                    </div>
                    <div>
                      <span className="text-white font-semibold block">{t.name}</span>
                      <span className="text-gray-400 text-sm font-light block">{t.role}</span>
                      <span className="text-cyan-400 text-xs font-medium block">{t.college}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center space-x-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            id="testimonial-prev"
            onClick={() => go(-1)}
            className="p-2.5 rounded-xl glass-card border-slate-800 text-gray-400 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); startAuto(); }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === current ? 'w-6 h-2 bg-brand-cyan' : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            id="testimonial-next"
            onClick={() => go(1)}
            className="p-2.5 rounded-xl glass-card border-slate-800 text-gray-400 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
