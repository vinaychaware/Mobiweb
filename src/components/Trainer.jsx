import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Megaphone, 
  Video, 
  MapPin, 
  Cpu 
} from 'lucide-react';

const workshops = [
  {
    type: 'In-Person Lab',
    icon: <MapPin className="w-3.5 h-3.5" />,
    image: '/workshop_pbcoe_nagpur.jpg',
    title: 'Advanced IT Skills Training at PBCOE Nagpur',
    description: 'Conducting joint certification training on modern software engineering paradigms in partnership with ICT Academy and Redington Foundation.',
  },
  {
    type: 'Hands-on Lab',
    icon: <Cpu className="w-3.5 h-3.5" />,
    image: '/workshop_fullstack.jpg',
    title: 'Practical Full-Stack Web Development Bootcamps',
    description: 'Interactive classroom sessions focused on frontend technologies, database schemas, and building deployable applications.',
  },
  {
    type: 'Workshop',
    icon: <Cpu className="w-3.5 h-3.5" />,
    image: '/workshop_ml_integration.jpg',
    title: 'Machine Learning & AI Integration Seminars',
    description: 'Teaching students the mathematical principles of neural networks and hands-on integration using modern frameworks.',
  },
  {
    type: 'Seminar',
    icon: <Video className="w-3.5 h-3.5" />,
    image: '/workshop_vr_skitm.jpg',
    title: 'Virtual Reality & Emerging Technologies Seminar',
    description: 'A seminar on the role of VR and AR in modern industrial systems and learning environments at SKITM Indore.',
  },
  {
    type: 'Interactive Workshop',
    icon: <Cpu className="w-3.5 h-3.5" />,
    image: '/workshop_iot_skitm.jpg',
    title: 'IoT & Embedded Systems Lab at SKITM',
    description: 'Hands-on laboratory sessions introducing students to hardware assembly, microcontrollers, and real-time firmware coding.',
  },
  {
    type: 'Interactive Seminar',
    icon: <Cpu className="w-3.5 h-3.5" />,
    image: '/workshop_python_bootcamp.jpg',
    title: 'Advanced Python & AI Bootcamps',
    description: 'Weekend group session on algorithmic problem solving, clean code architecture, and software design principles.',
  },
  {
    type: 'Webinar',
    icon: <Video className="w-3.5 h-3.5" />,
    image: '/workshop_nlp_masterclass.jpg',
    title: 'Natural Language Processing (NLP) Masterclass',
    description: 'Online webinar describing text processing models, neural architectures (Transformers), and building sentiment analyzers.',
  },
  {
    type: 'Online Webinar',
    icon: <Video className="w-3.5 h-3.5" />,
    image: '/workshop_remote_internship.jpg',
    title: 'Remote Software Development Internships',
    description: 'Interactive online sync calls where interns demo features, review code patterns, and learn Agile team dynamics.',
  },
  {
    type: 'University Workshop',
    icon: <MapPin className="w-3.5 h-3.5" />,
    image: '/workshop_iit_indore.jpg',
    title: 'Hands-on AI Workshop at IIT Indore',
    description: 'Conducted in collaboration with Google Developer Group at Maitreyi Seminar Hall, teaching core neural networks and deep learning.',
  },
  {
    type: 'Specialized Seminar',
    icon: <Cpu className="w-3.5 h-3.5" />,
    image: '/workshop_rag_demo.jpg',
    title: 'AI & YouTube Summarizer Project Demo',
    description: 'Live deployment walkthrough showing students how to host modern RAG (Retrieval-Augmented Generation) apps on cloud servers.',
  }
];

