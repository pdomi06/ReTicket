import { Link, useNavigate } from "react-router";
import Input from "../../components/ui/input/Input";
import style from './Login.module.css'
import Button from "../../components/ui/button/Button";
import { useState } from "react";

const logo = '/img/logo/logo_transparrent_white.svg';
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");




const Login = () => {
  const [errors, setErrors] = useState<string[]>([]);


  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      alert("Please provide a valid email and password.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const rawBody = await response.text();
      let data: { message?: string; data?: { user?: unknown; token?: string } } | null = null;

      try {
        data = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        throw new Error("Login endpoint returned non-JSON response.");
      }

      if (!response.ok) {
        throw new Error(data?.message ?? "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(data?.data?.user ?? null));
      localStorage.setItem("token", data?.data?.token ?? "");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      setErrors([error instanceof Error ? error.message : "Login failed. Please check your credentials and try again."]);
    }
  }
  return (
    <main className={style["login-page"]}>
      <div className={style["login-container"]}>
        <h2><img src={logo} alt="ReTicket Logo" /> ReTicket</h2>
        <h4>Don't have an account? <Link to="/register">Register</Link></h4>

        {errors.length > 0 && (
          <div className={style["errors"]}>
            {errors.map((error, index) => (
              <p key={index} className={style["error"]}>
                {error}
              </p>
            ))}
          </div>
        )}
        <form method="POST" className={style["login-form"]} onSubmit={handleSubmit}>

          <Input type="email" name="email" label="Email" />

          <Input type="password" name="password" label="Password" />

          <Button type="submit" text="Login" variant="primary" />
        </form>
      </div>
    </main>
  )
}

export default Login;