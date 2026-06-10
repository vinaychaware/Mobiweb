import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if using placeholder credentials
const isPlaceholder = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes("AIzaSyA1B2C3D4E5");

let app;
let db = null;
let auth = null;
let googleProvider = null;

if (!isPlaceholder) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Firebase failed to initialize. Falling back to local demo mode.", error);
  }
} else {
  console.info("Using placeholder Firebase credentials. Running in local simulation mode.");
}

// Helper to save data locally during demo mode
const saveToLocalDemo = (key, data) => {
  try {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const newRecord = {
      ...data,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString()
    };
    existing.push(newRecord);
    localStorage.setItem(key, JSON.stringify(existing));
    return newRecord.id;
  } catch (e) {
    console.error("Local storage error:", e);
    return Math.random().toString(36).substring(2, 11);
  }
};

/**
 * Submits enrollment form data. Falls back to localStorage demo if Firebase is inactive.
 */
export const submitEnrollment = async (enrollmentData) => {
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "enrollments"), {
        ...enrollmentData,
        timestamp: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Firebase submitEnrollment error, falling back to local simulation:", error);
      const localId = saveToLocalDemo("demo_enrollments", enrollmentData);
      return { success: true, id: localId, simulated: true };
    }
  } else {
    // Simulation mode
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
    const localId = saveToLocalDemo("demo_enrollments", enrollmentData);
    return { success: true, id: localId, simulated: true };
  }
};

/**
 * Submits contact form data. Falls back to localStorage demo if Firebase is inactive.
 */
export const submitContactLead = async (contactData) => {
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "leads"), {
        ...contactData,
        timestamp: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Firebase submitContactLead error, falling back to local simulation:", error);
      const localId = saveToLocalDemo("demo_leads", contactData);
      return { success: true, id: localId, simulated: true };
    }
  } else {
    // Simulation mode
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
    const localId = saveToLocalDemo("demo_leads", contactData);
    return { success: true, id: localId, simulated: true };
  }
};

/**
 * Sign in with Google. Falls back to simulated sign-in if Firebase is inactive.
 */
export const signInWithGoogle = async () => {
  if (auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user };
    } catch (error) {
      console.error("Firebase sign-in error, falling back to simulation:", error);
      // Simulate login for dev
      const mockUser = {
        uid: "simulated-user-123",
        displayName: "Guest Student",
        email: "student@example.com",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
      };
      return { user: mockUser, simulated: true };
    }
  } else {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser = {
      uid: "simulated-user-123",
      displayName: "Demo Engineer",
      email: "engineer.student@mobiweb.com",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    };
    return { user: mockUser, simulated: true };
  }
};

/**
 * Sign out of application.
 */
export const logoutUser = async () => {
  if (auth) {
    await signOut(auth);
  }
};

export { db, auth };
