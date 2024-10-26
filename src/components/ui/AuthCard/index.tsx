import { SignInFormData, SignUpFormData } from '@/libs/types';
import { Button, Card, Input } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import { Password } from '../Password';

export function AuthCard({
  errors,
  register,
  onSubmit,
  handleSubmit,
  isLoading,
}: Props<SignInFormData | SignUpFormData>) {
  const pathname = usePathname();
  const isSignIn = pathname === '/signin';

  return (
    <Card className="mx-3 w-[24rem] p-6">
      <h1 className="text-xl font-semibold text-center">
        {isSignIn ? 'Sign In' : 'Sign Up'}
      </h1>
      <p className="text-xs text-center mb-6">Appointment Scheduler</p>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {!isSignIn && (
          <Input
            fullWidth
            required
            label="Name"
            variant="bordered"
            className="mb-4"
            {...register('name' as const)}
            placeholder="Enter your Name"
            isInvalid={isSignUpData(errors) && !!errors.name}
            errorMessage={
              isSignUpData(errors)
                ? (errors.name?.message as string)
                : undefined
            }
          />
        )}

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

        <Password register={register} errors={errors} />

        {isSignIn ? (
          <div className="text-xs">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="hover:text-primary">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="text-xs">
            Already have an account?{' '}
            <Link href="/signin" className="hover:text-primary">
              Sign In
            </Link>
          </div>
        )}

        <Button
          fullWidth
          type="submit"
          color="primary"
          className="mt-4"
          isLoading={isLoading}
        >
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
    </Card>
  );
}

function isSignUpData(
  errors: FieldErrors<SignInFormData | SignUpFormData>
): errors is FieldErrors<SignUpFormData> {
  return 'name' in errors;
}

type Props<T extends SignInFormData | SignUpFormData> = {
  isLoading: boolean;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  onSubmit: (data: T) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<T>;
};
