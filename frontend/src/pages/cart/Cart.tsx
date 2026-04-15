import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CartContext } from "../../contexts/cart/CartContextDef";
import Button from "../../components/ui/button/Button";
import Notification from "../../components/ui/notification/Notification";
import CartTimer from "../../components/CartTimer";
import styles from "./Cart.module.css";
import { useSearchParams } from "react-router-dom";

const Cart = () => {
    const { tickets, removeFromCart, clearCart } = useContext(CartContext);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [searchParams] = useSearchParams();
    const [checkoutText, setCheckoutText] = useState("Checkout");
    const handledSessionIdRef = useRef<string | null>(null);

    const subtotal = useMemo(
        () => tickets.reduce((sum, ticket) => sum + Number(ticket.price || 0), 0),
        [tickets]
    );
    const serviceFee = useMemo(() => subtotal * 0.1, [subtotal]).toFixed(0);
    const total = useMemo(() => subtotal + Number(serviceFee), [subtotal, serviceFee]).toFixed(0);

    useEffect(() => {
        const sessionId = searchParams.get("session_id");

        if (!sessionId || handledSessionIdRef.current === sessionId) {
            return;
        }

        handledSessionIdRef.current = sessionId;

        const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL);

        const finalizeTickets = async () => {
            const basketKey = localStorage.getItem('basketKey');
            await fetch(`${apiBaseUrl}/ticketForSale/finalize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Basket-Key": basketKey || '',
                },
                body: JSON.stringify({
                    orderId: localStorage.getItem('orderId'),
                }),
            });
        };

        const handlePaymentDetails = async () => {
            const checkoutSuccessful = searchParams.get("state") === "succesful";
            try {
                const response = await fetch(`${apiBaseUrl}/checkout/session?session_id=${encodeURIComponent(sessionId)}`, {
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to load payment details.");
                }

                const data = await response.json();

                const updatedOrder = await fetch(`${apiBaseUrl}/orders/${localStorage.getItem('orderId')}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        paymentIntentId: data.payment_id,
                        paymentStatus: checkoutSuccessful ? "authorized" : "failed",
                        deliveryEmail: data.email ? data.email : "",
                        deliveryStatus: checkoutSuccessful ? "pending" : null,
                    }),
                });
                if (!updatedOrder.ok) {
                    console.error("Failed to update order with payment details.");
                }
                if (checkoutSuccessful) {
                    await finalizeTickets();
                    clearCart();
                }
            } catch (error) {
                console.error("Error loading payment details:", error);
            }

        };

        void handlePaymentDetails();


    }, [searchParams, clearCart, tickets]);

    const handleClearCart = async () => {
        await Promise.all(tickets.map((ticket) => removeFromCart(ticket)));
        clearCart();
    };

    async function handleCheckOut() {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

        if (isCheckingOut) {
            return;
        }

        setIsCheckingOut(true);
        setCheckoutText("Processing...");
        setCheckoutError(null);

        try {
            const basketKey = localStorage.getItem("basketKey");

            setCheckoutText("Creating Order...");
            const response = await fetch(`${apiBaseUrl}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(basketKey ? { "X-Basket-Key": basketKey } : {}),
                },
                body: JSON.stringify({
                    subtotal: Number(subtotal),
                    platformFee: Number(serviceFee),
                    tickets: tickets.map((ticket) => ticket.id),
                }),
            });

            if (!response.ok) {
                let message = "Failed to create order.";
                const contentType = response.headers.get("content-type") ?? "";
                if (contentType.includes("application/json")) {
                    const data = (await response.json()) as { message?: string; error?: string };
                    message = data.message ?? data.error ?? message;
                } else {
                    message = await response.text();
                }
                setCheckoutError(message);
                setIsCheckingOut(false);
                setCheckoutText("Failed");
                return;
            }
            const order = await response.json();

            setCheckoutText("Redirecting to Payment...");
            const checkoutResponse = await fetch(`${apiBaseUrl}/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    total: Number(total),
                    orderId: order.id,
                }),
            });
            localStorage.setItem('orderId', order.id);

            const contentType = checkoutResponse.headers.get("content-type") ?? "";

            if (!checkoutResponse.ok) {
                let message = "Checkout failed.";
                if (contentType.includes("application/json")) {
                    const data = (await checkoutResponse.json()) as { message?: string; error?: string };
                    message = data.message ?? data.error ?? message;
                } else {
                    message = await checkoutResponse.text();
                }
                throw new Error(message);
            }

            if (!contentType.includes("application/json")) {
                throw new Error("Checkout response was not valid JSON.");
            }

            const data = (await checkoutResponse.json()) as { url?: string };
            if (!data.url) {
                throw new Error("Checkout URL was not returned.");
            }

            window.location.assign(data.url);
        } catch (error) {
            setCheckoutError(error instanceof Error ? error.message : "Checkout failed.");
            setIsCheckingOut(false);
            setCheckoutText("Checkout");
        }
    }

    return (
        <section className="container my-4 my-md-5">
            <CartTimer />

            {tickets.length === 0 ? (
                <div className={`card text-center p-4 p-md-5 ${styles.cartCard} ${styles.emptyCard}`}>
                    <h1 className={`mb-2 ${styles.title} text-light`}>Your cart is empty</h1>
                    <p className={`mb-4 ${styles.mutedText}`}>
                        Pick seats from an event page and they will appear here instantly.
                    </p>
                    <div className={styles.ctaWrap}>
                        <Button text="Browse Events" link="/browse" variant="primary" />
                    </div>
                </div>
            ) : (
                <div className="row g-3 g-lg-4 align-items-start">
                    <article className="col-12 col-lg-8">
                        <div className={`card p-3 p-md-4 ${styles.cartCard}`}>
                            <header className="d-flex flex-column flex-sm-row align-items-sm-end justify-content-sm-between gap-2 mb-3">
                                <h1 className={`mb-0 ${styles.title}`}>Your Cart</h1>
                                <p className={`mb-0 ${styles.mutedText}`}>
                                    {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
                                </p>
                            </header>

                            <ul className="list-group list-group-flush">
                                {tickets.map((ticket) => (
                                    <li
                                        key={ticket.id}
                                        className={`list-group-item px-0 py-3 bg-transparent border-secondary-subtle ${styles.ticketItem}`}
                                    >
                                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                                            <div className={styles.ticketInfo}>
                                                <p className="mb-1 fw-semibold">Ticket #{ticket.id}</p>
                                                <p className={`mb-0 ${styles.mutedText}`}>
                                                    Row {ticket.row ?? "-"} - Seat {ticket.col ?? "-"}
                                                </p>
                                            </div>
                                            <div className={`d-flex align-items-center gap-2 ms-sm-3 ${styles.ticketActionGroup}`}>
                                                <p className={`mb-0 fw-bold ${styles.price}`}>{Number(ticket.price || 0)} Ft</p>
                                                <div>
                                                    <Button
                                                        text="Remove"
                                                        variant="outline"
                                                        onClick={() => {
                                                            void removeFromCart(ticket);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="d-flex justify-content-sm-end mt-3">
                                <Button
                                    text="Clear Cart"
                                    variant="outline"
                                    onClick={() => {
                                        void handleClearCart();
                                    }}
                                />
                            </div>
                        </div>
                    </article>

                    <aside className="col-12 col-lg-4">
                        <div className={`card p-3 p-md-4 ${styles.cartCard}`}>
                            <h2 className="h4 mb-3 text-light">Checkout</h2>

                            {checkoutError && (
                                <Notification text={checkoutError} variant="error" />
                            )}

                            <h3 className="h6 mb-3 text-light">Order Summary</h3>
                            <div className={`d-flex justify-content-between mb-2 pt-2 ${styles.summaryDivider}`}>
                                <span>Subtotal</span>
                                <span>{subtotal} Ft</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Service fee</span>
                                <span>{serviceFee} Ft</span>
                            </div>
                            <div className={`d-flex justify-content-between fw-bold pt-2 mt-2 mb-3 ${styles.summaryTotal}`}>
                                <span>Total</span>
                                <span>{total} Ft</span>
                            </div>

                            <div className="d-grid gap-2">
                                <Button
                                    text={checkoutText}
                                    variant="primary"
                                    onClick={handleCheckOut}
                                    disabled={isCheckingOut}
                                />
                                <Button text="Continue Shopping" variant="outline" link="/browse" />
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </section>
    );
};

export default Cart;
