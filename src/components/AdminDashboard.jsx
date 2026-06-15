import { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, FileText, GraduationCap, Inbox, LogOut, 
  Search, Plus, Edit, Trash2, X, AlertTriangle, 
  ArrowLeft, RefreshCw, Key, Sun, Moon
} from 'lucide-react';
import { 
  signInAdminWithEmail, signInWithGoogle, logoutUser, auth,
  getPrograms, saveProgram, deleteProgram,
  getBlogs, saveBlog, deleteBlog,
  getEnrollments, getLeads
} from '../firebase';
import { useToast } from './Toast';

export default function AdminDashboard({ theme, toggleTheme }) {
  const { addToast } = useToast();
  
  // Auth States
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Nav States
  const [activeTab, setActiveTab] = useState('overview'); // overview, blogs, courses, inquiries

  // Data States
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Search/Filter States
  const [blogSearch, setBlogSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  // Editing/Form States
  const [currentEditBlog, setCurrentEditBlog] = useState(null); // null = list, 'new' = create, {id} = edit
  const [blogForm, setBlogForm] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    image: '',
    readTime: '5 min read',
    published: true
  });
  const [blogPreviewTab, setBlogPreviewTab] = useState(false); // Edit vs HTML Preview

  const [currentEditCourse, setCurrentEditCourse] = useState(null); // null = list, 'new' = create, {id} = edit
  const [courseForm, setCourseForm] = useState({
    title: '',
    badge: '',
    iconName: 'GraduationCap',
    description: '',
    details: '',
    duration: '',
    audience: '',
    order: 5,
    features: ['']
  });

  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Monitor Authentication state
  useEffect(() => {
    // If Firebase Auth is live, listen to auth changes
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          if (user.email === 'ashutosh.agarwal@mobiwebgs.com') {
            setAdminUser(user);
          } else {
            // Un-authorized user logged in, sign them out
            logoutUser();
            addToast({
              type: 'error',
              title: 'Access Denied',
              message: 'This account is not authorized as Mobiweb Administrator.',
            });
          }
        } else {
          setAdminUser(null);
        }
      });
      return unsubscribe;
    }
  }, [addToast]);

  // Fetch Dashboard Data
  const loadDashboardData = useCallback(async () => {
    if (!adminUser) return;
    // Defer execution to avoid React cascading render / eslint warnings
    setTimeout(() => {
      setDataLoading(true);
    }, 0);
    try {
      const [allBlogs, allCourses, allEnrolls, allLeads] = await Promise.all([
        getBlogs(),
        getPrograms(),
        getEnrollments(),
        getLeads()
      ]);
      setBlogs(allBlogs);
      setCourses(allCourses);
      setEnrollments(allEnrolls);
      setLeads(allLeads);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      addToast({
        type: 'error',
        title: 'Fetch Error',
        message: 'Could not load admin collections.',
      });
    } finally {
      setDataLoading(false);
    }
  }, [adminUser, addToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboardData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadDashboardData]);

  // Auth Operations
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError('');
    try {
      const res = await signInAdminWithEmail(emailInput, passwordInput);
      setAdminUser(res.user);
      addToast({
        type: 'success',
        title: 'Welcome Back',
        message: 'Admin console access granted.',
      });
    } catch (err) {
      console.error(err);
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setLoginError('');
    try {
      const res = await signInWithGoogle();
      if (res.user.email === 'ashutosh.agarwal@mobiwebgs.com') {
        setAdminUser(res.user);
        addToast({
          type: 'success',
          title: 'Welcome Back',
          message: 'Admin console access granted.',
        });
      } else {
        if (res.simulated) {
          // In local fallback mode we can bypass google auth to simplify testing
          setAdminUser({
            displayName: 'Ashutosh Agarwal',
            email: 'ashutosh.agarwal@mobiwebgs.com',
            photoURL: 'https://ui-avatars.com/api/?name=Ashutosh+Agarwal&background=6366f1&color=fff&size=150',
            uid: 'admin-ashutosh'
          });
          addToast({
            type: 'success',
            title: 'Welcome Back (Simulated)',
            message: 'Admin console simulated access granted.',
          });
        } else {
          await logoutUser();
          setLoginError('Unauthorized user email: ' + res.user.email);
        }
      }
    } catch (err) {
      console.error(err);
      setLoginError(err.message || 'Google Sign-in failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAdminUser(null);
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: 'Admin session closed.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Blog CRUD Operations
  const handleOpenBlogForm = (blog) => {
    if (blog === 'new') {
      setCurrentEditBlog('new');
      setBlogForm({
        title: '',
        summary: '',
        content: '',
        tags: '',
        image: '',
        readTime: '5 min read',
        published: true
      });
    } else {
      setCurrentEditBlog(blog);
      setBlogForm({
        title: blog.title || '',
        summary: blog.summary || '',
        content: blog.content || '',
        tags: (blog.tags || []).join(', '),
        image: blog.image || '',
        readTime: blog.readTime || '5 min read',
        published: blog.published !== false
      });
    }
    setBlogPreviewTab(false);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!blogForm.title.trim() || !blogForm.summary.trim()) {
      addToast({ type: 'error', title: 'Validation Failed', message: 'Title and Summary are required.' });
      return;
    }

    const processedTags = blogForm.tags
      ? blogForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    const blogData = {
      title: blogForm.title.trim(),
      summary: blogForm.summary.trim(),
      content: blogForm.content.trim(),
      tags: processedTags,
      image: blogForm.image.trim(),
      readTime: blogForm.readTime.trim(),
      published: blogForm.published,
      author: adminUser.displayName || 'Ashutosh Agarwal'
    };

    if (currentEditBlog && currentEditBlog !== 'new') {
      blogData.id = currentEditBlog.id;
      blogData.timestamp = currentEditBlog.timestamp;
      blogData.date = currentEditBlog.date;
    }

    try {
      const res = await saveBlog(blogData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Blog Saved',
          message: `Article successfully ${currentEditBlog === 'new' ? 'created' : 'updated'}.`
        });
        setCurrentEditBlog(null);
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Save Failed', message: 'Error saving blog post.' });
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await deleteBlog(id);
      if (res.success) {
        addToast({ type: 'success', title: 'Blog Deleted', message: 'Article removed successfully.' });
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Delete Failed', message: 'Error deleting blog post.' });
    }
  };

  // Course CRUD Operations
  const handleOpenCourseForm = (course) => {
    if (course === 'new') {
      setCurrentEditCourse('new');
      setCourseForm({
        title: '',
        badge: '',
        iconName: 'GraduationCap',
        description: '',
        details: '',
        duration: '',
        audience: '',
        order: courses.length + 1,
        features: ['']
      });
    } else {
      setCurrentEditCourse(course);
      setCourseForm({
        title: course.title || '',
        badge: course.badge || '',
        iconName: course.iconName || 'GraduationCap',
        description: course.description || '',
        details: course.details || '',
        duration: course.duration || '',
        audience: course.audience || '',
        order: course.order || 5,
        features: course.features && course.features.length > 0 ? [...course.features] : ['']
      });
    }
  };

  const handleAddCourseFeatureField = () => {
    setCourseForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleCourseFeatureChange = (index, value) => {
    const updatedFeatures = [...courseForm.features];
    updatedFeatures[index] = value;
    setCourseForm(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const handleRemoveCourseFeatureField = (index) => {
    const updatedFeatures = courseForm.features.filter((_, i) => i !== index);
    setCourseForm(prev => ({
      ...prev,
      features: updatedFeatures.length > 0 ? updatedFeatures : ['']
    }));
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.description.trim()) {
      addToast({ type: 'error', title: 'Validation Failed', message: 'Title and Description are required.' });
      return;
    }

    const processedFeatures = courseForm.features.map(f => f.trim()).filter(Boolean);

    const courseData = {
      title: courseForm.title.trim(),
      badge: courseForm.badge.trim(),
      iconName: courseForm.iconName,
      description: courseForm.description.trim(),
      details: courseForm.details.trim(),
      duration: courseForm.duration.trim(),
      audience: courseForm.audience.trim(),
      order: Number(courseForm.order) || 5,
      features: processedFeatures
    };

    if (currentEditCourse && currentEditCourse !== 'new') {
      courseData.id = currentEditCourse.id;
    }

    try {
      const res = await saveProgram(courseData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Course Saved',
          message: `Program successfully ${currentEditCourse === 'new' ? 'created' : 'updated'}.`
        });
        setCurrentEditCourse(null);
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Save Failed', message: 'Error saving course.' });
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      const res = await deleteProgram(id);
      if (res.success) {
        addToast({ type: 'success', title: 'Course Deleted', message: 'Program removed successfully.' });
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Delete Failed', message: 'Error deleting program.' });
    }
  };

  // Filter lists
  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
    (b.tags || []).some(t => t.toLowerCase().includes(blogSearch.toLowerCase()))
  );

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.description.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary-950 font-sans text-gray-100 flex flex-col">
      
      {/* ─── UNAUTHENTICATED: LOGIN VIEW ─────────────────────────────────────── */}
      {!adminUser ? (
        <div className="flex-grow flex items-center justify-center p-4 min-h-screen relative bg-grid-pattern">
          {/* Floating Theme Switcher */}
          <div className="absolute top-6 right-6 z-10">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-850 text-gray-400 hover:text-white bg-slate-900/40 hover:bg-slate-900 transition-colors cursor-pointer focus:outline-none shadow-lg animate-fade-in"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </button>
          </div>

          {/* Subtle light spots */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl" />

          <div className="w-full max-w-md glass-card rounded-3xl p-8 border-slate-800 shadow-2xl relative">
            {/* Gradient glow border accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-t-3xl" />
            
            <div className="text-center space-y-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-cyan-500/15">
                <Key className="w-7 h-7" />
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-white">Mobiweb Admin Panel</h2>
              <p className="text-gray-400 text-xs font-light">Access restricted to Authorized Administrators only.</p>
            </div>

            {loginError && (
              <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 text-xs text-red-300 leading-relaxed flex items-start space-x-2.5 mb-6">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider pl-1">Admin Email</label>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="ashutosh.agarwal@mobiwebgs.com"
                  required
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider pl-1">Security Passcode</label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                {authLoading ? 'Authenticating...' : 'Sign In with Email'}
              </button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute w-full h-[1px] bg-slate-850" />
              <span className="relative bg-slate-950 px-3 text-[10px] text-gray-500 uppercase tracking-wider">or sign in with</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wide text-gray-300 bg-slate-900 border border-slate-800 hover:bg-slate-850 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google Logo" 
                className="w-4.5 h-4.5"
              />
              <span>{authLoading ? 'Authenticating...' : 'Google Account Sign In'}</span>
            </button>

            <div className="mt-8 text-center">
              <a href="#" className="text-gray-500 hover:text-gray-400 text-xs font-light flex items-center justify-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Landing Page</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* ─── AUTHENTICATED: DASHBOARD VIEW ───────────────────────────────────── */
        <div className="flex-grow flex flex-col md:flex-row min-h-screen">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-900 flex flex-col justify-between flex-shrink-0">
            <div>
              {/* Sidebar Header Brand */}
              <div className="p-6 border-b border-slate-900 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center">
                  <Key className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="text-left">
                  <span className="font-heading font-extrabold text-sm tracking-tight text-white block">
                    MOBIWEB<span className="text-brand-cyan font-normal text-xs ml-0.5">ADMIN</span>
                  </span>
                  <span className="text-[9px] text-cyan-400 font-semibold tracking-widest block uppercase">Console Portal</span>
                </div>
              </div>

              {/* Sidebar Tabs */}
              <nav className="p-4 space-y-1.5">
                {[
                  { id: 'overview', name: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
                  { id: 'blogs', name: 'Manage Blogs', icon: <FileText className="w-4 h-4" /> },
                  { id: 'courses', name: 'Manage Courses', icon: <GraduationCap className="w-4 h-4" /> },
                  { id: 'inquiries', name: 'Customer Inquiries', icon: <Inbox className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentEditBlog(null);
                      setCurrentEditCourse(null);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-150 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border-l-2 border-cyan-400 rounded-l-none pl-3.5'
                        : 'text-gray-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Sidebar Footer (Admin Profile & Logout) */}
            <div className="p-4 border-t border-slate-900 space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={adminUser.photoURL || "https://ui-avatars.com/api/?name=Ashutosh+Agarwal&background=6366f1&color=fff&size=150"} 
                  alt="Admin Avatar"
                  className="w-10 h-10 rounded-xl border border-slate-800 shadow"
                />
                <div className="text-left overflow-hidden">
                  <span className="block text-white text-xs font-semibold truncate">{adminUser.displayName || 'Ashutosh Agarwal'}</span>
                  <span className="block text-gray-500 text-[10px] truncate font-light">{adminUser.email}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-900 bg-slate-900/30 hover:bg-slate-900 text-gray-400 hover:text-white text-[11px] font-bold tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Sign Out Console</span>
              </button>
            </div>
          </aside>

          {/* MAIN WORK AREA */}
          <main className="flex-grow p-6 sm:p-8 md:p-10 max-h-screen overflow-y-auto bg-slate-900/15">
            
            {/* Header section with page title & actions */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-900">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white capitalize">
                  {activeTab} Dashboard
                </h1>
                <p className="text-gray-400 text-xs font-light mt-1">
                  {activeTab === 'overview' && 'Live operational metrics, statistics, and shortcuts.'}
                  {activeTab === 'blogs' && 'Create, edit, draft, and publish tech articles.'}
                  {activeTab === 'courses' && 'Update landing page customized courses.'}
                  {activeTab === 'inquiries' && 'Browse customer enrollment forms and footer contact leads.'}
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                </button>

                <button
                  onClick={loadDashboardData}
                  disabled={dataLoading}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-gray-400 hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
                  title="Reload Data"
                >
                  <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
                </button>

                <a
                  href="#"
                  className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs font-bold text-gray-300 hover:text-white rounded-xl hover:bg-slate-850 transition-colors"
                >
                  View Webpage
                </a>
              </div>
            </header>

            {/* TAB RENDERING */}
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Total Blogs', count: blogs.length, desc: 'Published & Drafts', color: 'border-cyan-500/10 text-cyan-400 bg-cyan-500/5', icon: <FileText className="w-5 h-5" /> },
                    { title: 'Active Offerings', count: courses.length, desc: 'Custom Programs', color: 'border-purple-500/10 text-purple-400 bg-purple-500/5', icon: <GraduationCap className="w-5 h-5" /> },
                    { title: 'Enrollments', count: enrollments.length, desc: 'Student Registrations', color: 'border-indigo-500/10 text-indigo-400 bg-indigo-500/5', icon: <Inbox className="w-5 h-5" /> },
                    { title: 'Contact Leads', count: leads.length, desc: 'Inquiry Submissions', color: 'border-pink-500/10 text-pink-400 bg-pink-500/5', icon: <Key className="w-5 h-5" /> },
                  ].map((card, idx) => (
                    <div key={idx} className="glass-card rounded-2xl p-6 border-slate-850 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{card.title}</span>
                        <span className="block font-heading text-3xl font-extrabold text-white">{card.count}</span>
                        <span className="block text-gray-400 text-[10px] font-light">{card.desc}</span>
                      </div>
                      <div className={`p-3.5 border rounded-2xl ${card.color}`}>
                        {card.icon}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Recent Inquiries List (col 8) */}
                  <div className="lg:col-span-8 glass-card rounded-2xl p-6 border-slate-850 space-y-6 text-left">
                    <div className="flex justify-between items-center">
                      <h3 className="font-heading text-lg font-bold text-white">Recent Enrollments</h3>
                      <button onClick={() => setActiveTab('inquiries')} className="text-cyan-400 hover:text-white text-xs font-semibold tracking-wider cursor-pointer">
                        View All →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      {enrollments.length === 0 ? (
                        <p className="text-gray-500 text-xs font-light text-center py-6">No enrollment requests yet.</p>
                      ) : (
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-slate-850 text-gray-500 font-bold uppercase tracking-wider pb-3">
                              <th className="py-2">Student</th>
                              <th className="py-2">Program</th>
                              <th className="py-2">Email</th>
                              <th className="py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-900 font-light text-gray-300">
                            {enrollments.slice(0, 5).map((enroll) => (
                              <tr key={enroll.id} className="hover:bg-slate-950/20 transition-colors">
                                <td className="py-3 font-semibold text-white">{enroll.name}</td>
                                <td className="py-3 text-cyan-400">{enroll.program}</td>
                                <td className="py-3">{enroll.email}</td>
                                <td className="py-3 text-gray-500">{enroll.timestamp ? new Date(enroll.timestamp).toLocaleDateString() : 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Operational Shortcuts (col 4) */}
                  <div className="lg:col-span-4 glass-card rounded-2xl p-6 border-slate-850 space-y-6 text-left">
                    <h3 className="font-heading text-lg font-bold text-white">Shortcuts</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => { setActiveTab('blogs'); handleOpenBlogForm('new'); }}
                        className="w-full p-4 bg-slate-950/40 border border-slate-850 hover:border-slate-700 rounded-xl text-left hover:bg-slate-900 flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div>
                          <span className="block text-white text-xs font-semibold group-hover:text-cyan-400 transition-colors">Write New Article</span>
                          <span className="text-[10px] text-gray-500 font-light">Draft and upload to Hub</span>
                        </div>
                        <Plus className="w-4 h-4 text-cyan-400" />
                      </button>

                      <button 
                        onClick={() => { setActiveTab('courses'); handleOpenCourseForm('new'); }}
                        className="w-full p-4 bg-slate-950/40 border border-slate-850 hover:border-slate-700 rounded-xl text-left hover:bg-slate-900 flex items-center justify-between cursor-pointer group transition-all"
                      >
                        <div>
                          <span className="block text-white text-xs font-semibold group-hover:text-purple-400 transition-colors">Add Course Offering</span>
                          <span className="text-[10px] text-gray-500 font-light">Publish new customized training</span>
                        </div>
                        <Plus className="w-4 h-4 text-purple-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MANAGE BLOGS TAB */}
            {activeTab === 'blogs' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {currentEditBlog === null ? (
                  /* BLOGS LIST VIEW */
                  <div className="space-y-6">
                    {/* Filter bar */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <div className="w-full sm:max-w-md relative">
                        <input 
                          type="text" 
                          placeholder="Search articles by title or tag..." 
                          value={blogSearch}
                          onChange={(e) => setBlogSearch(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      </div>
                      
                      <button
                        onClick={() => handleOpenBlogForm('new')}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-bold text-xs tracking-wider text-white rounded-xl shadow-lg shadow-cyan-500/10 flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create New Blog</span>
                      </button>
                    </div>

                    {/* Table / Cards */}
                    {filteredBlogs.length === 0 ? (
                      <div className="text-center py-12 glass-card rounded-2xl border-slate-850 p-8">
                        <p className="text-gray-500 font-light">No articles found matching search query.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.map((blog) => (
                          <div key={blog.id} className="glass-card rounded-2xl overflow-hidden border-slate-850 flex flex-col justify-between hover:border-slate-700/80 transition-all text-left">
                            <div className="relative h-40 bg-slate-950">
                              <img 
                                src={blog.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'} 
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 right-3 flex space-x-1.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  blog.published 
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                }`}>
                                  {blog.published ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </div>

                            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-heading text-base font-bold text-white line-clamp-2">{blog.title}</h4>
                                <p className="text-gray-400 text-xs font-light line-clamp-2">{blog.summary}</p>
                              </div>

                              <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                                <span className="text-gray-500 text-[10px] font-light">
                                  {blog.date ? new Date(blog.date).toLocaleDateString() : 'No date'}
                                </span>
                                
                                <div className="flex items-center space-x-1.5">
                                  <button
                                    onClick={() => handleOpenBlogForm(blog)}
                                    className="p-1.5 bg-slate-950 border border-slate-850 hover:border-cyan-500/50 text-gray-400 hover:text-cyan-400 rounded-lg cursor-pointer transition-all"
                                    title="Edit Article"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBlog(blog.id)}
                                    className="p-1.5 bg-slate-950 border border-slate-850 hover:border-red-500/50 text-gray-400 hover:text-red-400 rounded-lg cursor-pointer transition-all"
                                    title="Delete Article"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* BLOGS EDIT/CREATE FORM VIEW */
                  <form onSubmit={handleSaveBlog} className="glass-card rounded-2xl p-6 sm:p-8 border-slate-850 space-y-6 text-left">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button" 
                          onClick={() => setCurrentEditBlog(null)}
                          className="p-2 bg-slate-950 border border-slate-850 text-gray-400 hover:text-white rounded-lg cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h3 className="font-heading text-lg font-bold text-white">
                          {currentEditBlog === 'new' ? 'Create New Article' : 'Edit Article'}
                        </h3>
                      </div>

                      <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-xl">
                        <button 
                          type="button"
                          onClick={() => setBlogPreviewTab(false)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer ${!blogPreviewTab ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                          Edit Content
                        </button>
                        <button 
                          type="button"
                          onClick={() => setBlogPreviewTab(true)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer ${blogPreviewTab ? 'bg-slate-900 text-cyan-400' : 'text-gray-500 hover:text-white'}`}
                        >
                          HTML Preview
                        </button>
                      </div>
                    </div>

                    {!blogPreviewTab ? (
                      /* BLOG WRITING TAB */
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Title & Metadata fields */}
                        <div className="md:col-span-8 space-y-4">
                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Blog Title</label>
                            <input 
                              type="text" 
                              required
                              value={blogForm.title}
                              onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g. Entering Go & Cloud Services in 2026"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-700"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Summary / Subtitle</label>
                            <textarea
                              rows="2"
                              required
                              value={blogForm.summary}
                              onChange={(e) => setBlogForm(prev => ({ ...prev, summary: e.target.value }))}
                              placeholder="Brief 1-2 sentence overview of the article contents for cards."
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white resize-none focus:outline-none focus:border-cyan-400 placeholder:text-gray-700"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Article Content (HTML formatting supported)</label>
                            <textarea
                              rows="12"
                              required
                              value={blogForm.content}
                              onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                              placeholder="Write your blog contents here. You can use standard HTML tags like <h1>, <h2>, <p>, <ul>, <li>, and <code> to structure your post."
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 placeholder:text-gray-750"
                            />
                          </div>
                        </div>

                        {/* Sidebar configurations */}
                        <div className="md:col-span-4 space-y-6">
                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Cover Image URL</label>
                            <input 
                              type="url" 
                              value={blogForm.image}
                              onChange={(e) => setBlogForm(prev => ({ ...prev, image: e.target.value }))}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-700"
                            />
                            {blogForm.image && (
                              <div className="h-28 w-full border border-slate-850 rounded-xl overflow-hidden mt-2">
                                <img src={blogForm.image} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Tags / Categories (comma separated)</label>
                            <input 
                              type="text" 
                              value={blogForm.tags}
                              onChange={(e) => setBlogForm(prev => ({ ...prev, tags: e.target.value }))}
                              placeholder="e.g. React 19, Tailwind v4, Web Dev"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-750"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Reading Duration Estimation</label>
                            <input 
                              type="text" 
                              value={blogForm.readTime}
                              onChange={(e) => setBlogForm(prev => ({ ...prev, readTime: e.target.value }))}
                              placeholder="e.g. 5 min read"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-700"
                            />
                          </div>

                          <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-between">
                            <div>
                              <span className="block text-white text-xs font-semibold">Publish Article</span>
                              <span className="text-[10px] text-gray-500 font-light">Make article publicly readable</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={blogForm.published}
                              onChange={(e) => setBlogForm(prev => ({ ...prev, published: e.target.checked }))}
                              className="w-4.5 h-4.5 rounded text-cyan-500 bg-slate-900 border-slate-800 accent-cyan-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* HTML PREVIEW TAB */
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">{blogForm.title || 'Untitled Article'}</h2>
                          <p className="text-gray-400 text-xs font-light">{blogForm.summary || 'Summary outline will go here.'}</p>
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {blogForm.tags && blogForm.tags.split(',').map((t, idx) => (
                              <span key={idx} className="bg-slate-900 px-2 py-0.5 border border-slate-850 text-gray-500 text-[10px] rounded">
                                #{t.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        {blogForm.image && (
                          <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-850">
                            <img src={blogForm.image} alt="Cover Preview" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <article 
                          className="prose dark:prose-invert max-w-none text-gray-300 font-light leading-relaxed space-y-4 border-t border-slate-850 pt-6
                            prose-headings:font-heading prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-h1:text-xl prose-h2:text-lg prose-h3:text-md
                            prose-p:text-xs prose-p:leading-relaxed prose-a:text-cyan-400 prose-a:hover:underline
                            prose-code:text-[10px] prose-code:bg-slate-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-cyan-400 prose-code:font-mono
                            prose-strong:text-slate-900 dark:prose-strong:text-white"
                          dangerouslySetInnerHTML={{ __html: blogForm.content || '<p className="italic text-gray-500">No article content written yet.</p>' }}
                        />
                      </div>
                    )}

                    <div className="border-t border-slate-850 pt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setCurrentEditBlog(null)}
                        className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-gray-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-bold text-xs text-white shadow-lg cursor-pointer"
                      >
                        Save Article
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 3. MANAGE COURSES TAB */}
            {activeTab === 'courses' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {currentEditCourse === null ? (
                  /* COURSES LIST VIEW */
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <div className="w-full sm:max-w-md relative">
                        <input 
                          type="text" 
                          placeholder="Search programs by title..." 
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
                        />
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                      </div>
                      
                      <button
                        onClick={() => handleOpenCourseForm('new')}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 font-bold text-xs tracking-wider text-white rounded-xl shadow-lg shadow-purple-500/10 flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Course</span>
                      </button>
                    </div>

                    {filteredCourses.length === 0 ? (
                      <div className="text-center py-12 glass-card rounded-2xl border-slate-850 p-8">
                        <p className="text-gray-500 font-light">No customized courses found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredCourses.map((c) => (
                          <div key={c.id} className="glass-card rounded-2xl p-6 border-slate-850 flex flex-col justify-between hover:border-slate-700/80 transition-all text-left group relative">
                            {/* Accent indicator */}
                            <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-purple-500 to-indigo-600 rounded-l-2xl" />

                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-purple-400 text-xs font-semibold">
                                  {c.iconName}
                                </div>
                                <span className="bg-slate-950 border border-slate-850 text-gray-400 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">
                                  Order: {c.order || 5}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-heading text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{c.title}</h4>
                                  <span className="text-[10px] font-medium text-cyan-400">({c.badge})</span>
                                </div>
                                <p className="text-gray-400 text-xs font-light line-clamp-2 leading-relaxed">{c.description}</p>
                              </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-950 flex items-center justify-between">
                              <span className="text-[10px] text-gray-500 font-light">
                                Duration: {c.duration}
                              </span>

                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={() => handleOpenCourseForm(c)}
                                  className="p-1.5 bg-slate-950 border border-slate-850 hover:border-purple-500/50 text-gray-400 hover:text-purple-400 rounded-lg cursor-pointer transition-all"
                                  title="Edit Program"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(c.id)}
                                  className="p-1.5 bg-slate-950 border border-slate-850 hover:border-red-500/50 text-gray-400 hover:text-red-400 rounded-lg cursor-pointer transition-all"
                                  title="Delete Program"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* COURSE EDIT/CREATE FORM VIEW */
                  <form onSubmit={handleSaveCourse} className="glass-card rounded-2xl p-6 sm:p-8 border-slate-850 space-y-6 text-left">
                    <div className="flex items-center space-x-2 border-b border-slate-850 pb-4">
                      <button 
                        type="button" 
                        onClick={() => setCurrentEditCourse(null)}
                        className="p-2 bg-slate-950 border border-slate-850 text-gray-400 hover:text-white rounded-lg cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h3 className="font-heading text-lg font-bold text-white">
                        {currentEditCourse === 'new' ? 'Add Program Offering' : 'Edit Program Details'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Program Title</label>
                          <input 
                            type="text" 
                            required
                            value={courseForm.title}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Hands-on DevOps Sprints"
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 placeholder:text-gray-700"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Badge Tag</label>
                          <input 
                            type="text" 
                            value={courseForm.badge}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, badge: e.target.value }))}
                            placeholder="e.g. 2 Days Bootcamp"
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 placeholder:text-gray-750"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Lucide Icon name</label>
                            <select
                              value={courseForm.iconName}
                              onChange={(e) => setCourseForm(prev => ({ ...prev, iconName: e.target.value }))}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                            >
                              <option value="GraduationCap">GraduationCap (College)</option>
                              <option value="Code">Code (Sprints)</option>
                              <option value="Laptop">Laptop (Internship)</option>
                              <option value="Users2">Users2 (Guest webinar)</option>
                              <option value="ShieldAlert">ShieldAlert (Cybersecurity)</option>
                              <option value="CheckCircle2">CheckCircle2 (Success)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Display Order Index</label>
                            <input 
                              type="number" 
                              value={courseForm.order}
                              onChange={(e) => setCourseForm(prev => ({ ...prev, order: Number(e.target.value) }))}
                              placeholder="5"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Brief Card Description</label>
                          <textarea
                            rows="2"
                            required
                            value={courseForm.description}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Short summary displayed on the card."
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white resize-none focus:outline-none focus:border-purple-400 placeholder:text-gray-700"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Detailed Modal Overview</label>
                          <textarea
                            rows="4"
                            value={courseForm.details}
                            onChange={(e) => setCourseForm(prev => ({ ...prev, details: e.target.value }))}
                            placeholder="Comprehensive description displayed in the pop-up modal."
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white resize-none focus:outline-none focus:border-purple-400 placeholder:text-gray-700"
                          />
                        </div>
                      </div>

                      {/* Right Column (Features & Specs) */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Duration Detail</label>
                            <input 
                              type="text" 
                              value={courseForm.duration}
                              onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                              placeholder="e.g. 16 Hours"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 placeholder:text-gray-700"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Eligibility / Audience</label>
                            <input 
                              type="text" 
                              value={courseForm.audience}
                              onChange={(e) => setCourseForm(prev => ({ ...prev, audience: e.target.value }))}
                              placeholder="e.g. Final Year Students"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 placeholder:text-gray-700"
                            />
                          </div>
                        </div>

                        {/* Features Dynamic Input List */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Key Learning Modules / Features</label>
                            <button
                              type="button"
                              onClick={handleAddCourseFeatureField}
                              className="px-2 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-lg text-purple-400 text-[9px] font-bold uppercase flex items-center space-x-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Feature</span>
                            </button>
                          </div>

                          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {courseForm.features.map((feat, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={feat}
                                  onChange={(e) => handleCourseFeatureChange(index, e.target.value)}
                                  placeholder={`Feature #${index + 1}`}
                                  className="flex-grow bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCourseFeatureField(index)}
                                  className="p-2 bg-slate-950 border border-slate-850 text-gray-500 hover:text-red-400 rounded-xl cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-850 pt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setCurrentEditCourse(null)}
                        className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-gray-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 font-bold text-xs text-white shadow-lg cursor-pointer"
                      >
                        Save Course Offering
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 4. CUSTOMER INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <div className="space-y-8 animate-in fade-in duration-300 text-left">
                
                {/* 4A. Student Enrollments */}
                <div className="glass-card rounded-2xl p-6 border-slate-850 space-y-4">
                  <h3 className="font-heading text-lg font-bold text-white flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    <span>Student Enrollments</span>
                  </h3>
                  
                  <div className="overflow-x-auto">
                    {enrollments.length === 0 ? (
                      <p className="text-gray-500 text-xs font-light text-center py-8">No student enrollment logs found.</p>
                    ) : (
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-850 text-gray-500 font-bold uppercase tracking-wider pb-3">
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Email Address</th>
                            <th className="py-2.5 px-3">Selected Course</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Date Submitted</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 font-light text-gray-300">
                          {enrollments.map((en) => (
                            <tr key={en.id} className="hover:bg-slate-950/20 transition-colors">
                              <td className="py-3.5 px-3 font-semibold text-white">{en.name}</td>
                              <td className="py-3.5 px-3">{en.email}</td>
                              <td className="py-3.5 px-3 text-cyan-400">{en.program}</td>
                              <td className="py-3.5 px-3">
                                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-medium">
                                  Received
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-gray-500">
                                {en.timestamp ? new Date(en.timestamp).toLocaleString() : 'N/A'}
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <button
                                  onClick={() => setSelectedInquiry({ type: 'Enrollment', ...en })}
                                  className="p-1 bg-slate-950 border border-slate-850 hover:border-cyan-500/50 text-cyan-400 rounded-md cursor-pointer text-[10px] px-2.5 font-bold uppercase"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* 4B. Contact Leads */}
                <div className="glass-card rounded-2xl p-6 border-slate-850 space-y-4">
                  <h3 className="font-heading text-lg font-bold text-white flex items-center space-x-2">
                    <Inbox className="w-5 h-5 text-pink-400" />
                    <span>Contact Leads / Messages</span>
                  </h3>
                  
                  <div className="overflow-x-auto">
                    {leads.length === 0 ? (
                      <p className="text-gray-500 text-xs font-light text-center py-8">No contact message logs found.</p>
                    ) : (
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-slate-850 text-gray-500 font-bold uppercase tracking-wider pb-3">
                            <th className="py-2.5 px-3">Sender Name</th>
                            <th className="py-2.5 px-3">Email Address</th>
                            <th className="py-2.5 px-3">Phone Number</th>
                            <th className="py-2.5 px-3">Short Message</th>
                            <th className="py-2.5 px-3">Date Submitted</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 font-light text-gray-300">
                          {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-950/20 transition-colors">
                              <td className="py-3.5 px-3 font-semibold text-white">{lead.name}</td>
                              <td className="py-3.5 px-3">{lead.email}</td>
                              <td className="py-3.5 px-3">{lead.phone || 'N/A'}</td>
                              <td className="py-3.5 px-3 truncate max-w-xs">{lead.message}</td>
                              <td className="py-3.5 px-3 text-gray-500">
                                {lead.timestamp ? new Date(lead.timestamp).toLocaleString() : 'N/A'}
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <button
                                  onClick={() => setSelectedInquiry({ type: 'Contact Lead', ...lead })}
                                  className="p-1 bg-slate-950 border border-slate-850 hover:border-pink-500/50 text-pink-400 rounded-md cursor-pointer text-[10px] px-2.5 font-bold uppercase"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* DETAILED INQUIRY MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass-modal rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-left">
            
            <div className={`p-6 border-b border-slate-850 flex justify-between items-center ${
              selectedInquiry.type === 'Enrollment' 
                ? 'bg-gradient-to-r from-indigo-950/30 to-slate-950/30' 
                : 'bg-gradient-to-r from-pink-950/30 to-slate-950/30'
            }`}>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  selectedInquiry.type === 'Enrollment' 
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' 
                    : 'bg-pink-500/15 text-pink-400 border border-pink-500/20'
                }`}>
                  {selectedInquiry.type} Request
                </span>
                <h4 className="font-heading text-lg font-bold text-white mt-1.5">{selectedInquiry.name}</h4>
              </div>
              
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-gray-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Email Address</span>
                  <span className="block text-white font-medium mt-0.5 break-all">{selectedInquiry.email}</span>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Phone Number</span>
                    <span className="block text-white font-medium mt-0.5">{selectedInquiry.phone}</span>
                  </div>
                )}
              </div>

              {selectedInquiry.type === 'Enrollment' && (
                <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-gray-500 text-[9px] font-bold uppercase tracking-wider">Selected Program</span>
                  <span className="block text-cyan-400 text-sm font-bold">{selectedInquiry.program}</span>
                </div>
              )}

              {selectedInquiry.message && (
                <div className="space-y-1 text-xs">
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Inquiry Message</span>
                  <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-xl text-gray-300 leading-relaxed font-light whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>
              )}

              {selectedInquiry.source && (
                <div className="text-xs">
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Submission Source</span>
                  <span className="block text-gray-400 mt-0.5">{selectedInquiry.source}</span>
                </div>
              )}

              <div className="text-xs">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Date & Time</span>
                <span className="block text-gray-400 mt-0.5">
                  {selectedInquiry.timestamp ? new Date(selectedInquiry.timestamp).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-850 bg-slate-950/20 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs font-bold text-gray-400 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
