// ─── Firebase Wrapper ─────────────────────────────────────────────────────────
// All Firebase operations gracefully fall back to localStorage when unconfigured.
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  setDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

// Helper to enforce a timeout on Firestore operations (e.g. 2.5 seconds)
// This prevents the application from hanging indefinitely if the Firebase database is not created or unreachable.
const withTimeout = (promise, timeoutMs = 2500) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs)
    )
  ]);
};

// ─── Internal: Local Fallback Storage ────────────────────────────────────────
const _saveLocalFallback = (key, data) => {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const record = {
      ...data,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
    };
    existing.push(record);
    localStorage.setItem(key, JSON.stringify(existing));
    return record.id;
  } catch {
    return Math.random().toString(36).substring(2, 11);
  }
};

// ─── Firebase Configuration ────────────────────────────────────────────────────
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';

const isConfigured = 
  apiKey &&
  projectId &&
  !apiKey.includes('placeholder') &&
  !apiKey.includes('AIzaSyDEMO');

let _app = null;
let _db = null;
let _auth = null;
let _googleProvider = null;

// Only attempt real Firebase if we have valid config
if (isConfigured) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    _app = initializeApp(firebaseConfig);
    _db = getFirestore(_app);
    _auth = getAuth(_app);
    _googleProvider = new GoogleAuthProvider();
    _googleProvider.setCustomParameters({ prompt: 'select_account' });

    console.log('✅ Firebase initialized successfully');
  } catch (e) {
    console.warn('⚠️ Firebase initialization failed, using localStorage fallback:', e.message);
    _app = null;
    _db = null;
    _auth = null;
    _googleProvider = null;
  }
} else {
  console.info('ℹ️ Firebase not configured — running in demo mode with localStorage fallback.');
}

// ─── Helper: Log Analytics Event ─────────────────────────────────────────────
export const trackEvent = (eventName, params) => {
  // no-op when Firebase not available
  void eventName;
  void params;
};

// ─── Firestore: Submit Enrollment Form ───────────────────────────────────────
export const submitEnrollment = async (enrollmentData) => {
  if (_db) {
    try {
      const docRef = await withTimeout(
        addDoc(collection(_db, 'enrollments'), {
          ...enrollmentData,
          timestamp: serverTimestamp(),
          source: 'landing_page',
        })
      );
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Firestore enrollment error:', error);
    }
  }
  const fallbackId = _saveLocalFallback('mw_enrollments', enrollmentData);
  return { success: true, id: fallbackId, simulated: true };
};

// ─── Firestore: Submit Contact Lead ──────────────────────────────────────────
export const submitContactLead = async (contactData) => {
  if (_db) {
    try {
      const docRef = await withTimeout(
        addDoc(collection(_db, 'leads'), {
          ...contactData,
          timestamp: serverTimestamp(),
          source: 'footer_contact_form',
        })
      );
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Firestore lead error:', error);
    }
  }
  const fallbackId = _saveLocalFallback('mw_leads', contactData);
  return { success: true, id: fallbackId, simulated: true };
};

// ─── Auth: Google Sign-In ─────────────────────────────────────────────────────
export const signInWithGoogle = async () => {
  if (_auth && _googleProvider) {
    try {
      const result = await signInWithPopup(_auth, _googleProvider);
      return { user: result.user };
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by the browser. Please allow popups for this site.', { cause: error });
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled.', { cause: error });
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized in Firebase console.', { cause: error });
      }
      throw error;
    }
  }
  // Demo mode simulated login
  const simulatedUser = {
    displayName: 'Demo Student',
    email: 'demo@student.mobiwebglobal.com',
    photoURL: 'https://ui-avatars.com/api/?name=Demo+Student&background=06b6d4&color=fff&size=150',
    uid: 'demo-' + Math.random().toString(36).substring(2, 9),
  };
  return { user: simulatedUser, simulated: true };
};

// ─── Auth: Sign Out ───────────────────────────────────────────────────────────
export const logoutUser = async () => {
  if (_auth) {
    try {
      await signOut(_auth);
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      throw error;
    }
  }
};

