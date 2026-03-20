import { useEffect, useState } from "react";
import type { ITicketForsale } from "../../utils/interfaces";
import { CartContext } from "./CartContextDef";

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<ITicketForsale[]>([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Load cart from localStorage on mount and revalidate with backend
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
                            const res = await fetch(`${apiBaseUrl}/ticketForSale/addToBasket/${ticket.id}`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
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


    const addToCart = async (eventId: string, row: number, seat: number): Promise<boolean> => {
        try {
            const response = await fetch(`${apiBaseUrl}/originalTickets/search?eventId=${eventId}&row=${row}&seatNumber=${seat}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ticket: ${response.statusText}`);
            }
            const jsonData = await response.json();
            const originalTicketId = jsonData.data?.[0]?.id;
            if (!originalTicketId) {
                console.error("Ticket not found for the given seat.");
                return false;
            }

            const ticket = await fetch(`${apiBaseUrl}/ticketForSale/search?originalTicketId=${originalTicketId}`);
            if (!ticket.ok) {
                throw new Error(`Failed to fetch ticket for sale: ${ticket.statusText}`);
            }
            const ticketData = await ticket.json();
            const ticketForSale = ticketData.data?.[0];
            if (!ticketForSale) {
                console.error("No ticket for sale available for this seat.");
                return false;
            }

            const newTicket = { ...ticketForSale, row, col: seat } as ITicketForsale;

            setCart(prevCart => [...prevCart, newTicket]);

            const basketRes = await fetch(`${apiBaseUrl}/ticketForSale/addToBasket/${ticketForSale.id}`, {
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
            const res = await fetch(`${apiBaseUrl}/ticketForSale/removeFromBasket/${ticket.id}`, {
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

    return (
        <CartContext.Provider value={{ tickets: cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContextProvider;
