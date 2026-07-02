import { db } from './src/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function main() {
  const querySnapshot = await getDocs(collection(db, 'chat_users'));
  console.log("Total users:", querySnapshot.size);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}

main().catch(console.error);
