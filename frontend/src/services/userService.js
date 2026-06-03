import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";

// 🔥 GET ALL USERS
export const fetchUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// 🔥 CREATE USER
export const createUser = async (user) => {
  await addDoc(collection(db, "users"), user);
};

// 🔥 UPDATE USER
export const updateUser = async (id, data) => {
  const ref = doc(db, "users", id);
  await updateDoc(ref, data);
};

// 🔥 FIND USER BY EMAIL
export const findUserByEmail = async (email) => {
  const q = query(
    collection(db, "users"),
    where("email", "==", email)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))[0];
};