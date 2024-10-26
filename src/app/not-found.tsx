import { AuthLayout } from '@/components/layouts';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <AuthLayout>
      <div className="container flex justify-center items-center min-h-[calc(100vh-65px)] leading-none py-4">
        <div className="flex flex-col max-w-[400px] gap-[2rem] text-center">
          <h6>
            <span className="text-danger-300">404</span> - Page not found
          </h6>
          <h1 className="text-[2rem] lg:text-[3rem] font-medium">
            Can&apos;t find this <span className="line-through">page.</span>{' '}
          </h1>

          <Button href="/" as={Link} className="w-fit mx-auto">
            Home
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
