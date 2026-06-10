import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitEnrollment } from '../firebase';

export default function EnrollmentForm({ isOpen, onClose, prefilledProgram = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: 'Student',
    program: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [simulated, setSimulated] = useState(false);

  // Sync prefilled program when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        program: prefilledProgram || 'College Training Programs'
      }));
      setErrors({});
      setSubmitStatus(null);
      setSimulated(false);
    }
  }, [isOpen, prefilledProgram]);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    
    // Email validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address';
    }

    // Phone validate
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-()]/g, ''))) {
      tempErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!formData.program) tempErrors.program = 'Please select a program';

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
      const result = await submitEnrollment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/[\s-()]/g, ''),
        userType: formData.userType,
        program: formData.program,
      });

      if (result.success) {
        setSubmitStatus('success');
        setSimulated(result.simulated || false);
        
        // Trigger premium celebration confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Clear inputs on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          userType: 'Student',
          program: '',
        });
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg glass-modal rounded-2xl overflow-hidden shadow-2xl relative border-slate-700 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative Top Accent line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitStatus === 'success' ? (
          /* SUCCESS SCREEN */
          <div className="p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-400/30 rounded-full flex items-center justify-center mx-auto text-cyan-400 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-2xl font-bold text-white">Enrollment Request Received!</h3>
              <p className="text-gray-300 text-sm font-light leading-relaxed max-w-sm mx-auto">
                Thank you for choosing Mobiweb. A technical coordinator will reach out to your registered email and phone number within 24 hours.
              </p>
            </div>
            {simulated && (
              <div className="bg-slate-900 border border-cyan-500/20 rounded-xl p-3 text-xs text-cyan-300 max-w-xs mx-auto">
                <Sparkles className="w-4 h-4 inline mr-1.5 align-text-bottom text-cyan-400" />
                Demo Mode: Data saved locally in localStorage.
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 px-5 rounded-xl font-bold text-sm tracking-wide text-white bg-slate-800 border border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer"
            >
              Back to Landing Page
            </button>
          </div>
        ) : (
          /* REGULAR FORM SCREEN */
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="text-center">
              <h3 className="font-heading text-2xl font-bold text-white">Application Form</h3>
              <p className="text-gray-400 text-sm font-light mt-1.5">Submit details to get started with Mobiweb programs</p>
            </div>

            {submitStatus === 'error' && (
              <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3.5 flex items-start space-x-2.5 text-red-200 text-xs">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span>An error occurred while submitting. Please check your network and try again.</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-600 transition-colors ${errors.name ? 'border-red-500/50' : 'border-slate-800'}`}
                />
                {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name}</span>}
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-600 transition-colors ${errors.email ? 'border-red-500/50' : 'border-slate-800'}`}
                  />
                  {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-600 transition-colors ${errors.phone ? 'border-red-500/50' : 'border-slate-800'}`}
                  />
                  {errors.phone && <span className="text-red-400 text-xs mt-1 block">{errors.phone}</span>}
                </div>
              </div>

              {/* User Type & Program grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">User Category</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Student">Student (Undergraduate)</option>
                    <option value="Final-Year Student">Final-Year Student</option>
                    <option value="Faculty Coordinator">Faculty Coordinator</option>
                    <option value="Fresh Graduate">Fresh Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Program of Interest</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="College Training Programs">College Training Programs</option>
                    <option value="Hands-on Workshops">Hands-on Workshops</option>
                    <option value="Industrial Internships">Industrial Internships</option>
                    <option value="Webinars & Guest Lectures">Webinars & Guest Lectures</option>
                  </select>
                  {errors.program && <span className="text-red-400 text-xs mt-1 block">{errors.program}</span>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center space-x-2 mt-2"
            >
              <span>{isSubmitting ? 'Submitting Details...' : 'Complete Enrollment Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
