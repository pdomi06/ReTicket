import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

const LOADING_MESSAGES = [
    "Bribing the database...",
    "Untangling your data...",
    "Polishing your tickets...",
    "Almost there, probably...",
    "Cueing the spotlight...",
];

export default function LoadingScreen() {
    const [messageIndex, setMessageIndex] = useState(0);
    const [messageVisible, setMessageVisible] = useState(true);

    useEffect(() => {
        const swapInterval = window.setInterval(() => {
            setMessageVisible(false);

            window.setTimeout(() => {
                setMessageIndex((previous) => (previous + 1) % LOADING_MESSAGES.length);
                setMessageVisible(true);
            }, 260);
        }, 2000);

        return () => {
            window.clearInterval(swapInterval);
        };
    }, []);

    return (
        <section className={styles.screen} role="status" aria-live="polite" aria-label="Loading content">
            <div className={styles.content}>
                <div className={styles.loaderCore} aria-hidden="true">
                    <div className={styles.ring} />
                </div>

                <p className={styles.title}>Loading</p>
                <p className={`${styles.message} ${messageVisible ? styles.messageVisible : styles.messageHidden}`}>
                    {LOADING_MESSAGES[messageIndex]}
                </p>
            </div>
        </section>
    );
}