// ─── Auth: Admin Sign-In with Email & Password ─────────────────────────────────
export const signInAdminWithEmail = async (email, password) => {
  if (email !== 'ashutosh.agarwal@mobiwebgs.com') {
    throw new Error('Access denied: Unauthorized admin email.');
  }

  if (_auth) {
    try {
      const result = await signInWithEmailAndPassword(_auth, email, password);
      return { user: result.user };
    } catch (error) {
      console.warn('⚠️ Firebase Auth failed, checking local passcode fallback:', error.message);
      if (password === 'mobiwebadmin2026') {
        const simulatedAdmin = {
          displayName: 'Ashutosh Agarwal',
          email: 'ashutosh.agarwal@mobiwebgs.com',
          photoURL: 'https://ui-avatars.com/api/?name=Ashutosh+Agarwal&background=6366f1&color=fff&size=150',
          uid: 'admin-ashutosh',
        };
        return { user: simulatedAdmin, simulated: true };
      }
      throw error;
    }
  }

  // Simulated fallback auth for demo mode
  if (password === 'mobiwebadmin2026') {
    const simulatedAdmin = {
      displayName: 'Ashutosh Agarwal',
      email: 'ashutosh.agarwal@mobiwebgs.com',
      photoURL: 'https://ui-avatars.com/api/?name=Ashutosh+Agarwal&background=6366f1&color=fff&size=150',
      uid: 'admin-ashutosh',
    };
    return { user: simulatedAdmin, simulated: true };
  } else {
    throw new Error('Invalid credentials. Hint: use passcode "mobiwebadmin2026" for local/demo mode.');
  }
};

// ─── Seeding Defaults ────────────────────────────────────────────────────────
const DEFAULT_PROGRAMS = [
  {
    id: 'training',
    title: 'College Training Programs',
    badge: 'Full-Semester / Customized',
    iconName: 'GraduationCap',
    description: 'Integrated engineering training curriculum running alongside academic semesters, focusing on industry-ready stacks.',
    details: 'Our long-term academic tie-up programs deliver deep technical competency directly inside the college campus.',
    features: [
      'Curriculum mapped to active university credit requirements',
      'Stack: Full-Stack Web Dev (MERN), AI/ML with Python, or cloud infrastructure',
      'Continuous assessments, mid-terms, and final project exhibitions',
      'Accreditation documentation and student performance matrices'
    ],
    duration: '45 to 90 Hours',
    audience: '1st to 3rd Year Engineering Students',
    order: 1
  },
  {
    id: 'workshops',
    title: 'Hands-on Workshops',
    badge: '2 to 3 Days Bootcamps',
    iconName: 'Code',
    description: 'Immersive coding sprints and technical bootcamps to build, deploy, and showcase working applications.',
    details: 'Intense, high-impact weekend or boot-camp format events structured around building a single production-ready project.',
    features: [
      'Project: Dockerizing microservices, GitOps pipelines, or UI design with Figma/React',
      '100% practical, zero slide-only lectures',
      'Interactive team hackathons on the final day',
      'Instant digital verified certificate of completion'
    ],
    duration: '16 Hours (Intense)',
    audience: 'Open to All Branches & Streams',
    order: 2
  },
  {
    id: 'internships',
    title: 'Industrial Internships',
    badge: '4 to 12 Weeks',
    iconName: 'Laptop',
    description: 'Guided corporate internships where students work on client briefs under senior tech mentors.',
    details: 'Bridge the gap from developer to employee. Experience Agile standups, code reviews, and project management tools first-hand.',
    features: [
      'Experience real software lifecycle sprints with Jira and Git',
      'Dual mentorship: Tech leads + Career guidance counsellors',
      'Letters of recommendation for top-performing interns',
      'Guaranteed interview calls with partner recruiters'
    ],
    duration: '1 to 3 Months',
    audience: 'Final & Pre-Final Year Students',
    order: 3
  },
  {
    id: 'webinars',
    title: 'Webinars & Guest Lectures',
    badge: 'Free Live Events',
    iconName: 'Users2',
    description: 'Expert talks on emerging technologies, career roadmaps, and resume-building strategies.',
    details: 'Connect with technical experts from top MNCs. Discover what skills are in demand and how to prepare for interviews.',
    features: [
      'Topic-centric sessions (e.g. AI-driven development, entering Web3, cloud careers)',
      'Live Q&A with tech architects and talent acquisition managers',
      'Access to webinars library, slides, and code templates',
      'Network with peer students across different states'
    ],
    duration: '2 Hours Sessions',
    audience: 'Students, Faculty & Fresh Graduates',
    order: 4
  }
];

