import { useState } from "react";
import type { ITicketForsale } from "../../utils/interfaces";
import { CartContext } from "./CartContextDef";

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [tickets, setTickets] = useState<ITicketForsale[]>([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


    const addToCart = async (eventId: string, row: string, seat: string) => {
        try {
            const response = await fetch(`${apiBaseUrl}/originalTickets?=eventId=${eventId}&row=${row}&seatNumber=${seat}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ticket: ${response.statusText}`);
            }
            const data = await response.json();
            try {
                const ticket = await fetch(`${apiBaseUrl}/ticketForSale/${data.id}`);
                if (!ticket.ok) {
                    throw new Error(`Failed to fetch ticket for sale: ${ticket.statusText}`);
                }
                const ticketData = await ticket.json();
                console.log("Adding to cart:", ticketData);
                setTickets(prevTickets => [...prevTickets, ticketData]);
            } catch (error) {
                console.error("Error fetching ticket for sale:", error);
            }
        } catch (error) {
            console.error("Error adding ticket to cart:", error);
        }
    }; // This function fetches the original ticket based on eventId, row, and seat, then uses that ticket's ID to fetch the corresponding ticket for sale and adds it to the cart.

    const removeFromCart = (ticket: ITicketForsale) => {
        setTickets(prevTickets => prevTickets.filter(item => item.id !== ticket.id));
    }

    const clearCart = () => {
        setTickets([]);
    }

    return (
        <CartContext.Provider value={{ tickets, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContextProvider;
