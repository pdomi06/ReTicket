import { useAuth } from "../../contexts/auth/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Profile Page</h1>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
}

export default Profile;