'use client';

import { AuthCard } from '@/components/ui';
import { signInSchema } from '@/libs/schemas';
import { SignInFormData, User } from '@/libs/types';
import { auth, db } from '@/services/firebase';
import { getUser } from '@/services/firebase/user';
import { errorToast, successToast } from '@/services/toast';
import { updateUser } from '@/store/features';
import { yupResolver } from '@hookform/resolvers/yup';
import { setCookie } from 'cookies-next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export function SignInSection() {
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

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
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        errorToast({ message: 'Invalid username or password.' });
        setLoading(false);
        return;
      }

      const fakeEmail = `${username}@as.com`;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        fakeEmail,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      const currentUser = (await getUser(user.uid)) as User;

      setCookie('token', token, { maxAge: 60 * 60 * 24 * 5, path: '/' });
      setCookie('uid', user.uid, { maxAge: 60 * 60 * 24 * 5, path: '/' });
      dispatch(
        updateUser({
          uid: currentUser.uid,
          name: currentUser.name,
          occupation: currentUser.occupation,
          username: currentUser.username,
        })
      );

      successToast({ message: 'User signed in successfully!' });
      router.push('/');
    } catch ({ message }: any) {
      errorToast({ message });
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
