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
}: Props) {
  const pathname = usePathname();

  return (
    <Card className="mx-3 w-[24rem] p-6">
      <h1 className="text-xl font-semibold text-center mb-6">
        {pathname === '/signin' ? 'Sign In' : 'Sign Up'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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

        {pathname === '/signin' ? (
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
          Sign Up
        </Button>
      </form>
    </Card>
  );
}

type Props = {
  isLoading: boolean;
  errors: FieldErrors<SignInFormData | SignUpFormData>;
  register: UseFormRegister<SignInFormData | SignUpFormData>;
  onSubmit: (data: SignInFormData | SignUpFormData) => Promise<void>;
  handleSubmit: UseFormHandleSubmit<SignUpFormData | SignInFormData, undefined>;
};
