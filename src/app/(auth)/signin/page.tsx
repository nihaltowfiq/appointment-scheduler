'use client';

import { Password } from '@/components/ui';
import { signInSchema } from '@/libs/schemas';
import { SignInFormData } from '@/libs/types';
import { auth, db } from '@/services/firebase';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Input } from '@nextui-org/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function SignIn() {
  // const [error, setError] = useState('');

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    const { username, password } = data;
    try {
      // Look up the username in Firestore
      const userRef = doc(db, 'usernames', username);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // setError('Invalid username or password.');
        return;
      }

      // Generate the surrogate email using the username
      const fakeEmail = `${username}@as.com`;

      // Sign in using Firebase Authentication
      await signInWithEmailAndPassword(auth, fakeEmail, password);

      console.log('User signed in successfully!');
    } catch (err) {
      console.log(err);

      // setError(err);
    }
  };

  return (
    <Card className="mx-3 w-[24rem] p-6">
      <h1 className="text-xl font-semibold text-center mb-6">Sign In</h1>
      {/* {error && <p className="text-red-500">{error}</p>} */}

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Input
          fullWidth
          label="Username"
          variant="bordered"
          className="mb-4"
          {...register('username')}
          autoComplete="off"
          placeholder="Enter your username"
          isInvalid={!!errors.username}
          errorMessage={errors.username?.message as string}
        />

        <Password register={register} errors={errors} />

        <div className="text-xs">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="hover:text-primary">
            Sign Up
          </Link>
        </div>

        <Button type="submit" className="mt-4" fullWidth color="primary">
          Sign In
        </Button>
      </form>
    </Card>
  );
}
