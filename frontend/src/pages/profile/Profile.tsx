import { redirect } from "react-router";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user") ?? "null");
  if (!user) {
    redirect("/login");
  }
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}

export default Profile;