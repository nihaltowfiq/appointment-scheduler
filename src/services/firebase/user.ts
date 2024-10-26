import { User } from '@/libs/types';
import { db } from '@/services/firebase';
import { getCookie } from 'cookies-next';
import { collection, getDocs, query } from 'firebase/firestore';

export async function getAllUsers(): Promise<User[] | null> {
  const usersRef = collection(db, 'users');
  const userQuery = query(usersRef);
  const querySnapshot = await getDocs(userQuery);

  const uid = getCookie('uid');
  const users = querySnapshot.docs
    .map((doc) => doc.data())
    .filter((el) => el.uid !== uid) as User[];
  return users;
}

export async function getUser(id?: string): Promise<User | null> {
  let uid;
  const usersRef = collection(db, 'users');
  const userQuery = query(usersRef);
  const querySnapshot = await getDocs(userQuery);

  if (!id) uid = getCookie('uid');
  else uid = id;

  const users = querySnapshot.docs
    .map((doc) => doc.data())
    .filter((el) => el.uid === uid);

  return (users?.[0] as User) || null;
}
