import { useEffect, useState } from "react";
import type { ITicketForsale, ICartContext } from "../../utils/interfaces";
import { CartContext } from "./CartContextDef";

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
                            const token = localStorage.getItem('token');
                            const headers: HeadersInit = { "Content-Type": "application/json" };
                            if (token) {
                                headers["Authorization"] = `Bearer ${token}`;
                            }
                            const res = await fetch(`${apiBaseUrl}/ticketForSale/addToBasket/${ticket.id}`, {
                                method: "POST",
                                headers,
                            });

                            if (res.ok) {
                                return ticket;
                            }

                            console.warn(`Failed to re-add ticket ${ticket.id} to basket on restore.`);
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
            const token = localStorage.getItem('token');
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${apiBaseUrl}/originalTickets/search?eventId=${eventId}&row=${row}&seatNumber=${seat}`, {
                headers
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch ticket: ${response.statusText}`);
            }
            const jsonData = await response.json();
            const originalTicketId = jsonData.data?.[0]?.id;
            if (!originalTicketId) {
                console.error("Ticket not found for the given seat.");
                return false;
            }

            const ticketHeaders: HeadersInit = {};
            if (token) {
                ticketHeaders['Authorization'] = `Bearer ${token}`;
            }
            const ticket = await fetch(`${apiBaseUrl}/ticketForSale/search?originalTicketId=${originalTicketId}`, {
                headers: ticketHeaders
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

            const newTicket = { ...ticketForSale, eventId: eventId, row, col: seat } as ITicketForsale;

            setCart(prevCart => [...prevCart, newTicket]);

            const basketHeaders: HeadersInit = { "Content-Type": "application/json" };
            if (token) {
                basketHeaders["Authorization"] = `Bearer ${token}`;
            }
            const basketRes = await fetch(`${apiBaseUrl}/ticketForSale/addToBasket/${ticketForSale.id}`, {
                method: "POST",
                headers: basketHeaders,
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
            const token = localStorage.getItem('token');
            const removeHeaders: HeadersInit = { "Content-Type": "application/json" };
            if (token) {
                removeHeaders["Authorization"] = `Bearer ${token}`;
            }
            const res = await fetch(`${apiBaseUrl}/ticketForSale/removeFromBasket/${ticket.id}`, {
                method: "POST",
                headers: removeHeaders,
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
