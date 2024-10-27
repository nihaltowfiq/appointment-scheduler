import { Appointment } from '@/libs/types';
import { db } from '@/services/firebase';
import { getCookie } from 'cookies-next';
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export async function getAppointments(): Promise<Appointment[]> {
  const appointmentsRef = collection(db, 'appointments');
  const querySnapshot = await getDocs(appointmentsRef);
  const uid = getCookie('uid');

  const appointments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[];

  const filtered = appointments.filter(
    (el) => !!(el.receiver.uid === uid || el.scheduler.uid === uid)
  );

  return filtered;
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment['status']
): Promise<void> {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('id', '==', id));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('No appointment found with the specified id.');
    }

    // Update status of the first matched document (assuming `id` is unique)
    const appointmentDoc = querySnapshot.docs[0];
    await updateDoc(appointmentDoc.ref, { status: status });
  } catch (err) {
    console.log(err);
    throw new Error('Failed to update appointment status.');
  }
}
