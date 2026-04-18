import { useContext } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import { AuthContext } from "./auth-context";
=======
import { AuthContext } from "./AuthContext";
>>>>>>> parent of 6c5e844 (Revert "Implement grouped cursor pagination for events and user settings UI")
=======
import { AuthContext } from "./AuthContext";
>>>>>>> parent of 6c5e844 (Revert "Implement grouped cursor pagination for events and user settings UI")

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}