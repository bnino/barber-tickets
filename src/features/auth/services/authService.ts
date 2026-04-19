import { auth, db } from "../../../shared/services/firebaseService";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // crear usuario si no existe
    await setDoc(ref, {
      email: user.email,
      name: user.displayName,
      role: "user"
    });
  }

  return user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const logout = () => signOut(auth);

export const subscribeToAuth = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getUserRole = async (uid: string) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data().role;
  }

  return "user";
};

export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {

  const res = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", res.user.uid), {
    email,
    name,
    role: "user"
  });

  await updateProfile(res.user, {
    displayName: name
});

  return res.user;
};