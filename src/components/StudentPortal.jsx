import React, { useState } from 'react';
import { LogIn, LogOut, Download, Globe, Clock, Video, FileText, Code2, AlertTriangle } from 'lucide-react';
import { signInWithGoogle, logoutUser } from '../firebase';
import { useToast } from './Toast';

export default function StudentPortal() {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await signInWithGoogle();
      setUser(res.user);
      setIsSimulated(res.simulated || false);
    } catch (err) {
      console.error("Login failed:", err);
      setAuthError(err.message || 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const webinars = [
    {
      title: "Mastering Cloud Infrastructure with Terraform",
      speaker: "Amit Sen, Cloud Architect at AWS",
      time: "June 25, 2026 at 4:00 PM IST",
      url: "https://zoom.us/mock-webinar-link",
      status: "Upcoming"
    },
    {
      title: "Building Microservices in Go & Docker",
      speaker: "Sanjay Kumar, Senior Consultant at Mobiweb",
      time: "July 02, 2026 at 5:30 PM IST",
      url: "https://zoom.us/mock-webinar-link",
      status: "Upcoming"
    }
  ];

  const downloads = [
    {
      name: "MERN Stack Bootcamp Curriculum",
      type: "PDF Syllabus",
      size: "2.4 MB",
      icon: <FileText className="w-5 h-5 text-red-400" />
    },
    {
      name: "Docker Containerization Handbook",
      type: "Coding Guide",
      size: "4.1 MB",
      icon: <Code2 className="w-5 h-5 text-cyan-400" />
    },
    {
      name: "Industry Standards Interview Prep Kit",
      type: "Job Resources",
      size: "1.8 MB",
      icon: <Globe className="w-5 h-5 text-indigo-400" />
    }
  ];

  return (
    <section id="portal" className="py-24 relative overflow-hidden bg-slate-900/40 border-t border-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs text-purple-400 font-semibold uppercase tracking-wider mb-4">
            <span>Student Dashboard</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Access Your{' '}
            <span className="gradient-text-purple-pink font-extrabold">Learning Resources</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 font-light">
            Log in to access direct course links, digital downloads, coding labs, and exclusive webinar rooms.
          </p>
        </div>

        {/* Auth Interface */}
        {!user ? (
          /* LOGIN PANEL */
          <div className="max-w-md mx-auto glass-card rounded-2xl p-8 border-slate-800 text-center space-y-6 hover:border-slate-700/80 transition-all">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-purple-400">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-xl font-semibold text-white">Student Portal</h3>
              <p className="text-gray-400 text-sm font-light">Use your registered Google account to sign in.</p>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm tracking-wide text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-center space-x-3"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google Logo" 
                className="w-5 h-5"
              />
              <span>{loading ? 'Authenticating...' : 'Sign In with Google'}</span>
            </button>
            {authError && (
              <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-xs text-red-300 text-center leading-relaxed">
                {authError}
              </div>
            )}
          </div>
        ) : (
          /* LOGGED IN PORTAL VIEW */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* User welcome header */}
            <div className="glass-card rounded-2xl p-6 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                  alt={user.displayName}
                  className="w-14 h-14 rounded-full border border-slate-700 shadow-md flex-shrink-0"
                />
                <div className="text-left">
                  <h3 className="font-heading text-lg font-bold text-white flex items-center">
                    Welcome back, {user.displayName}!
                  </h3>
                  <span className="text-xs text-gray-400 block font-light">{user.email}</span>
                </div>
              </div>

              {/* Status and signout */}
              <div className="flex items-center space-x-4">
                {isSimulated && (
                  <span className="bg-slate-900 border border-cyan-500/20 text-cyan-400 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                    Demo Mode
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wide text-gray-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all cursor-pointer flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Portal Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Webinars list (col-span 7) */}
              <div className="lg:col-span-7 glass-card rounded-2xl p-8 border-slate-800 text-left space-y-6">
                <h3 className="font-heading text-xl font-bold text-white flex items-center space-x-2">
                  <Video className="w-5 h-5 text-cyan-400" />
                  <span>My Active Webinars</span>
                </h3>
                <div className="space-y-4">
                  {webinars.map((web, idx) => (
                    <div key={idx} className="bg-slate-950/40 border border-slate-850 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="bg-slate-900 text-cyan-400 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border border-slate-800">
                          {web.status}
                        </span>
                        <h4 className="text-white text-base font-semibold pt-1">{web.title}</h4>
                        <p className="text-gray-400 text-xs font-light">{web.speaker}</p>
                        <div className="flex items-center space-x-1.5 text-gray-400 text-xs font-light pt-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{web.time}</span>
                        </div>
                      </div>
                      <a 
                        href={web.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-4 py-2 text-center rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-white shadow-md cursor-pointer transition-colors"
                      >
                        Join Room
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Downloads list (col-span 5) */}
              <div className="lg:col-span-5 glass-card rounded-2xl p-8 border-slate-800 text-left space-y-6">
                <h3 className="font-heading text-xl font-bold text-white flex items-center space-x-2">
                  <Download className="w-5 h-5 text-indigo-400" />
                  <span>Syllabus & Material Downloads</span>
                </h3>
                <div className="space-y-4">
                  {downloads.map((dl, idx) => (
                    <div key={idx} className="bg-slate-950/40 border border-slate-850 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                          {dl.icon}
                        </div>
                        <div>
                          <h4 className="text-white text-sm font-semibold">{dl.name}</h4>
                          <span className="text-gray-400 text-xs font-light">{dl.type} • {dl.size}</span>
                        </div>
                      </div>
                      <button 
                       onClick={() => addToast({
                          type: 'success',
                          title: 'Download Started',
                          message: `${dl.name} is being prepared for download.`,
                        })}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
