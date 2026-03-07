import { useState } from "react";
import type { ITicketForsale } from "../../utils/interfaces";
import { CartContext } from "./CartContextDef";

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<ITicketForsale[]>([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


    const addToCart = async (eventId: string, row: number, seat: number) => {
        try {
            const response = await fetch(`${apiBaseUrl}/originalTickets/search?eventId=${eventId}&row=${row}&seatNumber=${seat}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ticket: ${response.statusText}`);
            }
            const jsonData = await response.json();
            const originalTicketId = jsonData.data?.[0]?.id;
            if (!originalTicketId) {
                console.error("Ticket not found for the given seat.");
                return;
            }
            try {
                const ticket = await fetch(`${apiBaseUrl}/ticketForSale/search?originalTicketId=${originalTicketId}`);
                if (!ticket.ok) {
                    throw new Error(`Failed to fetch ticket for sale: ${ticket.statusText}`);
                }
                const ticketData = await ticket.json();
                const ticketForSale = ticketData.data?.[0];
                if (!ticketForSale) {
                    console.error("No ticket for sale available for this seat.");
                    return;
                }
                setCart(prevCart => {
                    const newCart = [...prevCart, ticketForSale];
                    console.log("Cart updated:", newCart);
                    return newCart;
                });
            } catch (error) {
                console.error("Error fetching ticket for sale:", error);
            }
        } catch (error) {
            console.error("Error adding ticket to cart:", error);
        }
    }; // This function fetches the original ticket based on eventId, row, and seat, then uses that ticket's ID to fetch the corresponding ticket for sale and adds it to the cart.

    const removeFromCart = (ticket: ITicketForsale) => {
        setCart(prevCart => prevCart.filter(item => item.id !== ticket.id));
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
