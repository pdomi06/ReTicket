import { useContext, useEffect, useRef, useState } from "react";
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

    const [status, setStatus] = useState<CheckoutState>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [deliveryEmail, setDeliveryEmail] = useState<string>("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        const stateParam = (searchParams.get("state") || "").toLowerCase();
        const isSuccessful = stateParam === "succesful" || stateParam === "successful";

        if (!sessionId) {
            if (stateParam && !isSuccessful) {
                setStatus("error");
                setErrorMessage("Payment was not successful. Please try checkout again.");
            } else {
                setStatus("idle");
            }
            return;
        }

        if (handledSessionRef.current === sessionId) {
            return;
        }

        handledSessionRef.current = sessionId;

        const alreadyProcessed = sessionStorage.getItem(`checkout_processed_${sessionId}`);
        if (alreadyProcessed === "1") {
            const cachedEmail = sessionStorage.getItem(`checkout_email_${sessionId}`) || "";
            setDeliveryEmail(cachedEmail);
            setStatus(isSuccessful ? "success" : "error");
            setShowSuccessModal(isSuccessful);
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
    }, [searchParams, clearCart]);

    const successMessage = deliveryEmail
        ? `Your order has been paid successfully. Tickets were sent via email to ${deliveryEmail}.`
        : "Your order has been paid successfully. Your tickets were sent via email.";

    return (
        <section className="container my-4 my-md-5">
            <div className={styles.checkoutWrap}>
                <div className={`card p-4 p-md-5 ${styles.checkoutCard}`}>
                    <h1 className={styles.title}>Checkout</h1>

                    {status === "processing" && (
                        <p className={styles.subtitle}>Finalizing your payment and order details...</p>
                    )}

                    {status === "success" && (
                        <Notification
                            text="Payment confirmed. Your order has been finalized."
                            variant="success"
                        />
                    )}

                    {status === "error" && errorMessage && (
                        <Notification text={errorMessage} variant="error" />
                    )}

                    {status === "idle" && (
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
