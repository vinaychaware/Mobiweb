import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, ChevronDown } from 'lucide-react';

export default function Navbar({ onOpenEnroll }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Active section detection
      const sections = ['home', 'about', 'programs', 'workshops', 'audience', 'portal', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home',      href: '#home' },
    { name: 'About Us',  href: '#about' },
    { name: 'Programs',  href: '#programs' },
    { name: 'Workshops', href: '#workshops' },
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow duration-300">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-baseline">
              MOBIWEB<span className="text-brand-cyan font-normal text-base ml-1">GLOBAL</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
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

          {/* Enroll CTA */}
          <div className="hidden md:flex items-center">
            <button
              id="nav-enroll-btn"
              onClick={onOpenEnroll}
              className="px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Enroll Now →
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
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
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left text-gray-300 hover:text-white hover:bg-white/5 py-2.5 px-3 rounded-lg font-medium text-base tracking-wide transition-colors cursor-pointer"
            >
              {link.name}
            </button>
          ))}
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
