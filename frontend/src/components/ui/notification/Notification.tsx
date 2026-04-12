import styles from "./Notification.module.css";

type NotificationVariant = "error" | "success";

interface NotificationProps {
    text: string;
    variant: NotificationVariant;
    className?: string;
}

const Notification = ({ text, variant, className = "" }: NotificationProps) => {
    return (
        <div
            className={`${styles.notification} ${styles[variant]} ${className}`.trim()}
            role="alert"
        >
            {text}
        </div>
    );
};

export default Notification;