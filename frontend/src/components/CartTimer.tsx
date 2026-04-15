import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { CartContext } from "../contexts/cart/CartContextDef";
import styles from "./CartTimer.module.css";

const URGENCY_THRESHOLD_SECONDS = 120;

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export default function CartTimer() {
    const { basketExpiresAt, clearCart, tickets, removeFromCart } = useContext(CartContext);
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
    const [expired, setExpired] = useState(false);
    const isReleasingRef = useRef(false);

    const computeSeconds = useCallback(() => {
        if (!basketExpiresAt) {
            return null;
        }

        const diff = Math.floor((new Date(basketExpiresAt).getTime() - Date.now()) / 1000);
        return Math.max(diff, 0);
    }, [basketExpiresAt]);

    useEffect(() => {
        if (basketExpiresAt) {
            setExpired(false);
        }
        setSecondsLeft(computeSeconds());
    }, [basketExpiresAt, computeSeconds]);

    useEffect(() => {
        if (secondsLeft === null) {
            return;
        }

        if (secondsLeft <= 0) {
            setExpired(true);

            if (!isReleasingRef.current) {
                isReleasingRef.current = true;

                void (async () => {
                    await Promise.all(
                        tickets.map((ticket) => removeFromCart(ticket, { skipRefresh: true }))
                    );
                    clearCart();
                    isReleasingRef.current = false;
                })();
            }

            return;
        }

        const tick = setTimeout(() => setSecondsLeft(computeSeconds()), 1000);
        return () => clearTimeout(tick);
    }, [secondsLeft, clearCart, removeFromCart, tickets, computeSeconds]);

    useEffect(() => {
        if (!basketExpiresAt || expired) {
            return;
        }

        const syncCountdown = () => {
            setSecondsLeft(computeSeconds());
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                syncCountdown();
            }
        };

        window.addEventListener("focus", syncCountdown);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("focus", syncCountdown);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [basketExpiresAt, expired, computeSeconds]);

    if (!expired && (tickets.length === 0 || secondsLeft === null)) {
        return null;
    }

    if (expired) {
        return (
            <div className={styles.cartTimerExpired} role="alert">
                Your reservation has expired. The tickets have been released.
            </div>
        );
    }

    if (secondsLeft === null) {
        return null;
    }

    const isUrgent = secondsLeft <= URGENCY_THRESHOLD_SECONDS;

    return (
        <div
            className={`${styles.cartTimer} ${isUrgent ? styles.cartTimerUrgent : ""}`}
            role="timer"
            aria-live="polite"
            aria-label={`Cart reservation expires in ${formatTime(secondsLeft)}`}
        >
            {isUrgent && <span>!</span>}
            <span>{isUrgent ? "Hurry! Expires in " : "Reserved for "}</span>
            <span>{formatTime(secondsLeft)}</span>
        </div>
    );
}
