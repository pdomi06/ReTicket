import { LuLock, LuShieldCheck } from "react-icons/lu";
import styles from "./UserSettings.module.css";
import { useAuth } from "../../../contexts/auth/useAuth";

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
    const { user: userData } = useAuth();

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

    return (
        <section className={styles.page}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>{getInitials(fullName)}</div>
                <div>
                    <h1 className={styles.nameRow}>
                        <span>{fullName}</span>
                    </h1>
                    <p className={styles.email}>{email}</p>
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

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Security Settings</h2>
                <div className={styles.securityGrid}>
                    <div className={styles.securityItem}>
                        <LuLock className={styles.securityIcon} />
                        <div>
                            <h3 className={styles.securityTitle}>Password</h3>
                            <p className={styles.securityText}>Last updated 30 days ago</p>
                        </div>
                    </div>
                    <div className={styles.securityItem}>
                        <LuShieldCheck className={styles.securityIcon} />
                        <div>
                            <h3 className={styles.securityTitle}>Email Verification</h3>
                            {userData?.email_verified ? (
                                <p className={styles.securityTextVerified}>Verified</p>
                            ) : (
                                <p className={styles.securityText}>Not verified</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserSettings;