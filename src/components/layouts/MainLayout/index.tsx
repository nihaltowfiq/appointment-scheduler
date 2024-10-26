'use client';

import { auth, setAuthPersistence } from '@/services/firebase';
import { AppDispatch } from '@/store';
import { clearUser, fetchUserInfo, getAppState } from '@/store/features';
import { formatUsername } from '@/utils';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function MainLayout({ children }: { children?: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const { email } = useSelector(getAppState);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setAuthPersistence();
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const handleSignOut = () => {
    auth.signOut();
    deleteCookie('token');
    dispatch(clearUser());
    router.push('/signin');
  };

  return (
    <section className="min-h-screen">
      <Navbar
        isBordered
        isBlurred
        maxWidth="xl"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className="md:hidden pr-3" justify="start">
          <NavbarBrand className="justify-start">
            <Link
              href="/"
              title="Appointment Scheduler"
              className="font-extrabold text-2xl"
            >
              AS
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="md:hidden" justify="end">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
        </NavbarContent>

        <NavbarContent className="hidden md:flex gap-4" justify="center">
          <NavbarBrand className="justify-center">
            <Link
              href="/"
              title="Appointment Scheduler"
              className="font-extrabold text-2xl"
            >
              AS
            </Link>
          </NavbarBrand>
          <NavbarItem className="font-bold">Appointment Scheduler</NavbarItem>
        </NavbarContent>

        <NavbarContent className="hidden md:flex" justify="end">
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  showFallback
                  isBordered
                  size="sm"
                  name={formatUsername(email)}
                  className="cursor-pointer"
                />
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          <NavbarMenuItem>
            {/* <Avatar
              size="sm"
              showFallback
              isBordered
              name={formatUsername(email)}
            /> */}
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Button variant="bordered" color="danger">
              Log Out
            </Button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <main className="min-h-[calc(100vh-65px)]">{children}</main>
    </section>
  );
}
