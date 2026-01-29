import { auth, provider } from "@/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function LoginButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  const login = async () => {
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img src={user.photoURL} className="w-8 h-8 rounded-full" />
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={login} className="bg-red-500 hover:bg-red-600 text-white">
      Sign in with Google
    </Button>
  );
}
