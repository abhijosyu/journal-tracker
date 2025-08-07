// src/components/LogoutButton.tsx
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

import "../Logout/Logout.css";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onLogout) onLogout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button onClick={handleLogout} className="Logout">
      Logout
    </button>
  );
}
