import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DashboardData, Transaction } from '../types';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  dashboard: DashboardData | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Listen to user document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            setUser({ ...userData, id: firebaseUser.uid as any }); // Map UID to id
          }
        });

        // Listen to transactions
        const txQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', firebaseUser.uid),
          orderBy('created_at', 'desc'),
          limit(10)
        );
        const unsubscribeTx = onSnapshot(txQuery, (snap) => {
          const history = snap.docs.map(d => ({ id: d.id, ...d.data() } as any)) as Transaction[];
          setDashboard(prev => ({
            balance: user?.balance || 0,
            profit: user?.profit || 0,
            activeInvestment: user?.activeInvestment || 0,
            ...prev,
            history
          }));
        });

        setLoading(false);
        return () => {
          unsubscribeUser();
          unsubscribeTx();
        };
      } else {
        setUser(null);
        setDashboard(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Update dashboard values when user changes
  useEffect(() => {
    if (user) {
      setDashboard(prev => ({
        ...prev,
        balance: user.balance,
        profit: user.profit,
        activeInvestment: user.activeInvestment || 0,
        history: prev?.history || []
      }));
    }
  }, [user]);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, dashboard, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
