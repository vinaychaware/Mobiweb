import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket } from 'lucide-react';

export default function Navbar({ onOpenEnroll }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Workshops', href: '#workshops' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center">
              MOBIWEB<span className="text-brand-cyan font-normal text-lg ml-1">GLOBAL</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOpenEnroll}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm tracking-wide text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-cyan-500/10 active:scale-95 cursor-pointer"
            >
              Enroll Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full glass-nav transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 py-4 shadow-xl' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-gray-300 hover:text-white py-2 font-medium text-base tracking-wide"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenEnroll();
            }}
            className="w-full mt-2 px-5 py-3 rounded-lg font-semibold text-base tracking-wide text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 transition-colors duration-200 shadow-md cursor-pointer text-center"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </nav>
  );
}
