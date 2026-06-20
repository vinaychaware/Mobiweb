import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ onOpenEnroll, theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Page bottom detection to force Contact link active
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      // Active section detection using absolute document-relative offsets
      const sections = ['home', 'about', 'programs', 'workshops', 'trainer', 'audience', 'blogs', 'portal', 'contact'];
      const scrollPosition = window.scrollY + 140; // Offset threshold for highlighting

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const absoluteTop = rect.top + window.scrollY;
          if (scrollPosition >= absoluteTop) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home',      href: '#home' },
    { name: 'About Us',  href: '#about' },
    { name: 'Programs',  href: '#programs' },
    { name: 'Workshops', href: '#workshops' },
    { name: 'Mentors',   href: '#trainer' },
    { name: 'Blogs',     href: '#blogs' },
    { name: 'Contact',   href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3 shadow-xl shadow-black/20' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Logo */}
          <a href="#home" onClick={() => handleNavClick('#home')} className="flex-shrink-0 flex items-center space-x-2.5 cursor-pointer group">
            <img 
              src="/logo.jpg" 
              alt="Mobiweb Logo" 
              className="w-9 h-9 rounded-xl shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/20 object-cover transition-shadow duration-300"
            />
            <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-baseline">
              MOBIWEB<span className="text-brand-cyan font-normal text-base ml-1">GLOBAL</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const targetId = link.href.replace('#', '');
              let isActive = activeSection === targetId;
              
              // Map sub-sections to their parent navigation link
              if (targetId === 'programs') {
                isActive = ['programs', 'audience', 'portal'].includes(activeSection);
              }
              
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white bg-white/5'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="block h-0.5 w-full bg-brand-cyan rounded-full mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Theme Switcher & Enroll CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-800 text-gray-400 hover:text-white bg-slate-900/40 hover:bg-slate-900 transition-colors cursor-pointer focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </button>
            <button
              id="nav-enroll-btn"
              onClick={onOpenEnroll}
              className="px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Enroll Now →
            </button>
          </div>

          {/* Mobile Theme Switcher & Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden absolute top-full left-0 w-full glass-nav transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100 py-4 shadow-2xl' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="px-4 space-y-1">
          {navLinks.map((link) => {
            const targetId = link.href.replace('#', '');
            let isActive = activeSection === targetId;
            if (targetId === 'programs') {
              isActive = ['programs', 'audience', 'portal'].includes(activeSection);
            }
            return (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className={`block w-full text-left py-2.5 px-3 rounded-lg font-medium text-base tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-500/10 font-semibold border-l-2 border-cyan-400 rounded-l-none'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </button>
            );
          })}
          <button
            id="mobile-enroll-btn"
            onClick={() => { setIsOpen(false); onOpenEnroll(); }}
            className="w-full mt-3 px-5 py-3.5 rounded-xl font-bold text-base tracking-wide text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 transition-colors duration-200 shadow-md cursor-pointer text-center"
          >
            Enroll Now →
          </button>
        </div>
      </div>
    </nav>
  );
}
