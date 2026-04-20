import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import Notification from "../../components/ui/notification/Notification";
import Modal from "../../components/ui/modal/Modal";
import { CartContext } from "../../contexts/cart/CartContextDef";
import styles from "./Checkout.module.css";

type CheckoutState = "idle" | "processing" | "success" | "error";

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    const handledSessionRef = useRef<string | null>(null);
    const sessionId = searchParams.get("session_id");
    const stateParam = (searchParams.get("state") || "").toLowerCase();
    const isSuccessful = stateParam === "succesful" || stateParam === "successful";

    const cachedProcessedSession = useMemo(() => {
        if (!sessionId) {
            return null;
        }

        const alreadyProcessed = sessionStorage.getItem(`checkout_processed_${sessionId}`) === "1";
        if (!alreadyProcessed) {
            return null;
        }

        return {
            email: sessionStorage.getItem(`checkout_email_${sessionId}`) || "",
            status: isSuccessful ? "success" as const : "error" as const,
            showSuccessModal: isSuccessful,
        };
    }, [isSuccessful, sessionId]);

    const [status, setStatus] = useState<CheckoutState>(() => cachedProcessedSession?.status ?? "idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [deliveryEmail, setDeliveryEmail] = useState<string>(() => cachedProcessedSession?.email ?? "");
    const [showSuccessModal, setShowSuccessModal] = useState(() => cachedProcessedSession?.showSuccessModal ?? false);

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        if (handledSessionRef.current === sessionId) {
            return;
        }

        handledSessionRef.current = sessionId;

        const alreadyProcessed = sessionStorage.getItem(`checkout_processed_${sessionId}`);
        if (alreadyProcessed === "1") {
            return;
        }

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const orderId = localStorage.getItem("orderId");

        const handleReturn = async () => {
            if (!orderId) {
                throw new Error("Missing order reference. Please try checkout again from cart.");
            }

            setStatus("processing");
            setErrorMessage(null);

            const sessionResponse = await fetch(
                `${apiBaseUrl}/checkout/session?session_id=${encodeURIComponent(sessionId)}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!sessionResponse.ok) {
                throw new Error("Failed to load payment details.");
            }

            const sessionData = (await sessionResponse.json()) as {
                payment_id?: string;
                email?: string;
            };

            const patchOrderResponse = await fetch(`${apiBaseUrl}/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentIntentId: sessionData.payment_id ?? "",
                    paymentStatus: isSuccessful ? "authorized" : "failed",
                    deliveryEmail: sessionData.email ?? "",
                    deliveryStatus: isSuccessful ? "pending" : null,
                }),
            });

            if (!patchOrderResponse.ok) {
                throw new Error("Failed to update order with payment details.");
            }

            if (!isSuccessful) {
                setStatus("error");
                setErrorMessage("Payment was not successful. Please try checkout again.");
                sessionStorage.setItem(`checkout_processed_${sessionId}`, "1");
                return;
            }

            const finalizeResponse = await fetch(`${apiBaseUrl}/ticketForSale/finalize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId,
                }),
            });

            if (!finalizeResponse.ok) {
                throw new Error("Payment succeeded, but ticket finalization failed. Please contact support.");
            }

            const resolvedEmail = sessionData.email ?? "";
            setDeliveryEmail(resolvedEmail);
            setStatus("success");
            setShowSuccessModal(true);
            clearCart();

            sessionStorage.setItem(`checkout_processed_${sessionId}`, "1");
            sessionStorage.setItem(`checkout_email_${sessionId}`, resolvedEmail);
            localStorage.removeItem("orderId");
        };

        void handleReturn().catch((error: unknown) => {
            setStatus("error");
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to finalize payment details."
            );
        });
    }, [clearCart, isSuccessful, sessionId]);

    const fallbackStatus: CheckoutState = stateParam && !isSuccessful ? "error" : "idle";
    const fallbackErrorMessage = stateParam && !isSuccessful
        ? "Payment was not successful. Please try checkout again."
        : null;
    const effectiveStatus = sessionId ? status : fallbackStatus;
    const effectiveErrorMessage = sessionId ? errorMessage : fallbackErrorMessage;

    const successMessage = deliveryEmail
        ? `Your order has been paid successfully. Tickets were sent via email to ${deliveryEmail}.`
        : "Your order has been paid successfully. Your tickets were sent via email.";

    return (
        <section className="container my-4 my-md-5">
            <div className={styles.checkoutWrap}>
                <div className={`card p-4 p-md-5 ${styles.checkoutCard}`}>
                    <h1 className={styles.title}>Checkout</h1>

                    {effectiveStatus === "processing" && (
                        <p className={styles.subtitle}>Finalizing your payment and order details...</p>
                    )}

                    {effectiveStatus === "success" && (
                        <Notification
                            text="Payment confirmed. Your order has been finalized."
                            variant="success"
                        />
                    )}

                    {effectiveStatus === "error" && effectiveErrorMessage && (
                        <Notification text={effectiveErrorMessage} variant="error" />
                    )}

                    {effectiveStatus === "idle" && (
                        <p className={styles.subtitle}>
                            Complete your purchase from cart to continue checkout.
                        </p>
                    )}

                    <div className={styles.actions}>
                        <Button text="Back to cart" variant="outline" onClick={() => navigate("/cart")} />
                        <Button text="Browse events" variant="primary" link="/browse" />
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Payment successful"
                cancelText="Close"
                size="sm"
            >
                <p className={styles.modalMessage}>{successMessage}</p>
            </Modal>
        </section>
    );
};

export default Checkout;
