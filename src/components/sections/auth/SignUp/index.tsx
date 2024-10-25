'use client';

import { AuthCard } from '@/components/ui';
import { signUpSchema } from '@/libs/schemas';
import { SignUpFormData } from '@/libs/types';
import { auth, db } from '@/services/firebase';
import { errorToast, successToast } from '@/services/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { setCookie } from 'cookies-next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function SignUpSection() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    const { username, password } = data;
    setLoading(true);

    try {
      const userRef = doc(db, 'usernames', username);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        errorToast({ message: 'Username already taken.' });
        return;
      }

      const fakeEmail = `${username}@as.com`;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        fakeEmail,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, 'usernames', username), { uid: user.uid });

      const token = await user.getIdToken(); // Get the Firebase ID token

      // Store the token in cookies
      setCookie('token', token, {
        maxAge: 60 * 60 * 24 * 5, // Expires in 5 days
        path: '/',
      });

      successToast({ message: 'User registered successfully!' });
      router.push('/');
    } catch (err: any) {
      console.log(err);
      errorToast({ message: err.message });
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
