'use client';

import { Password } from '@/components/ui';
import { signUpSchema } from '@/libs/schemas';
import { SignUpFormData } from '@/libs/types';
import { auth, db } from '@/services/firebase';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Input } from '@nextui-org/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export default function SignUp() {
  // const [error, setError] = useState<string>('');

  // Setup react-hook-form with yupResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    const { username, password } = data;
    try {
      const userRef = doc(db, 'usernames', username);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // setError('Username already taken.');
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

      console.log('User registered successfully!');
    } catch (err) {
      console.log(err);

      // setError(err.message);
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
          placeholder="Enter your username"
          isInvalid={!!errors.username}
          errorMessage={errors.username?.message as string}
        />

        <Password register={register} errors={errors} />

        <div className="text-xs">
          Already have an account?{' '}
          <Link href="/signin" className="hover:text-primary">
            Sign In
          </Link>
        </div>

        <Button type="submit" className="mt-4" fullWidth color="primary">
          Sign Up
        </Button>
      </form>
    </Card>
  );
}
