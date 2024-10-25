'use client';

import { AuthCard } from '@/components/ui';
import { signInSchema } from '@/libs/schemas';
import { SignInFormData } from '@/libs/types';
import { auth, db } from '@/services/firebase';
import { errorToast, successToast } from '@/services/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { setCookie } from 'cookies-next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function SignInSection() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    const { username, password } = data;
    setLoading(true);
    try {
      // Look up the username in Firestore
      const userRef = doc(db, 'usernames', username);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        errorToast({ message: 'Invalid username or password.' });
        return;
      }

      const fakeEmail = `${username}@as.com`;

      const userCredential = await signInWithEmailAndPassword(
        auth,
        fakeEmail,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken(); // Get the Firebase ID token

      // Store the token in cookies
      setCookie('token', token, {
        maxAge: 60 * 60 * 24 * 5, // Expires in 5 days
        path: '/',
      });

      successToast({ message: 'User signed in successfully!' });
      router.push('/');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthCard
      errors={errors}
      register={register}
      onSubmit={onSubmit}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
    />
  );
}
