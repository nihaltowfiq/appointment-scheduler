import { MainLayout } from '@/components/layouts';
import { UserList } from '@/components/sections/user/UserList';

export default function Home() {
  return (
    <MainLayout>
      <div className="container">
        <UserList />
      </div>
    </MainLayout>
  );
}
