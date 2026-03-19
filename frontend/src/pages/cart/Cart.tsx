import { useContext, useMemo } from "react";
import { CartContext } from "../../contexts/cart/CartContextDef";
import Button from "../../components/ui/button/Button";
import styles from "./Cart.module.css";

const Cart = () => {
    const { tickets, removeFromCart } = useContext(CartContext);

    const subtotal = useMemo(
        () => tickets.reduce((sum, ticket) => sum + Number(ticket.price || 0), 0),
        [tickets]
    );
    const serviceFee = useMemo(() => subtotal * 0.1, [subtotal]);
    const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

    const handleClearCart = async () => {
        await Promise.all(tickets.map((ticket) => removeFromCart(ticket)));
    };

    if (tickets.length === 0) {
        return (
            <section className="container my-4 my-md-5">
                <div className={`card text-center p-4 p-md-5 ${styles.cartCard} ${styles.emptyCard}`}>
                    <h1 className={`mb-2 ${styles.title} text-light`}>Your cart is empty</h1>
                    <p className={`mb-4 ${styles.mutedText}`}>
                        Pick seats from an event page and they will appear here instantly.
                    </p>
                    <div className={styles.ctaWrap}>
                        <Button text="Browse Events" link="/browse" variant="primary" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="container my-4 my-md-5">
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
                                            <p className={`mb-0 fw-bold ${styles.price}`}>{Number(ticket.price)} Ft</p>
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
                    <div className={`card p-3 p-md-4 ${styles.cartCard} ${styles.summarySticky}`}>
                        <h2 className="h4 mb-3 text-light">Order Summary</h2>
                        <div className="d-flex justify-content-between mb-2 pt-3 border-top">
                            <span>Subtotal</span>
                            <span>{subtotal} Ft</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span>Service fee</span>
                            <span>{serviceFee} Ft</span>
                        </div>
                        <div className="d-flex justify-content-between fw-bold border-top pt-3 mt-3 mb-3">
                            <span>Total</span>
                            <span>{total} Ft</span>
                        </div>

                        <div className="d-grid gap-2">
                            <Button text="Checkout" variant="primary" />
                            <Button text="Continue Shopping" variant="outline" link="/browse" />
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default Cart;