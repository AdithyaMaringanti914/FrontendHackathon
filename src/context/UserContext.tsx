'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number;
  height: number;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string;
}

export interface UserData {
  profile: UserProfile | null;
  healthData: string | null;
  profilePicture: string | null;
  basic?: { email: string; name?: string } | null;
}

interface UserContextType {
  user: UserData;
  setUserProfile: (profile: UserProfile) => void;
  setHealthData: (data: string) => void;
  setUserProfilePicture: (url: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData>({
    profile: null,
    healthData: null,
    profilePicture: null,
    basic: null,
  });

  React.useEffect(() => {
    try {
      const currentUserRaw = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
      const email = currentUserRaw ? (JSON.parse(currentUserRaw)?.email as string | undefined) : undefined;
      if (email) {
        const stored = localStorage.getItem(`user_${email}`);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          const name = JSON.parse(currentUserRaw!).name as string | undefined;
          const initial: UserData = { profile: null, healthData: null, profilePicture: null, basic: { email, name } };
          localStorage.setItem(`user_${email}`, JSON.stringify(initial));
          setUser(initial);
        }
      }
    } catch {}
  }, []);

  const setUserProfile = (profile: UserProfile) => {
    setUser((prevUser) => {
      const next = { ...prevUser, profile };
      try {
        const currentUserRaw = localStorage.getItem('currentUser');
        const email = currentUserRaw ? (JSON.parse(currentUserRaw)?.email as string | undefined) : undefined;
        if (email) {
          localStorage.setItem(`user_${email}`, JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  const setHealthData = (data: string) => {
    setUser((prevUser) => {
      const next = { ...prevUser, healthData: data };
      try {
        const currentUserRaw = localStorage.getItem('currentUser');
        const email = currentUserRaw ? (JSON.parse(currentUserRaw)?.email as string | undefined) : undefined;
        if (email) {
          localStorage.setItem(`user_${email}`, JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  const setUserProfilePicture = (url: string) => {
    setUser((prevUser) => {
      const next = { ...prevUser, profilePicture: url };
      try {
        const currentUserRaw = localStorage.getItem('currentUser');
        const email = currentUserRaw ? (JSON.parse(currentUserRaw)?.email as string | undefined) : undefined;
        if (email) {
          localStorage.setItem(`user_${email}`, JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUserProfile, setHealthData, setUserProfilePicture }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
