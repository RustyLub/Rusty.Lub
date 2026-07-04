import { db } from "../src/firebase.js";
import { collection, getDocs } from "firebase/firestore";

async function listNews() {
  const querySnapshot = await getDocs(collection(db, 'news'));
  querySnapshot.forEach((doc) => {
    console.log(`ID: ${doc.id}`);
    console.log(JSON.stringify(doc.data(), null, 2));
  });
}
listNews();