const DEFAULT_BLOGS = [
  {
    id: 'tailwind-v4-react19',
    title: 'The Future of Web Development: Transitioning to Tailwind v4 and React 19',
    summary: 'Explore the key upgrades, compilation improvements, and development speedups with Tailwind CSS v4 and React 19.',
    content: '<h1>The Future of Web Development: Tailwind v4 and React 19</h1><p>Web development is undergoing a massive shift with React 19 and Tailwind CSS v4. These upgrades bring unparalleled developer productivity, faster builds, and better runtime execution.</p><h2>React 19 Core Upgrades</h2><p>React 19 introduces native support for Server Actions, document metadata management out of the box, and the new <code>use</code> API for resource consumption. This eliminates tons of boilerplate, allowing developers to write declarative, highly-efficient user interfaces with less code.</p><h2>Tailwind CSS v4 Engine</h2><p>Tailwind CSS v4 features a brand-new Rust-based compiler engine. It speeds up compilation times by up to 10x while compiling CSS files. Configuration is now done directly in CSS using <code>@theme</code> directives, making configuration cleaner and more maintainable.</p><p>By combining these two modern web standards, Mobiweb developers are building web architectures that load in milliseconds and look stunning.</p>',
    author: 'Ashutosh Agarwal',
    date: '2026-06-15',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    tags: ['React 19', 'Tailwind v4', 'Web Dev'],
    published: true,
    timestamp: new Date('2026-06-15').toISOString()
  },
  {
    id: 'first-tech-internship',
    title: 'How to Secure Your First Software Engineering Internship',
    summary: 'Landing an internship requires more than just high GPA. Discover the portfolio projects, open source contributions, and networking tactics that actually work.',
    content: '<h1>Securing Your First Tech Internship</h1><p>Every year, thousands of engineering students compete for limited internship spots. Standing out requires a strategic approach that showcases real coding skills over paper qualifications.</p><h2>1. Build High-Impact Portfolio Projects</h2><p>Instead of copying generic todo-list applications, build complete, deployed software systems. Projects that interact with public APIs, manage relational databases, or containerize services with Docker immediately show recruiters that you understand production workflows.</p><h2>2. Focus on Agile and Git Workflows</h2><p>In the industry, nobody works alone. Demonstrating that you know how to create feature branches, handle pull requests, perform code reviews, and resolve merge conflicts is a major competitive advantage.</p><h2>3. Leverage Modern Networking</h2><p>Don\'t just apply through standard portal applications. Share your coding progress on LinkedIn, participate in local hackathons, and connect directly with tech mentors who can refer you.</p>',
    author: 'Ashutosh Agarwal',
    date: '2026-06-10',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    tags: ['Internship', 'Career Guide', 'Mentorship'],
    published: true,
    timestamp: new Date('2026-06-10').toISOString()
  }
];

