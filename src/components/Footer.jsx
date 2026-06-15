import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Rocket, CheckCircle2 } from 'lucide-react';
import { submitContactLead } from '../firebase';
import { useToast } from './Toast';

export default function Footer() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [simulated, setSimulated] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email';
    }

    if (!formData.message.trim()) tempErrors.message = 'Message cannot be empty';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await submitContactLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'N/A',
        message: formData.message
      });

      if (result.success) {
        setSuccess(true);
        setSimulated(result.simulated || false);
        setFormData({ name: '', email: '', phone: '', message: '' });
        addToast({
          type: 'success',
          title: 'Message Sent!',
          message: 'We will get back to you as soon as possible.',
        });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Failed to Send',
        message: 'Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="contact" className="relative bg-slate-950 border-t border-slate-900 pt-20 pb-8 overflow-hidden">
      {/* Background radial glowing light */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16 border-b border-slate-900">
          
          {/* Column 1: Info and Socials (5 cols) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center">
                  <Rocket className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  MOBIWEB<span className="text-brand-cyan font-normal text-base ml-1">GLOBAL</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm font-light leading-relaxed max-w-sm">
                Empowering future engineers with industry-ready skills. Leading provider of workshops, university-integrated seminars, and software internships.
              </p>
            </div>

            {/* Address / Contact details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-300 font-light">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>contact@mobiwebglobal.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300 font-light">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300 font-light">
                <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span>Mobiweb Tower, Tech Zone Phase-2, Bangalore, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              {[
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  ), 
                  href: "https://linkedin.com" 
                },
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  ), 
                  href: "https://github.com" 
                },
                { 
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ), 
                  href: "https://x.com" 
                }
              ].map((soc, i) => (
                <a
                  key={i}
                  href={soc.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '#home' },
                { name: 'About Us', href: '#about' },
                { name: 'Programs', href: '#programs' },
                { name: 'Blogs', href: '#blogs' },
                { name: 'Student Portal', href: '#portal' },
                { name: 'Admin Portal', href: '#admin' }
              ].map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm font-light transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">Send Us a Message</h4>
            
            {success ? (
              <div className="glass-card rounded-2xl p-6 border-cyan-500/20 text-center space-y-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-8 h-8 text-cyan-400 mx-auto" />
                <h5 className="text-white text-sm font-semibold">Message Sent Successfully!</h5>
                <p className="text-gray-400 text-xs font-light">We will respond to your email as soon as possible.</p>
                {simulated && (
                  <span className="text-[10px] text-cyan-400 block italic">Demo Mode: Saved in localStorage</span>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-600 transition-colors ${errors.name ? 'border-red-500/50' : 'border-slate-800'}`}
                    />
                    {errors.name && <span className="text-red-400 text-[10px] mt-1 block">{errors.name}</span>}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-600 transition-colors ${errors.email ? 'border-red-500/50' : 'border-slate-800'}`}
                    />
                    {errors.email && <span className="text-red-400 text-[10px] mt-1 block">{errors.email}</span>}
                  </div>
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (Optional)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-600 transition-colors"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Your Message..."
                    className={`w-full bg-slate-900 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-600 transition-colors resize-none ${errors.message ? 'border-red-500/50' : 'border-slate-800'}`}
                  />
                  {errors.message && <span className="text-red-400 text-[10px] mt-1 block">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sub-Footer Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-light">
          <span>&copy; {new Date().getFullYear()} Mobiweb Global Solutions. All rights reserved.</span>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
