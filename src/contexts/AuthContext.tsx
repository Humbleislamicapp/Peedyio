import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UsageLimit {
  exportsCount: number;
  lastExportDate: string;
  tier: 'free' | 'pro' | 'team';
  aiActionsCount: number;
  documentsCount: number;
}

interface AuthContextType {
  currentUser: User | null;
  usageLimit: UsageLimit | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  incrementExportCount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usageLimit, setUsageLimit] = useState<UsageLimit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserDocument(user.uid);
      } else {
        setUsageLimit(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const syncUserDocument = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      const today = new Date().toISOString().split('T')[0];

      if (!userSnap.exists()) {
        // Create new user profile
        await setDoc(userRef, {
          email: auth.currentUser?.email || '',
          exportsCount: 0,
          lastExportDate: today,
          tier: 'free',
          aiActionsCount: 0,
          documentsCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setUsageLimit({ exportsCount: 0, lastExportDate: today, tier: 'free', aiActionsCount: 0, documentsCount: 0 });
      } else {
        const data = userSnap.data();
        const lastExportDate = data.lastExportDate || today;
        let exportsCount = data.exportsCount || 0;
        let tier = data.tier || 'free';
        let aiActionsCount = data.aiActionsCount || 0;
        let documentsCount = data.documentsCount || 0;

        // Reset if it's a new day (for exports)
        if (lastExportDate !== today) {
          exportsCount = 0;
          await updateDoc(userRef, {
            exportsCount: 0,
            lastExportDate: today,
            updatedAt: serverTimestamp()
          });
        }
        
        setUsageLimit({ exportsCount, lastExportDate: today, tier, aiActionsCount, documentsCount });
      }
    } catch (error) {
      console.error('Error syncing user doc:', error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  const incrementExportCount = async (): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const today = new Date().toISOString().split('T')[0];
      
      const newCount = (usageLimit?.exportsCount || 0) + 1;
      
      await updateDoc(userRef, {
        exportsCount: newCount,
        lastExportDate: today,
        updatedAt: serverTimestamp()
      });
      
      setUsageLimit({ exportsCount: newCount, lastExportDate: today });
      return true;
    } catch (error) {
      console.error('Error incrementing export count:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, usageLimit, loading, signInWithGoogle, signOut, incrementExportCount }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
