'use client';

import { getUser } from '@/services/firebase/user';
import { Card } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserProfileProps = {
  username: string;
};

export function UserProfile({ username }: UserProfileProps) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser(username);
      if (!userData) {
        console.error('User not found');
        router.push('/'); // Redirect if user not found
      } else {
        setUser(userData);
      }
    }
    fetchUser();
  }, [username, router]);

  console.log(user);

  if (!user) return <p>Loading...</p>;

  return (
    <Card className="p-6">
      <h2>{user.name}</h2>
      <p>Username: {user.username}</p>
      <p>Occupation: {user.occupation}</p>
      {user.imageUrl && (
        <img src={user.imageUrl} alt={`${user.name}'s profile`} />
      )}
    </Card>
  );
}
