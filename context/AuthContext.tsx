import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as AppUser } from '../types';
import { auth, isFirebaseConfigured } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  verifyAccount: (token: string) => boolean; 
  logout: () => void;
  deleteAccount: () => void;
  updateProfile: (name: string, avatar?: string) => void;
  isAuthenticated: boolean;
  pendingEmail: string | null;
  demoToken: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  // Map Firebase User to App User
  const mapUser = (fbUser: FirebaseUser): AppUser => {
    return {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Community Member',
      email: fbUser.email || '',
      isVerified: fbUser.emailVerified || true, 
      isAdmin: fbUser.email === 'admin@voicethroughimage.org',
      avatar: fbUser.photoURL || undefined
    };
  };

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setUser(mapUser(fbUser));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
      return unsubscribe;
    } else {
      // Demo Mode Initialization
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        const pw = password || "password123"; 
        await signInWithEmailAndPassword(auth, email, pw);
        return { success: true };
      } catch (error: any) {
        console.error("Login Error:", error);
        let msg = "Login failed.";
        if (error.code === 'auth/invalid-credential') msg = "Invalid email or password.";
        if (error.code === 'auth/user-not-found') msg = "User not found.";
        if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
        return { success: false, error: msg };
      }
    } else {
      // Demo Mode Login
      setUser({
        id: 'demo-user-123',
        name: 'Demo User',
        email: email,
        isVerified: true,
        isAdmin: false
      });
      return { success: true };
    }
  };

  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // User state is updated by onAuthStateChanged
        return { success: true };
      } catch (error: any) {
        console.error("Google Login Error:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Demo Mode Google Login Simulation
      setUser({
        id: 'demo-google-user',
        name: 'Google User (Demo)',
        email: 'user@gmail.com',
        isVerified: true,
        isAdmin: false,
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
      });
      return { success: true };
    }
  };

  const signup = async (name: string, email: string, password?: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        const pw = password || "password123";
        const userCredential = await createUserWithEmailAndPassword(auth, email, pw);
        await firebaseUpdateProfile(userCredential.user, {
          displayName: name
        });
        setUser(mapUser(userCredential.user));
        return { success: true };
      } catch (error: any) {
        console.error("Signup Error:", error);
        let msg = "Signup failed.";
        if (error.code === 'auth/email-already-in-use') msg = "Email already in use.";
        if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
        return { success: false, error: msg };
      }
    } else {
      // Demo Mode Signup
      setUser({
        id: 'demo-user-123',
        name: name,
        email: email,
        isVerified: true,
        isAdmin: false
      });
      return { success: true };
    }
  };

  const verifyAccount = (token: string) => {
    return true;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
  };

  const deleteAccount = async () => {
    if (isFirebaseConfigured && auth) {
      const currentUser = auth.currentUser;
      if (currentUser) {
          try {
              await currentUser.delete();
          } catch (e) {
              console.error("Error deleting account", e);
          }
      }
    }
    setUser(null);
  };

  const updateProfile = async (name: string, avatar?: string) => {
    if (isFirebaseConfigured && auth) {
      const currentUser = auth.currentUser;
      if (currentUser) {
          try {
              await firebaseUpdateProfile(currentUser, {
                  displayName: name,
                  photoURL: avatar
              });
          } catch (e) {
              console.error("Error updating profile", e);
          }
      }
    }
    // Update local state for both modes
    setUser(prev => prev ? { ...prev, name, avatar } : null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login,
      loginWithGoogle, 
      signup, 
      verifyAccount, 
      logout, 
      deleteAccount,
      updateProfile, 
      isAuthenticated: !!user,
      pendingEmail,
      demoToken,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};