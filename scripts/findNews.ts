import { db } from "../src/firebase.js";
import { collection, query, getDocs } from "firebase/firestore";

async function findNews() {
  const q = query(collection(db, 'news'));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`ID: ${doc.id}, Title: ${data.title.ru}`);
  });
}

findNews();
