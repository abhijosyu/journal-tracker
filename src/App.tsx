import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useState, useEffect } from "react";
import "./App.css";
import JournalController from "./controller/JournalController";
import { auth } from "./firebase";
import LoginForm from "./components/Login/Login";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const [showUserInfo, setShowUserInfo] = useState(false);

  // for auto logging in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);
  return (
    <>
      {user ? (
        <>
          <JournalController></JournalController>
        </>
      ) : (
        <LoginForm onAuthSuccess={(user) => setUser(user)} />
      )}
    </>
  );
}

export default App;