export default function Trainer() {
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const isHovered = useRef(false);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      
      const handleMouseEnter = () => { isHovered.current = true; };
      const handleMouseLeave = () => { isHovered.current = false; };
      
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      
      // Run once
      checkScroll();
      window.addEventListener('resize', checkScroll);

      const interval = setInterval(() => {
        if (isHovered.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = el;
        const card = el.firstElementChild;
        const cardWidth = card ? card.clientWidth + 24 : 380;
        
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }, 4000);

      return () => {
        if (el) {
          el.removeEventListener('scroll', checkScroll);
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        }
        window.removeEventListener('resize', checkScroll);
        clearInterval(interval);
      };
    }
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      const card = el.firstElementChild;
      const cardWidth = card ? card.clientWidth + 24 : 380;
      el.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="trainer" className="py-24 relative overflow-hidden bg-slate-950/20" ref={sectionRef}>
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* UPPER PART: Trainer Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Left Column: Portrait & Badges */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            {/* Soft decorative glow behind the image frame */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 opacity-20 blur-lg" />
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-square bg-slate-900 group">
              <img 
                src="/soham_sharma.png" 
                alt="Soham Sharma" 
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlapping Badges on bottom-left */}
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2.5 z-20">
                <span className="backdrop-blur-md bg-slate-900/70 border border-white/10 text-white font-medium text-xs rounded-full px-3.5 py-1.5 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>AI Agents</span>
                </span>
                <span className="backdrop-blur-md bg-slate-900/70 border border-white/10 text-white font-medium text-xs rounded-full px-3.5 py-1.5 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>AI Automation</span>
                </span>
                <span className="backdrop-blur-md bg-slate-900/70 border border-white/10 text-white font-medium text-xs rounded-full px-3.5 py-1.5 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>LangChain</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div>
              <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-none">
                Soham <span className="gradient-text-cyan-indigo font-black">Sharma</span>
              </h2>
              
              <div className="flex items-center space-x-2.5 mt-3 text-cyan-400">
                <GraduationCap className="w-5 h-5 flex-shrink-0" />
                <span className="font-heading font-semibold text-lg tracking-wide">
                  Founder & Director of Botmartz AI Solutions Pvt. Ltd.
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed font-light">
              Results-driven Tech Leader, Founder, and AI Product Manager with over 8 years in the IT industry. Specialized in building autonomous AI systems, custom agents, and workflow automation. Having successfully trained over 3,000 students and professionals in practical AI tools and frameworks, I bridge the gap between cutting-edge technical innovation and business value.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#programs"
                className="px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer hover:scale-105 active:scale-95 text-center"
              >
                <span>View Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              
              <a
                href="https://www.linkedin.com/in/soham-sharma/"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide text-gray-300 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-500 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 text-center"
              >
                <span>Connect on LinkedIn</span>
                <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>

            {/* Subtle Alert notice card */}
            <div className="glass-card rounded-xl p-4.5 border-slate-800/60 bg-gradient-to-r from-cyan-500/5 to-indigo-500/5 flex items-center space-x-3.5 text-left">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
                <Megaphone className="w-5 h-5 flex-shrink-0 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-widest block font-bold">Latest Update</span>
                <p className="text-white text-sm font-semibold mt-0.5">
                  Currently leading advanced cohorts on building <span className="text-cyan-400">Agentic Workflows and AI Automation</span>.
                </p>
              </div>
            </div>

          </motion.div>
        </div>

        {/* LOWER PART: Previous Lectures & Workshops */}
        <div className="space-y-8">
          
          {/* Header Row with Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4">
            <div className="text-left">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Previous Lectures & Workshops
              </h3>
              <p className="text-gray-400 text-sm sm:text-base font-light mt-1.5">
                Explore past sessions and hands-on laboratory work.
              </p>
            </div>
            
            {/* Slider Navigation Buttons */}
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollLeft 
                    ? 'border-slate-700 bg-slate-900/60 text-white hover:border-cyan-500 hover:text-cyan-400 cursor-pointer' 
                    : 'border-slate-850 text-gray-600 cursor-not-allowed opacity-50'
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollRight 
                    ? 'border-slate-700 bg-slate-900/60 text-white hover:border-cyan-500 hover:text-cyan-400 cursor-pointer' 
                    : 'border-slate-850 text-gray-600 cursor-not-allowed opacity-50'
                }`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Workshop Cards Slider */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {workshops.map((w, idx) => (
              <div 
                key={idx}
                className="w-full sm:w-[360px] flex-shrink-0 snap-start glass-card rounded-2xl overflow-hidden border-slate-850 hover:border-cyan-500/25 transition-all duration-300 group"
              >
                {/* Image Panel */}
                <div className="relative h-48 overflow-hidden bg-slate-900 border-b border-slate-850/50">
                  <img 
                    src={w.image} 
                    alt={w.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info Content */}
                <div className="p-6 space-y-3.5 text-left">
                  <h4 className="font-heading text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {w.title}
                  </h4>
                  <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-3">
                    {w.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
