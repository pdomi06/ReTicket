import { useState } from "react";
import { LuBadgeCheck, LuLock, LuShieldCheck } from "react-icons/lu";
import styles from "./UserSettings.module.css";
import { useAuth } from "../../../contexts/auth/useAuth";
import Button from "../../../components/ui/button/Button";
import Notification from "../../../components/ui/notification/Notification";
import { apiFetch } from "../../../lib/apiFetch";

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

const UserSettings = () => {
    const { user: userData, refreshSession, clearSession } = useAuth();
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/+$/, "");
    const [resetEmail, setResetEmail] = useState(userData?.email ?? "");
    const [verificationMessage, setVerificationMessage] = useState<{ text: string; variant: "success" | "error" } | null>(null);
    const [passwordResetMessage, setPasswordResetMessage] = useState<{ text: string; variant: "success" | "error" } | null>(null);
    const [isSendingVerification, setIsSendingVerification] = useState(false);
    const [isSendingReset, setIsSendingReset] = useState(false);
    const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);

    const fullName = userData?.name?.trim() || "Emily Johnson";
    const email = userData?.email?.trim() || "johnson@example.com";
    const phone = userData?.phone?.trim() || "(213) 555-1234";
    const role = (userData?.role?.trim() || "vendor").replace(/^./, (char) => char.toUpperCase());
    const memberSince = userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : "-";

    const personalDetails = [
        { label: "Full name", value: fullName },
        { label: "Email", value: email },
        { label: "Phone Number", value: phone },
        { label: "Role", value: role },
        { label: "Member since", value: memberSince },
    ];

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

    const sendVerificationEmail = async () => {
        setVerificationMessage(null);
        setIsSendingVerification(true);

        try {
            const response = await apiFetch(`${apiBaseUrl}/email/verification-notification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const message = await readErrorMessage(response, "Failed to send verification email.");
                setVerificationMessage({ text: message, variant: "error" });
                return;
            }

            const message = await readErrorMessage(response, "Verification link sent.");
            setVerificationMessage({ text: message, variant: "success" });
        } catch {
            setVerificationMessage({ text: "Failed to send verification email.", variant: "error" });
        } finally {
            setIsSendingVerification(false);
        }
    };

    const refreshVerificationStatus = async () => {
        setIsRefreshingStatus(true);
        setVerificationMessage(null);

        try {
            const refreshed = await refreshSession();

            if (!refreshed) {
                setVerificationMessage({ text: "Unable to refresh verification status.", variant: "error" });
                return;
            }

            setVerificationMessage({ text: "Verification status refreshed.", variant: "success" });
        } finally {
            setIsRefreshingStatus(false);
        }
    };

    const sendPasswordResetEmail = async () => {
        setPasswordResetMessage(null);

        const trimmedEmail = resetEmail.trim();
        if (!trimmedEmail) {
            setPasswordResetMessage({ text: "Please enter an email address.", variant: "error" });
            return;
        }

        setIsSendingReset(true);

        try {
            const response = await apiFetch(`${apiBaseUrl}/password/forgot`, {
                method: "POST",
                includeAuth: false,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email: trimmedEmail }),
            });

            if (!response.ok) {
                const message = await readErrorMessage(response, "Failed to send password reset email.");
                setPasswordResetMessage({ text: message, variant: "error" });
                return;
            }

            const message = await readErrorMessage(
                response,
                "If a user with that email address exists, we have sent a password reset link."
            );
            setPasswordResetMessage({ text: message, variant: "success" });
        } catch {
            setPasswordResetMessage({ text: "Failed to send password reset email.", variant: "error" });
        } finally {
            setIsSendingReset(false);
        }
    };
    const handleLogOut = async () => {
        try {
            await apiFetch(`${apiBaseUrl}/logout`, {
                method: "POST",
            });
        } finally {
            clearSession();
        }
    };

    return (
        <section className={styles.page}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>{getInitials(fullName)}</div>
                <div>
                    <h1 className={styles.nameRow}>
                        <span>
                            {fullName + " "}
                            {userData?.email_verified && (
                                <LuBadgeCheck className={styles.verifiedBadge} title="Email verified" />
                            )}
                        </span>
                    </h1>
                    <p className={styles.email}>{email}</p>
                </div>
                <div className={styles.profileHeaderActions}>
                    <Button text="Log out" onClick={handleLogOut}/>
                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Personal details</h2>
                <dl className={styles.detailsTable}>
                    {personalDetails.map((item) => (
                        <div key={item.label} className={styles.detailsRow}>
                            <dt className={styles.detailsKey}>{item.label}:</dt>
                            <dd className={styles.detailsValue}>{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className={styles.card}    >
                <h2 className={styles.cardTitle}>Security Settings</h2>
                <div className={styles.securityGrid}>
                    <div className={styles.securityItem}>
                        <LuLock className={styles.securityIcon} />
                        <div>
                            <h3 className={styles.securityTitle}>Password</h3>
                            <p className={styles.securityText}>Send a password reset link to your email.</p>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel} htmlFor="password-reset-email">Email</label>
                                <input
                                    id="password-reset-email"
                                    type="email"
                                    className={styles.fieldInput}
                                    value={resetEmail}
                                    onChange={(event) => setResetEmail(event.target.value)}
                                />
                            </div>
                            <div className={styles.actionsRow}>
                                <Button
                                    type="button"
                                    text={isSendingReset ? "Sending..." : "Send Reset Link"}
                                    onClick={sendPasswordResetEmail}
                                    disabled={isSendingReset}
                                />
                            </div>
                            {passwordResetMessage && (
                                <Notification text={passwordResetMessage.text} variant={passwordResetMessage.variant} className={styles.inlineNotice} />
                            )}
                        </div>
                    </div>
                    <div className={styles.securityItem}>
                        <LuShieldCheck className={styles.securityIcon} />
                        <div>
                            <h3 className={styles.securityTitle}>Email Verification</h3>
                            {userData?.email_verified ? (
                                <p className={styles.securityTextVerified}>Verified</p>
                            ) : (
                                <p className={styles.securityText}>Not verified. Send a new verification email.</p>
                            )}
                            <div className={styles.actionsRow}>
                                <Button
                                    type="button"
                                    text={isSendingVerification ? "Sending..." : "Send Verification Email"}
                                    onClick={sendVerificationEmail}
                                    disabled={isSendingVerification || Boolean(userData?.email_verified)}
                                />
                                <Button
                                    type="button"
                                    text={isRefreshingStatus ? "Refreshing..." : "Refresh Status"}
                                    variant="outline"
                                    onClick={refreshVerificationStatus}
                                    disabled={isRefreshingStatus}
                                />
                            </div>
                            {verificationMessage && (
                                <Notification text={verificationMessage.text} variant={verificationMessage.variant} className={styles.inlineNotice} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserSettings;