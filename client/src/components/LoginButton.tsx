import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useEffect, useState } from "react";

export default function LoginButton() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    return auth.onAuthStateChanged(u => setUser(u));
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return <button onClick={login}>Login with Google</button>;
  }

  return (
    <div className="flex items-center gap-3">
      <span>{user.displayName}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
