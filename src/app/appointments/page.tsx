import { MainLayout } from '@/components/layouts';
import { AppointmentList } from '@/components/sections';

export default function Appointments() {
  return (
    <MainLayout>
      <div className="container">
        <AppointmentList />
      </div>
    </MainLayout>
  );
}