// ─── Programs: CRUD Operations ───────────────────────────────────────────────
export const getPrograms = async () => {
  if (_db) {
    try {
      const q = query(collection(_db, 'programs'), orderBy('order', 'asc'));
      const snapshot = await withTimeout(getDocs(q));
      const programs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (programs.length > 0) {
        return programs;
      }
      
      console.log('🌱 Seeding empty Firestore programs collection with defaults...');
      for (const prog of DEFAULT_PROGRAMS) {
        await withTimeout(setDoc(doc(collection(_db, 'programs'), prog.id), prog));
      }
      return DEFAULT_PROGRAMS;
    } catch (error) {
      console.error('❌ Firestore getPrograms error:', error);
    }
  }

  // Fallback to localStorage
  try {
    const localData = localStorage.getItem('mw_programs');
    if (localData) {
      const parsed = JSON.parse(localData);
      if (parsed.length > 0) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
    localStorage.setItem('mw_programs', JSON.stringify(DEFAULT_PROGRAMS));
    return DEFAULT_PROGRAMS;
  } catch {
    return DEFAULT_PROGRAMS;
  }
};

export const saveProgram = async (programData) => {
  const progId = programData.id || Math.random().toString(36).substring(2, 11);
  const dataToSave = {
    ...programData,
    id: progId,
    order: Number(programData.order) || 10,
    timestamp: new Date().toISOString()
  };

  if (_db) {
    try {
      await withTimeout(setDoc(doc(collection(_db, 'programs'), progId), dataToSave));
    } catch (error) {
      console.error('❌ Firestore saveProgram error:', error);
    }
  }

  // Save/Update in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('mw_programs') || '[]');
    const index = existing.findIndex(p => p.id === progId);
    if (index >= 0) {
      existing[index] = dataToSave;
    } else {
      existing.push(dataToSave);
    }
    localStorage.setItem('mw_programs', JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save program to localStorage:', err);
  }

  return { success: true, id: progId };
};

export const deleteProgram = async (id) => {
  if (_db) {
    try {
      await withTimeout(deleteDoc(doc(_db, 'programs', id)));
    } catch (error) {
      console.error('❌ Firestore deleteProgram error:', error);
    }
  }

  // Remove from localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('mw_programs') || '[]');
    const filtered = existing.filter(p => p.id !== id);
    localStorage.setItem('mw_programs', JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete program from localStorage:', err);
  }

  return { success: true };
};

// ─── Blogs: CRUD Operations ──────────────────────────────────────────────────
export const getBlogs = async () => {
  if (_db) {
    try {
      const q = query(collection(_db, 'blogs'), orderBy('timestamp', 'desc'));
      const snapshot = await withTimeout(getDocs(q));
      const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (blogs.length > 0) {
        return blogs;
      }

      console.log('🌱 Seeding empty Firestore blogs collection with defaults...');
      for (const blog of DEFAULT_BLOGS) {
        await withTimeout(setDoc(doc(collection(_db, 'blogs'), blog.id), blog));
      }
      return DEFAULT_BLOGS;
    } catch (error) {
      console.error('❌ Firestore getBlogs error:', error);
    }
  }

  // Fallback to localStorage
  try {
    const localData = localStorage.getItem('mw_blogs');
    if (localData) {
      const parsed = JSON.parse(localData);
      if (parsed.length > 0) {
        return parsed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
    }
    localStorage.setItem('mw_blogs', JSON.stringify(DEFAULT_BLOGS));
    return DEFAULT_BLOGS;
  } catch {
    return DEFAULT_BLOGS;
  }
};

export const saveBlog = async (blogData) => {
  const blogId = blogData.id || Math.random().toString(36).substring(2, 11);
  const dataToSave = {
    ...blogData,
    id: blogId,
    timestamp: blogData.timestamp || new Date().toISOString(),
    date: blogData.date || new Date().toISOString().split('T')[0]
  };

  if (_db) {
    try {
      await withTimeout(setDoc(doc(collection(_db, 'blogs'), blogId), dataToSave));
    } catch (error) {
      console.error('❌ Firestore saveBlog error:', error);
    }
  }

  // Save/Update in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('mw_blogs') || '[]');
    const index = existing.findIndex(b => b.id === blogId);
    if (index >= 0) {
      existing[index] = dataToSave;
    } else {
      existing.push(dataToSave);
    }
    localStorage.setItem('mw_blogs', JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save blog to localStorage:', err);
  }

  return { success: true, id: blogId };
};

export const deleteBlog = async (id) => {
  if (_db) {
    try {
      await withTimeout(deleteDoc(doc(_db, 'blogs', id)));
    } catch (error) {
      console.error('❌ Firestore deleteBlog error:', error);
    }
  }

  // Remove from localStorage
  try {
    const existing = JSON.parse(localStorage.getItem('mw_blogs') || '[]');
    const filtered = existing.filter(b => b.id !== id);
    localStorage.setItem('mw_blogs', JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete blog from localStorage:', err);
  }

  return { success: true };
};

// ─── Operations: Read Enrolled & Leads (Admin dashboard) ──────────────────────
export const getEnrollments = async () => {
  if (_db) {
    try {
      const q = query(collection(_db, 'enrollments'), orderBy('timestamp', 'desc'));
      const snapshot = await withTimeout(getDocs(q));
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp
        };
      });
    } catch (error) {
      console.error('❌ Firestore getEnrollments error:', error);
    }
  }

  // Fallback to localStorage
  try {
    return JSON.parse(localStorage.getItem('mw_enrollments') || '[]').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch {
    return [];
  }
};

export const getLeads = async () => {
  if (_db) {
    try {
      const q = query(collection(_db, 'leads'), orderBy('timestamp', 'desc'));
      const snapshot = await withTimeout(getDocs(q));
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp
        };
      });
    } catch (error) {
      console.error('❌ Firestore getLeads error:', error);
    }
  }

  // Fallback to localStorage
  try {
    return JSON.parse(localStorage.getItem('mw_leads') || '[]').sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch {
    return [];
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────
export { _app as app, _db as db, _auth as auth };
