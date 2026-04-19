import { useContext, useEffect, useMemo, useState } from "react";
import { CartContext } from "../../contexts/cart/CartContextDef";
import Button from "../../components/ui/button/Button";
import Notification from "../../components/ui/notification/Notification";
import styles from "./Cart.module.css";
import { apiFetch } from "../../lib/apiFetch";
import { formatUnixDateTime } from "../../utils/dateTime";
import type { IEvent } from "../../utils/interfaces";
import { usePageLoading } from "../../contexts/loading/LoadingContext";

type GroupedSeat = {
    ticketId: number;
    seatLabel: string;
    priceLabel: string;
};

type GroupedEvent = {
    key: string;
    title: string;
    dateLabel: string;
    seats: GroupedSeat[];
};

const Cart = () => {
    const { tickets, removeFromCart, clearCart } = useContext(CartContext);
    const trackPageLoading = usePageLoading();
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [eventsById, setEventsById] = useState<Record<number, IEvent>>({});
    const [sectionsByTicketId, setSectionsByTicketId] = useState<Record<number, string>>({});
    const [checkoutText, setCheckoutText] = useState("Checkout");

    const subtotal = useMemo(
        () => tickets.reduce((sum, ticket) => sum + Number(ticket.price || 0), 0),
        [tickets]
    );
    const serviceFee = useMemo(() => subtotal * 0.1, [subtotal]).toFixed(0);
    const total = useMemo(() => subtotal + Number(serviceFee), [subtotal, serviceFee]).toFixed(0);

    const groupedTickets = useMemo<GroupedEvent[]>(() => {
        const groups = new Map<string, GroupedEvent>();

        for (const ticket of tickets) {
            const eventInfo = eventsById[Number(ticket.eventId)];
            const eventTitle = ticket.eventName ?? eventInfo?.name ?? `Event #${ticket.eventId}`;
            const eventDateValue = ticket.eventDate ?? eventInfo?.eventDate;
            const dateLabel = eventDateValue != null ? formatUnixDateTime(eventDateValue) : "Date unavailable";
            const section = ticket.section ?? sectionsByTicketId[ticket.id] ?? "-";
            const seatLabel = `${section} · Row ${ticket.row ?? "-"} · Seat ${ticket.col ?? "-"}`;
            const priceLabel = `${Number(ticket.price || 0)} Ft`;
            const groupKey = `${eventTitle}__${dateLabel}`;

            const existingGroup = groups.get(groupKey);
            if (existingGroup) {
                existingGroup.seats.push({ ticketId: ticket.id, seatLabel, priceLabel });
                continue;
            }

            groups.set(groupKey, {
                key: groupKey,
                title: eventTitle,
                dateLabel,
                seats: [{ ticketId: ticket.id, seatLabel, priceLabel }],
            });
        }

        return Array.from(groups.values());
    }, [eventsById, sectionsByTicketId, tickets]);

    useEffect(() => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const uniqueEventIds = Array.from(
            new Set(tickets.map((ticket) => Number(ticket.eventId)).filter((eventId) => Number.isFinite(eventId)))
        );

        if (uniqueEventIds.length === 0) {
            setEventsById({});
            return;
        }

        let cancelled = false;

        const loadEvents = async () => {
            const eventEntries = await Promise.all(
                uniqueEventIds.map(async (eventId) => {
                    try {
                        const response = await apiFetch(`${apiBaseUrl}/events/${eventId}`, {
                            includeAuth: false,
                            headers: {},
                        });
                        const contentType = response.headers.get("content-type") || "";

                        if (!response.ok || !contentType.includes("application/json")) {
                            return [eventId, null] as const;
                        }

                        const json = await response.json();
                        const eventData = ((json as { data?: unknown }).data ?? json) as IEvent;
                        return [eventId, eventData] as const;
                    } catch {
                        return [eventId, null] as const;
                    }
                })
            );

            if (cancelled) {
                return;
            }

            const nextEventsById: Record<number, IEvent> = {};
            for (const [eventId, eventData] of eventEntries) {
                if (eventData) {
                    nextEventsById[eventId] = eventData;
                }
            }

            setEventsById(nextEventsById);
        };

        void trackPageLoading(loadEvents());

        return () => {
            cancelled = true;
        };
    }, [tickets, trackPageLoading]);

    useEffect(() => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const ticketsNeedingSection = tickets.filter(
            (ticket) => !ticket.section && ticket.row != null && ticket.col != null
        );

        if (ticketsNeedingSection.length === 0) {
            return;
        }

        let cancelled = false;

        const loadSections = async () => {
            const sectionEntries = await Promise.all(
                ticketsNeedingSection.map(async (ticket) => {
                    try {
                        const response = await apiFetch(
                            `${apiBaseUrl}/originalTickets/search?eventId=${ticket.eventId}&row=${ticket.row}&seatNumber=${ticket.col}`,
                            {
                                includeAuth: false,
                                headers: {},
                            }
                        );
                        const contentType = response.headers.get("content-type") || "";

                        if (!response.ok || !contentType.includes("application/json")) {
                            return [ticket.id, null] as const;
                        }

                        const json = await response.json();
                        const section = json.data?.[0]?.section;
                        return [ticket.id, typeof section === "string" ? section : null] as const;
                    } catch {
                        return [ticket.id, null] as const;
                    }
                })
            );

            if (cancelled) {
                return;
            }

            setSectionsByTicketId((previous) => {
                const next = { ...previous };

                for (const [ticketId, section] of sectionEntries) {
                    if (section) {
                        next[ticketId] = section;
                    }
                }

                return next;
            });
        };

        void trackPageLoading(loadSections());

        return () => {
            cancelled = true;
        };
    }, [tickets, trackPageLoading]);

    const handleClearCart = async () => {
        await Promise.all(tickets.map((ticket) => removeFromCart(ticket)));
        clearCart();
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

    async function handleCheckOut() {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

        if (isCheckingOut) {
            return;
        }

        setIsCheckingOut(true);
        setCheckoutText("Processing...");
        setCheckoutError(null);

        try {
            setCheckoutText("Creating Order...");
            const response = await fetch(`${apiBaseUrl}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
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
                            {groupedTickets.map((group) => (
                                <li
                                    key={group.key}
                                    className={`list-group-item px-0 py-3 bg-transparent border-secondary-subtle ${styles.ticketItem}`}
                                >
                                    <div className={styles.eventGroupHeader}>
                                        <div>
                                            <p className={`mb-1 fw-semibold ${styles.ticketTitle}`}>{group.title}</p>
                                            <p className={`mb-0 ${styles.mutedText}`}>{group.dateLabel}</p>
                                        </div>
                                    </div>

                                    <ul className={styles.seatList}>
                                        {group.seats.map((seat) => {
                                            const cartTicket = tickets.find((ticket) => ticket.id === seat.ticketId);

                                            if (!cartTicket) {
                                                return null;
                                            }

                                            return (
                                                <li key={seat.ticketId} className={styles.seatRowItem}>
                                                    <div className={styles.seatRowText}>
                                                        <p className={`mb-0 ${styles.seatHero}`}>{seat.seatLabel}</p>
                                                    </div>

                                                    <div className={styles.seatRowActions}>
                                                        <p className={`mb-0 ${styles.seatPrice}`}>{seat.priceLabel}</p>
                                                        <button
                                                            type="button"
                                                            className={styles.removeSeatButton}
                                                            aria-label={`Remove ${seat.seatLabel}`}
                                                            onClick={() => {
                                                                void removeFromCart(cartTicket);
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            ))}
                        </ul>

                        <div className="d-flex justify-content-sm-end mt-3">
                            <button
                                type="button"
                                className={styles.clearCartLink}
                                onClick={() => {
                                    void handleClearCart();
                                }}
                            >
                                Clear cart
                            </button>
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
        </section>
    );
};

export default Cart;
