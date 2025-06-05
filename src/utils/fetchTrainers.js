import { collection, getDocs } from "firebase/firestore";

export async function fetchTrainers(db) {
  const cacheKey = "trainers_cache";

  // const cached = localStorage.getItem(cacheKey);
  // if (cached) {
  //   try {
  //     return JSON.parse(cached);
  //   } catch (err) {
  //     console.warn("Corrupt cache, clearing...");
  //     localStorage.removeItem(cacheKey);
  //   }
  // }

  // If no cache, fetch from Firestore
  const trainersCol = collection(db, "trainers");
  const snapshot = await getDocs(trainersCol);

  const trainers = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Cache for next time
  localStorage.setItem(cacheKey, JSON.stringify(trainers));

  return trainers;
}