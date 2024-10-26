// /app/users/[username]/page.tsx

import { UserProfile } from '@/components/sections/user/UserProfile';

export default function UserPage({ params }: { params: { username: string } }) {
  return <UserProfile username={params.username} />;
}
