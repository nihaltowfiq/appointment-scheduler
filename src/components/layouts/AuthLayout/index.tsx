import { Navbar, NavbarBrand } from '@nextui-org/react';
import Link from 'next/link';
import { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen">
      <Navbar position="static">
        <NavbarBrand className="justify-center">
          <Link
            href="/"
            title="Appointment Scheduler"
            className="font-extrabold text-2xl"
          >
            AS
          </Link>
        </NavbarBrand>
      </Navbar>

      <main className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center">
        {children}
      </main>
    </section>
  );
}
