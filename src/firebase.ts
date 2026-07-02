import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GithubAuthProvider, 
  GoogleAuthProvider,
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where,
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  Timestamp,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKBAhIPVmCFhg8hom5G91VEbY3kaxNhGQ",
  authDomain: "psychic-origin-5kpr3.firebaseapp.com",
  projectId: "psychic-origin-5kpr3",
  storageBucket: "psychic-origin-5kpr3.firebasestorage.app",
  messagingSenderId: "739344973051",
  appId: "1:739344973051:web:329ad00b8b4f1e1385c45e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use the custom database ID provided in the configuration
const db = getFirestore(app, "ai-studio-rusthub-2e66bd8d-85dd-4eba-bb83-f354ddc97d59");

const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  db, 
  githubProvider, 
  googleProvider,
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  Timestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  type User
};
