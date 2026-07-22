import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
} from 'firebase/firestore';
import { auth, db } from '../Firebase/firebase';
import type { User } from '../types';

// The default admin email that is always guaranteed admin access
const SUPER_ADMIN_EMAIL = 'mogaljavedahmedbaig@gmail.com';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup';
  isAdmin: boolean;
  isLoading: boolean;
  adminEmails: string[];
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  addAdmin: (email: string) => Promise<{ success: boolean; message?: string }>;
  removeAdmin: (email: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

/**
 * Convert a Firebase Auth user to our app User type.
 * Role is determined by checking against the Firestore admin list.
 */
function firebaseUserToAppUser(fbUser: FirebaseUser, adminList: string[]): User {
  const email = (fbUser.email || '').toLowerCase().trim();
  const isAdmin =
    email === SUPER_ADMIN_EMAIL.toLowerCase() ||
    adminList.map((e) => e.toLowerCase().trim()).includes(email);

  return {
    id: fbUser.uid,
    name: fbUser.displayName || email.split('@')[0] || 'User',
    email,
    role: isAdmin ? 'admin' : 'customer',
    avatar: fbUser.photoURL || undefined,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminEmails, setAdminEmails] = useState<string[]>([SUPER_ADMIN_EMAIL]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  // Listen to Firestore admins collection in real-time
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'admins'),
      (snapshot) => {
        const emails: string[] = [SUPER_ADMIN_EMAIL];
        snapshot.forEach((docSnap) => {
          const email = docSnap.id.toLowerCase().trim();
          if (!emails.includes(email)) {
            emails.push(email);
          }
        });
        setAdminEmails(emails);
      },
      (error) => {
        console.error('Error listening to admins collection:', error);
        // On error (e.g. missing collection), keep super admin only
        setAdminEmails([SUPER_ADMIN_EMAIL]);
      }
    );
    return () => unsub();
  }, []);

  // Configure browser session persistence (cleared when browser window/tab is closed)
  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .catch((error) => {
        console.error('Failed to set session persistence:', error);
      });
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  // Update app User whenever firebaseUser or adminEmails changes
  useEffect(() => {
    if (firebaseUser) {
      setCurrentUser(firebaseUserToAppUser(firebaseUser, adminEmails));
    } else {
      setCurrentUser(null);
    }
  }, [firebaseUser, adminEmails]);

  // Seed super admin doc in Firestore on first load
  useEffect(() => {
    const seedSuperAdmin = async () => {
      try {
        await setDoc(
          doc(db, 'admins', SUPER_ADMIN_EMAIL.toLowerCase()),
          { email: SUPER_ADMIN_EMAIL.toLowerCase(), addedAt: new Date().toISOString(), addedBy: 'system' },
          { merge: true }
        );
      } catch (err) {
        // Firestore may not be provisioned yet; silently ignore
        console.warn('Could not seed super admin doc:', err);
      }
    };
    seedSuperAdmin();
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  // ── Auth Methods ──────────────────────────────────

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        return { success: false, message: 'No account found with this email or wrong password.' };
      }
      if (err.code === 'auth/wrong-password') {
        return { success: false, message: 'Incorrect password.' };
      }
      if (err.code === 'auth/invalid-email') {
        return { success: false, message: 'Invalid email address format.' };
      }
      return { success: false, message: err.message || 'Login failed. Please try again.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Force refresh currentUser with display name
      setFirebaseUser({ ...cred.user });
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/email-already-in-use') {
        return { success: false, message: 'An account with this email already exists. Please Sign In instead.' };
      }
      if (err.code === 'auth/weak-password') {
        return { success: false, message: 'Password must be at least 6 characters.' };
      }
      if (err.code === 'auth/invalid-email') {
        return { success: false, message: 'Invalid email address format.' };
      }
      return { success: false, message: err.message || 'Signup failed. Please try again.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Sign-in popup was closed. Please try again.' };
      }
      return { success: false, message: err.message || 'Google sign-in failed.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  // ── Admin Management Methods ──────────────────────

  const addAdmin = async (email: string): Promise<{ success: boolean; message?: string }> => {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (adminEmails.map((e) => e.toLowerCase()).includes(normalizedEmail)) {
      return { success: false, message: 'This email is already an admin.' };
    }
    try {
      await setDoc(doc(db, 'admins', normalizedEmail), {
        email: normalizedEmail,
        addedAt: new Date().toISOString(),
        addedBy: currentUser?.email || 'unknown',
      });
      return { success: true };
    } catch (err) {
      console.error('Failed to add admin:', err);
      return { success: false, message: 'Failed to add admin. Check Firestore permissions.' };
    }
  };

  const removeAdmin = async (email: string): Promise<{ success: boolean; message?: string }> => {
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return { success: false, message: 'Cannot remove the super admin account.' };
    }
    try {
      await deleteDoc(doc(db, 'admins', normalizedEmail));
      return { success: true };
    } catch (err) {
      console.error('Failed to remove admin:', err);
      return { success: false, message: 'Failed to remove admin. Check Firestore permissions.' };
    }
  };

  const openAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthModalOpen,
        authModalTab,
        isAdmin,
        isLoading,
        adminEmails,
        login,
        signup,
        loginWithGoogle,
        logout,
        openAuthModal,
        closeAuthModal,
        addAdmin,
        removeAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
