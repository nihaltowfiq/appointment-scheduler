import { db } from '@/services/firebase';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';

export async function getUserByUsername(username: string) {
  const userRef = doc(db, 'usernames', username);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userDoc = await getDoc(doc(db, 'users', userSnap.data().uid));
    return userDoc.exists() ? userDoc.data() : null;
  }
  return null;
}

export async function getAllUsers() {
  const usersRef = collection(db, 'users');
  const userQuery = query(usersRef);
  const querySnapshot = await getDocs(userQuery);
  return querySnapshot.docs.map((doc) => doc.data());
}
