import { auth } from '@/services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuth;
