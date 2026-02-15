import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../../components/ui/loginButton/loginButton"
import LogoutButton from "../../components/ui/logoutButton/logoutButton"
import { Link } from "react-router";

const Test = () => {
  const {user} = useAuth0();
  return (
    <div>
        <h1>Test Page</h1>
        <LoginButton />
        <LogoutButton />
        <Link to="/profile">Go to Profile</Link>
       {user?.name}
        {user?.email}
        <img src={user?.picture} alt={user?.name} />
    </div>
    )
}

export default Test