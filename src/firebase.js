import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// ─── Firebase Configuration (Live Project: mobiweb-736d3) ────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ─── Initialize Firebase App ──────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);

// ─── Analytics (Google Analytics 4) ──────────────────────────────────────────
// Only initialize analytics in browser environments (not SSR/build)
let analytics = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.warn("Analytics failed to initialize:", e);
  }
}

// ─── Firestore Database ───────────────────────────────────────────────────────
const db = getFirestore(app);

// ─── Firebase Authentication ──────────────────────────────────────────────────
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// ─── Helper: Log Analytics Event ─────────────────────────────────────────────
export const trackEvent = (eventName, params = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
    } catch (e) {
      // silently fail if analytics blocked
    }
  }
};

// ─── Firestore: Submit Enrollment Form ───────────────────────────────────────
/**
 * Saves an enrollment record to the "enrollments" Firestore collection.
 * Falls back to localStorage if Firestore write fails.
 */
export const submitEnrollment = async (enrollmentData) => {
  try {
    const docRef = await addDoc(collection(db, "enrollments"), {
      ...enrollmentData,
      timestamp: serverTimestamp(),
      source: "landing_page",
    });

    // Track enrollment event in Analytics
    trackEvent("enrollment_submitted", {
      program: enrollmentData.program,
      user_type: enrollmentData.userType,
    });

    console.log("✅ Enrollment saved to Firestore:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Firestore enrollment error:", error);

    // Graceful fallback to localStorage
    const fallbackId = _saveLocalFallback("mw_enrollments", enrollmentData);
    return { success: true, id: fallbackId, simulated: true };
  }
};

// ─── Firestore: Submit Contact Lead ──────────────────────────────────────────
/**
 * Saves a contact message to the "leads" Firestore collection.
 */
export const submitContactLead = async (contactData) => {
  try {
    const docRef = await addDoc(collection(db, "leads"), {
      ...contactData,
      timestamp: serverTimestamp(),
      source: "footer_contact_form",
    });

    // Track lead event in Analytics
    trackEvent("contact_lead_submitted", {
      has_phone: !!contactData.phone && contactData.phone !== "N/A",
    });

    console.log("✅ Contact lead saved to Firestore:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Firestore lead error:", error);

    const fallbackId = _saveLocalFallback("mw_leads", contactData);
    return { success: true, id: fallbackId, simulated: true };
  }
};

// ─── Auth: Google Sign-In ─────────────────────────────────────────────────────
/**
 * Opens Google Sign-In popup and returns the authenticated user.
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    trackEvent("login", { method: "google" });
    console.log("✅ Google Sign-In successful:", result.user.email);
    return { user: result.user };
  } catch (error) {
    console.error("❌ Google Sign-In error:", error);

    // Common errors and user-friendly messages
    if (error.code === "auth/popup-blocked") {
      throw new Error("Popup was blocked by the browser. Please allow popups for this site.");
    } else if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled.");
    } else if (error.code === "auth/unauthorized-domain") {
      throw new Error("This domain is not authorized. Add it to your Firebase console under Authentication → Settings → Authorized domains.");
    }
    throw error;
  }
};

// ─── Auth: Sign Out ───────────────────────────────────────────────────────────
/**
 * Signs out the current user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    trackEvent("logout");
    console.log("✅ User signed out successfully.");
  } catch (error) {
    console.error("❌ Sign-out error:", error);
    throw error;
  }
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
  } catch (e) {
    return Math.random().toString(36).substring(2, 11);
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────
export { app, db, auth, analytics };
