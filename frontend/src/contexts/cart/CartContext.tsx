import { useEffect, useState } from "react";
import type { ITicketForsale, ICartContext } from "../../utils/interfaces";
import { CartContext } from "./CartContextDef";
import { apiFetch } from "../../lib/apiFetch";

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<ITicketForsale[]>([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const restoreCartFromStorage = async () => {
            const savedCart = localStorage.getItem('cart');
            if (!savedCart) {
                return;
            }

            try {
                const parsedCart = JSON.parse(savedCart) as ITicketForsale[];
                if (!Array.isArray(parsedCart)) {
                    throw new Error("Saved cart is not an array");
                }

                const restoredTickets = await Promise.all(
                    parsedCart.map(async (ticket) => {
                        try {
                            const res = await apiFetch(`${apiBaseUrl}/ticketForSale/addToBasket/${ticket.id}`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                            });

                            if (res.ok || res.status === 409) {
                                return ticket;
                            }

                            console.warn(`Failed to re-add ticket ${ticket.id} to basket on restore: ${res.status}`);
                            return null;
                        } catch (err) {
                            console.error(`Error re-adding ticket ${ticket.id} to basket on restore:`, err);
                            return null;
                        }
                    })
                );

                const validTickets = restoredTickets.filter((ticket): ticket is ITicketForsale => ticket !== null);

                if (validTickets.length > 0) {
                    setCart(validTickets);
                    localStorage.setItem('cart', JSON.stringify(validTickets));
                } else {
                    setCart([]);
                    localStorage.removeItem('cart');
                }
            } catch (error) {
                console.error("Error parsing saved cart:", error);
                localStorage.removeItem('cart');
                setCart([]);
            }
        };

        void restoreCartFromStorage();
    }, [apiBaseUrl]);
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (cart.length === 0) {
            localStorage.removeItem('cart');
        }
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);


    const addToCart = async (eventId: number, row: number, seat: number): Promise<boolean> => {
        try {
            const response = await apiFetch(`${apiBaseUrl}/originalTickets/search?eventId=${eventId}&row=${row}&seatNumber=${seat}`, {
                includeAuth: false,
                headers: {},
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch ticket: ${response.statusText}`);
            }
            const jsonData = await response.json();
            const originalTicket = jsonData.data?.[0];
            const originalTicketId = originalTicket?.id;
            if (!originalTicketId) {
                console.error("Ticket not found for the given seat.");
                return false;
            }

            const ticket = await apiFetch(`${apiBaseUrl}/ticketForSale/search?originalTicketId=${originalTicketId}`, {
                includeAuth: false,
                headers: {},
            });
            if (!ticket.ok) {
                throw new Error(`Failed to fetch ticket for sale: ${ticket.statusText}`);
            }
            const ticketData = await ticket.json();
            const ticketForSale = ticketData.data?.[0];
            if (!ticketForSale) {
                console.error("No ticket for sale available for this seat.");
                return false;
            }

            let eventName: string | undefined;
            let eventDate: number | string | undefined;

            try {
                const eventResponse = await apiFetch(`${apiBaseUrl}/events/${eventId}`, {
                    includeAuth: false,
                    headers: {},
                });
                const contentType = eventResponse.headers.get("content-type") || "";

                if (eventResponse.ok && contentType.includes("application/json")) {
                    const eventJson = await eventResponse.json();
                    const eventData = ((eventJson as { data?: unknown }).data ?? eventJson) as {
                        name?: string;
                        eventDate?: number | string;
                    };
                    eventName = eventData.name;
                    eventDate = eventData.eventDate;
                }
            } catch {
                // Non-fatal: cart item can still be added with baseline metadata.
            }

            const newTicket = {
                ...ticketForSale,
                eventId,
                eventName,
                eventDate,
                row,
                col: seat,
                section: originalTicket?.section,
            } as ITicketForsale;

            setCart(prevCart => [...prevCart, newTicket]);

            const basketRes = await apiFetch(`${apiBaseUrl}/ticketForSale/addToBasket/${ticketForSale.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!basketRes.ok) {
                setCart(prevCart => prevCart.filter(item => item.id !== ticketForSale.id));
                console.error("Seat was already taken by another user.");
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error adding ticket to cart:", error);
            return false;
        }
    };

    const removeFromCart = async (ticket: ITicketForsale) => {
        setCart(prevCart => prevCart.filter(item => item.id !== ticket.id));

        try {
            const res = await apiFetch(`${apiBaseUrl}/ticketForSale/removeFromBasket/${ticket.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                setCart(prevCart => [...prevCart, ticket]);
                console.error("Failed to remove ticket from basket.");
                return;
            }
        } catch (error) {
            setCart(prevCart => [...prevCart, ticket]);
            console.error("Error removing ticket from cart:", error);
        }
    }

    const clearCart = () => {
        setCart([]);
    }

    const contextValue: ICartContext = { tickets: cart, addToCart, removeFromCart, clearCart };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContextProvider;
