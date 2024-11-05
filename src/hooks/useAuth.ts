import { useState, useEffect } from 'react';
import { User } from '../types';

const ADMIN_PASSWORD = "Hgm8Zq5b92R4Jf";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (password: string) => {
    if (password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin',
        isAdmin: true
      };
      setUser(adminUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, login, logout };
}