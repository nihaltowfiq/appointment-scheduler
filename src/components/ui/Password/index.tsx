import { SignInFormData } from '@/libs/types';
import { Input } from '@nextui-org/react';
import { useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { EyeFilledIcon } from './EyeFilledIcon';
import { EyeSlashFilledIcon } from './EyeSlashFilledIcon';

export function Password({ register, errors }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      fullWidth
      required
      label="Password"
      className="mb-4"
      variant="bordered"
      autoComplete="off"
      {...register('password')}
      placeholder="Enter your password"
      isInvalid={!!errors.password}
      errorMessage={errors.password?.message as string}
      endContent={
        <button
          type="button"
          className="focus:outline-none"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
    />
  );
}

type Props = {
  errors: FieldErrors<SignInFormData>;
  register: UseFormRegister<SignInFormData>;
};
