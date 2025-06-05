// scripts/importFirestoreData.js
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { readFile } from "fs/promises";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// Firebase config (replace with your env vars or use direct values)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importData(fileName) {
  try {
    const file = await readFile(`./${fileName}.json`, "utf-8");
    const data = JSON.parse(file);

    for (const key in data) {
      const fileData = data[key];
      await setDoc(doc(db, fileName, key), fileData);
      console.log(`✅ Uploaded ${fileName}/${key}`);
    }
  } catch (err) {
    console.error(`❌ Failed to import ${fileName}:`, err.message);
  }
}

// 🟡 Get CLI argument and run
const [,, fileName] = process.argv;

if (!fileName) {
  console.error("❌ Please provide a file name (without .json)");
  console.error("   Example: node importFirestoreData.js trainers");
  process.exit(1);
}

importData(fileName);