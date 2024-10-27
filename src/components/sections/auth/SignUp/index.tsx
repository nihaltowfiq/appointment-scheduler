'use client';

import { Password } from '@/components/ui';
import { signUpSchema } from '@/libs/schemas';
import { SignUpFormData } from '@/libs/types';
import { auth, db } from '@/services/firebase';
import { errorToast, successToast } from '@/services/toast';

import { updateUser } from '@/store/features';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Input } from '@nextui-org/react';
import { setCookie } from 'cookies-next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

export function SignUpSection() {
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema as any),
  });

  const onSubmit = async (data: SignUpFormData) => {
    const { username, password, name, occupation } = data;
    setLoading(true);

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        errorToast({ message: 'Username already taken.' });
        setLoading(false);
        return;
      }

      const fakeEmail = `${username}@as.com`;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        fakeEmail,
        password
      );
      const user = userCredential.user;

      // Firestore: Store user data
      const userData = {
        uid: user.uid,
        email: fakeEmail,
        username,
        name,
        occupation,
      };
      await setDoc(doc(db, 'users', user.uid), userData);

      // Firebase Token & Cookie
      const token = await user.getIdToken();
      setCookie('token', token, { maxAge: 60 * 60 * 24 * 5, path: '/' });
      setCookie('uid', user.uid, { maxAge: 60 * 60 * 24 * 5, path: '/' });
      dispatch(
        updateUser({
          uid: userData.uid,
          name: userData.name,
          username: userData.username,
          occupation: userData.occupation,
        })
      );
      successToast({ message: 'User registered successfully!' });
      router.push('/');
    } catch ({ message }: any) {
      errorToast({ message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-3 w-[24rem] p-6">
      <h1 className="text-xl font-semibold text-center">Sign Up</h1>
      <p className="text-xs text-center mb-6">Appointment Scheduler</p>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Input
          fullWidth
          required
          label="Name"
          variant="bordered"
          className="mb-4"
          {...register('name')}
          placeholder="Enter your Name"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message as string}
        />

        <Input
          fullWidth
          required
          label="Username"
          variant="bordered"
          className="mb-4"
          {...register('username')}
          placeholder="Enter your username"
          isInvalid={!!errors.username}
          errorMessage={errors.username?.message as string}
        />

        <Input
          fullWidth
          required
          label="Occupation"
          variant="bordered"
          className="mb-4"
          {...register('occupation')}
          placeholder="Enter your occupation"
          isInvalid={!!errors.occupation}
          errorMessage={errors.occupation?.message as string}
        />

        <Password register={register as any} errors={errors as any} />

        <div className="text-xs">
          Already have an account?{' '}
          <Link href="/signin" className="hover:text-primary">
            Sign In
          </Link>
        </div>

        <Button
          fullWidth
          type="submit"
          color="primary"
          className="mt-4"
          isLoading={isLoading}
        >
          Sign Up
        </Button>
      </form>
    </Card>
  );
}
