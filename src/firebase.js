// ─── Firebase Wrapper ─────────────────────────────────────────────────────────
// All Firebase operations gracefully fall back to localStorage when unconfigured.

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
  } catch (e) {
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
    const firebase = await import('firebase/app');
    const firestore = await import('firebase/firestore');
    const firebaseAuth = await import('firebase/auth');

    const firebaseConfig = {
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    _app = firebase.initializeApp(firebaseConfig);
    _db = firestore.getFirestore(_app);
    _auth = firebaseAuth.getAuth(_app);
    _googleProvider = new firebaseAuth.GoogleAuthProvider();
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
export const trackEvent = (_eventName, _params = {}) => {
  // no-op when Firebase not available
};

// ─── Firestore: Submit Enrollment Form ───────────────────────────────────────
export const submitEnrollment = async (enrollmentData) => {
  if (_db) {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const docRef = await addDoc(collection(_db, 'enrollments'), {
        ...enrollmentData,
        timestamp: serverTimestamp(),
        source: 'landing_page',
      });
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
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const docRef = await addDoc(collection(_db, 'leads'), {
        ...contactData,
        timestamp: serverTimestamp(),
        source: 'footer_contact_form',
      });
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
      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(_auth, _googleProvider);
      return { user: result.user };
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by the browser. Please allow popups for this site.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized in Firebase console.');
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
      const { signOut } = await import('firebase/auth');
      await signOut(_auth);
    } catch (error) {
      console.error('❌ Sign-out error:', error);
      throw error;
    }
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────
export { _app as app, _db as db, _auth as auth };
