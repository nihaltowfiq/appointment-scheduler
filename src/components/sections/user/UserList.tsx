// /components/UserList.tsx
'use client';

import { getAllUsers } from '@/services/firebase/user';
import { Card } from '@nextui-org/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function UserList() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const userList = await getAllUsers();
      setUsers(userList);
    }
    fetchUsers();
  }, []);

  console.log({ users });

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <Card key={user.uid} className="p-4">
          <h3>{user.name}</h3>
          <p>Occupation: {user.occupation}</p>
          <Link
            href={`/users/${user.username}`}
            className="text-primary hover:underline"
          >
            View Profile
          </Link>
        </Card>
      ))}
    </div>
  );
}
