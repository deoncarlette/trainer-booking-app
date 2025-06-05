import { collection, getDocs } from "firebase/firestore";

export async function fetchAvailability(db) {
  const availabilityCol = collection(db, "availability");
  const snapshot = await getDocs(availabilityCol);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}