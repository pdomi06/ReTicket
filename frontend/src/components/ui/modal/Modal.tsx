import { useEffect, type ReactNode } from "react";
import styles from "./Modal.module.css";
import Button from "../button/Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    size?: "sm" | "md" | "lg";
}

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    confirmText,
    cancelText = "Close",
    onConfirm,
    size = "md",
}: ModalProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div
                className={`${styles.modal} ${styles[size]}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    {title && <h5 className={styles.title}>{title}</h5>}
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        ✕
                    </button>
                </div>

                <div className={styles.body}>{children}</div>

                {(confirmText || cancelText) && (
                    <div className={styles.footer}>
                        <div className={styles.footerActions}>
                            <Button text={cancelText} variant="outline" onClick={onClose} />
                            {confirmText && onConfirm && (
                                <Button text={confirmText} onClick={onConfirm} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
