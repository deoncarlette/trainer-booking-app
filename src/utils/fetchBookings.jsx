import { collection, getDocs } from "firebase/firestore";

export async function fetchBookings(db) {
  const bookingsCol = collection(db, "bookings");
  const snapshot = await getDocs(bookingsCol);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}