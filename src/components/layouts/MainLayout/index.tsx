'use client';

import { User } from '@/libs/types';
import { auth } from '@/services/firebase';
import { getUser } from '@/services/firebase/user';
import { errorToast } from '@/services/toast';
import { AppDispatch } from '@/store';
import { clearUser, getAppState, updateUser } from '@/store/features';
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
  const { username } = useSelector(getAppState);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      const user = (await getUser()) as User;

      if (!user) {
        handleSignOut();
        errorToast({ message: 'Sign In again!' });
        return;
      }

      dispatch(
        updateUser({
          uid: user.uid,
          name: user.name,
          occupation: user.occupation,
          username: user.username,
        })
      );
    })();
  }, [dispatch]);

  const handleSignOut = () => {
    auth.signOut();
    deleteCookie('token');
    deleteCookie('uid');
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
            <Dropdown className="min-w-fit" placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  showFallback
                  isBordered
                  size="sm"
                  name={username as string}
                  className="cursor-pointer"
                />
              </DropdownTrigger>
              <DropdownMenu className="w-fit">
                <DropdownItem href="/appointments" as={Link}>
                  Appointments
                </DropdownItem>
                <DropdownItem onClick={handleSignOut} color="danger">
                  Sign Out
                </DropdownItem>
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
