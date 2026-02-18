import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  console.log(user);
  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }
  return (
    <div>
        {user?.name}
        {user?.email}
        <img src={user?.picture} alt={user?.name} />
    </div>
  );
}

export default Profile;