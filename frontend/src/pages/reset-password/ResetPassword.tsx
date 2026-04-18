<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
=======
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
>>>>>>> parent of 6c5e844 (Revert "Implement grouped cursor pagination for events and user settings UI")
import { LuLock, LuCheck } from "react-icons/lu";
import styles from "./ResetPassword.module.css";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import Notification from "../../components/ui/notification/Notification";

import { apiFetch } from "../../lib/apiFetch";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; variant: "success" | "error" } | null>(null);
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);
<<<<<<< HEAD
    const redirectTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current !== null) {
                window.clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);
=======
>>>>>>> parent of 6c5e844 (Revert "Implement grouped cursor pagination for events and user settings UI")

    if (!token || !email) {
        return (
            <section className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <div className={styles.errorBox}>
                            <h1 className={styles.title}>Invalid Reset Link</h1>
                            <p className={styles.text}>The password reset link is invalid or has expired.</p>
                            <Button
                                type="button"
                                text="Back to Login"
                                onClick={() => navigate("/login")}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    async function readErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
        const contentType = response.headers.get("content-type") ?? "";

        if (!contentType.includes("application/json")) {
            const raw = await response.text();
            return raw.trim() || fallbackMessage;
        }

        const payload = await response.json() as {
            message?: string;
            error?: string;
            errors?: Record<string, string[]>;
        };

        if (payload.message) {
            return payload.message;
        }

        if (payload.error) {
            return payload.error;
        }

        const firstValidationError = payload.errors ? Object.values(payload.errors).flat()[0] : null;
        return firstValidationError ?? fallbackMessage;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (password !== passwordConfirmation) {
            setMessage({ text: "Passwords do not match.", variant: "error" });
            return;
        }

        if (!password.trim()) {
            setMessage({ text: "Password is required.", variant: "error" });
            return;
        }

        if (password.length < 8) {
            setMessage({ text: "Password must be at least 8 characters.", variant: "error" });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await apiFetch(`${apiBaseUrl}/password/reset`, {
                method: "POST",
                includeAuth: false,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            if (!response.ok) {
                const errorMessage = await readErrorMessage(response, "Failed to reset password.");
                setMessage({ text: errorMessage, variant: "error" });
                return;
            }

            const responseMessage = await readErrorMessage(response, "Password reset successfully.");
            setMessage({ text: responseMessage, variant: "success" });
            setIsResetSuccessful(true);

<<<<<<< HEAD
            if (redirectTimeoutRef.current !== null) {
                window.clearTimeout(redirectTimeoutRef.current);
            }

            redirectTimeoutRef.current = window.setTimeout(() => {
=======
            setTimeout(() => {
>>>>>>> parent of 6c5e844 (Revert "Implement grouped cursor pagination for events and user settings UI")
                navigate("/login");
            }, 2000);
        } catch {
            setMessage({ text: "An error occurred while resetting your password.", variant: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.page}>
            <div className={styles.container}>
                <div className={styles.card}>
                    {isResetSuccessful ? (
                        <div className={styles.successBox}>
                            <LuCheck className={styles.successIcon} />
                            <h1 className={styles.successTitle}>Password Reset Successful</h1>
                            <p className={styles.successText}>
                                Your password has been reset successfully. You will be redirected to login shortly.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.header}>
                                <LuLock className={styles.headerIcon} />
                                <h1 className={styles.title}>Reset Your Password</h1>
                                <p className={styles.subtitle}>Enter your new password below</p>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <Input
                                    type="password"
                                    label="New Password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    theme="dark"
                                    size="medium"
                                />

                                <Input
                                    type="password"
                                    label="Confirm Password"
                                    name="password-confirmation"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    theme="dark"
                                    size="medium"
                                />

                                {message && (
                                    <Notification
                                        text={message.text}
                                        variant={message.variant}
                                    />
                                )}

                                <Button
                                    type="submit"
                                    text={isSubmitting ? "Resetting..." : "Reset Password"}
                                    disabled={isSubmitting}
                                />
                            </form>

                            <p className={styles.footerText}>
                                Remember your password?{" "}
<<<<<<< HEAD
                                <Link to="/login" className={styles.link}>
                                    Back to login
                                </Link>
=======
                                <a href="/login" className={styles.link}>
                                    Back to login
                                </a>
>>>>>>> parent of 6c5e844 (Revert "Implement grouped cursor pagination for events and user settings UI")
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
