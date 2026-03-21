import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../../components/ui/input/Input";
import style from './Register.module.css'
import Button from "../../components/ui/button/Button";

const logo = '/img/logo/logo_transparrent_white.svg';
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");



const Register = () => {
    const [errors, setErrors] = useState<string[]>([]);

    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const password = formData.get("password");
        const passwordConfirmation = formData.get("password_confirmation");

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof phone !== "string" ||
            typeof password !== "string" ||
            typeof passwordConfirmation !== "string"
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            const rawBody = await response.text();
            let data: { message?: string; data?: { user?: unknown; token?: string } } | null = null;

            try {
                data = rawBody ? JSON.parse(rawBody) : null;
            } catch {
                throw new Error("Register endpoint returned non-JSON response.");
            }

            if (!response.ok) {
                setErrors(data?.message ? [data.message] : ["Registration failed. Please try again."]);
                throw new Error(data?.message ?? "Registration failed");
            }

            localStorage.setItem("user", JSON.stringify(data?.data?.user ?? null));
            localStorage.setItem("token", data?.data?.token ?? "");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error during registration:", error);
            setErrors(prevErrors => [...prevErrors, error instanceof Error ? error.message : "Registration failed. Please try again."]);
            alert(error instanceof Error ? error.message : "Registration failed. Please try again.");
        }
    }
    return (
        <main className={style["register-page"]}>
            <h2><img src={logo} alt="ReTicket Logo" /> ReTicket</h2>
            <h4>Already have an account? <Link to="/login">Log in</Link></h4>

            <div className={style["register-container"]}>
                {errors.length > 0 && (
                    <div className={style["errors"]}>
                        {errors.map((error, index) => (
                            <p key={index} className={style["error"]}>
                                {error}
                            </p>
                        ))}
                    </div>
                )}
                <form method="POST" className={style["register-form"]} onSubmit={handleSubmit}>
                    <Input type="text" name="name" label="Username" />

                    <Input type="email" name="email" label="Email" />

                    <Input type="tel" name="phone" label="Telephone number" />

                    <Input type="password" name="password" label="Password" />

                    <Input type="password" name="password_confirmation" label="Confirm Password" />

                    <div className={style["checkbox-container"]}>
                        <input type="checkbox" name="checkbox" id="checkbox" required />
                        <label htmlFor="checkbox" className={style["checkbox-label"]}
                        >I have read and I agree to the
                            <Link to="/terms">Terms and Conditions</Link> and
                            <Link to="/privacy">privacy policy</Link>.</label>
                    </div>
                    <Button type="submit" text="Register" />
                </form>
            </div>
        </main>
    )
}
export default Register;