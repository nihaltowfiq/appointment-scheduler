// /components/SignUpCard.tsx
'use client';

import { signUpSchema } from '@/libs/schemas';
import { SignUpFormData } from '@/libs/types';
import { auth, db, storage } from '@/services/firebase';
import { errorToast, successToast } from '@/services/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Input } from '@nextui-org/react';
import { setCookie } from 'cookies-next';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Password } from './Password';

export function SignUpCard() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema as any),
    defaultValues: { image: null },
  });

  const onSubmit = async (data: SignUpFormData) => {
    const { username, password, name, image, occupation } = data;
    setLoading(true);

    try {
      // Firebase Authentication
      const fakeEmail = `${username}@as.com`;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        fakeEmail,
        password
      );
      const user = userCredential.user;

      // Firebase Storage: Upload image if available
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Firestore: Store user data
      const userData = {
        uid: user.uid,
        username,
        name,
        occupation,
        imageUrl,
      };
      await setDoc(doc(db, 'users', user.uid), userData);

      // Firebase Token & Cookie
      const token = await user.getIdToken();
      setCookie('token', token, { maxAge: 60 * 60 * 24 * 5, path: '/' });
      // dispatch(saveUser(userData));

      successToast({ message: 'User registered successfully!' });
      router.push('/');
    } catch (err: any) {
      console.error(err);
      errorToast({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue('image', file);
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

        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={handleImageChange}
        />
        {errors.image && (
          <p className="text-red-500 text-xs">{errors.image.message}</p>
        )}

        <Password register={register as any} errors={errors as any} />

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
