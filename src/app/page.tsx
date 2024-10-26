import { MainLayout } from '@/components/layouts';
import { UsersList } from '@/components/sections';

export default function Home() {
  return (
    <MainLayout>
      <div className="container">
        <UsersList />
      </div>
    </MainLayout>
  );
}
