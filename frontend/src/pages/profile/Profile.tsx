import { useEffect } from "react";
import { useNavigate } from "react-router";

const Profile = () => {
  const navigate = useNavigate();
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") ?? "null");
  } catch (e) {
    console.error("Failed to parse user from localStorage:", e);
    user = null;
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}

export default Profile;