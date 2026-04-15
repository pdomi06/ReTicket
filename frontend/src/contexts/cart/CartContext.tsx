import { useCallback, useEffect, useState } from "react";
import type { ITicketForsale, ICartContext } from "../../utils/interfaces";
import { CartContext } from "./CartContextDef";

const BASKET_KEY_STORAGE = "basketKey";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getOrCreateBasketKey(): string {
    let key = localStorage.getItem(BASKET_KEY_STORAGE);

    if (!key || !UUID_PATTERN.test(key)) {
        key = crypto.randomUUID();
        localStorage.setItem(BASKET_KEY_STORAGE, key);
    }

    return key;
}

function cartFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const basketKey = getOrCreateBasketKey();

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "X-Basket-Key": basketKey,
            ...(options.headers ?? {}),
        },
    });
}

interface IBasketVerifyTicket {
    id: number;
    reservation_expires_at: string;
}

interface IBasketVerifyResponse {
    tickets: IBasketVerifyTicket[];
    basketExpiresAt: string | null;
}

interface IBasketRefreshResponse {
    basketExpiresAt?: string | null;
}

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<ITicketForsale[]>([]);
    const [basketExpiresAt, setBasketExpiresAt] = useState<string | null>(
        localStorage.getItem("basketExpiresAt")
    );
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const clearCart = useCallback((): void => {
        setCart([]);
        setBasketExpiresAt(null);
        localStorage.removeItem("cart");
        localStorage.removeItem("basketExpiresAt");
    }, []);

    const restoreCartFromStorage = useCallback(async (): Promise<void> => {
        try {
            // 1. Call server to get the canonical expiry for this basket token
            const verifyRes = await cartFetch(`${apiBaseUrl}/ticketForSale/basket/verify`);
            
            // On network failure, preserve the local cart instead of wiping it
            // The refresh heartbeat will sync when server comes back online
            if (!verifyRes.ok) {
                console.warn("Verify failed; preserving local cart until server responds");
                return;
            }

            const verifyData = (await verifyRes.json()) as IBasketVerifyResponse;

            if (!verifyData.basketExpiresAt) {
                // Server explicitly says no active reservation — clear any stale localStorage cart
                clearCart();
                return;
            }

            // 2. Use the server's expiry, not the localStorage timestamp
            setBasketExpiresAt(verifyData.basketExpiresAt);
            localStorage.setItem("basketExpiresAt", verifyData.basketExpiresAt);

            // 3. Continue with localStorage restoration logic for ticket details
            const savedCart = localStorage.getItem("cart");
            if (!savedCart) {
                const serverTickets = await Promise.all(
                    verifyData.tickets.map(async ({ id }) => {
                        const ticketRes = await cartFetch(`${apiBaseUrl}/ticketForSale/${id}`);
                        if (!ticketRes.ok) {
                            return null;
                        }

                        const ticket = (await ticketRes.json()) as ITicketForsale;
                        return ticket;
                    })
                );

                const validServerTickets = serverTickets.filter((ticket): ticket is ITicketForsale => ticket !== null);

                if (validServerTickets.length > 0) {
                    setCart(validServerTickets);
                    localStorage.setItem("cart", JSON.stringify(validServerTickets));
                } else {
                    clearCart();
                }

                return;
            }

            const parsedCart = JSON.parse(savedCart) as ITicketForsale[];
            if (!Array.isArray(parsedCart)) {
                throw new Error("Saved cart is not an array");
            }

            const verifiedTicketIds = new Set(verifyData.tickets.map((ticket) => ticket.id));
            const ticketsToRestore = parsedCart.filter((ticket) => verifiedTicketIds.has(ticket.id));

            if (ticketsToRestore.length > 0) {
                setCart(ticketsToRestore);
                localStorage.setItem("cart", JSON.stringify(ticketsToRestore));
            } else {
                clearCart();
            }
        } catch (error) {
            console.error("Error parsing saved cart:", error);
            clearCart();
        }
    }, [apiBaseUrl, clearCart]);

    useEffect(() => {
        void restoreCartFromStorage();
    }, [restoreCartFromStorage]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            localStorage.removeItem("cart");
        }
    }, [cart]);

    useEffect(() => {
        if (cart.length === 0) {
            return;
        }

        const interval = setInterval(async () => {
            try {
                const res = await cartFetch(`${apiBaseUrl}/ticketForSale/basket/refresh`, { method: "POST" });
                if (!res.ok) {
                    return;
                }

                const data = (await res.json()) as IBasketRefreshResponse;
                if (data.basketExpiresAt) {
                    setBasketExpiresAt(data.basketExpiresAt);
                    localStorage.setItem("basketExpiresAt", data.basketExpiresAt);
                } else {
                    clearCart();
                }
            } catch (error) {
                console.error("Error refreshing basket reservation:", error);
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [apiBaseUrl, cart.length]);


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

            if (cart.some((item) => item.id === ticketForSale.id)) {
                return true;
            }

            const newTicket = { ...ticketForSale, eventId: eventId, row, col: seat } as ITicketForsale;

            setCart(prevCart => (
                prevCart.some((item) => item.id === newTicket.id)
                    ? prevCart
                    : [...prevCart, newTicket]
            ));

            const basketRes = await cartFetch(`${apiBaseUrl}/ticketForSale/${ticketForSale.id}/addToBasket`, {
                method: "POST",
            });

            if (!basketRes.ok) {
                setCart(prevCart => prevCart.filter(item => item.id !== ticketForSale.id));
                console.error("Seat was already taken by another user.");
                return false;
            }

            const basketData = (await basketRes.json()) as IBasketRefreshResponse;
            if (basketData.basketExpiresAt) {
                setBasketExpiresAt(basketData.basketExpiresAt);
                localStorage.setItem("basketExpiresAt", basketData.basketExpiresAt);
            }

            return true;
        } catch (error) {
            console.error("Error adding ticket to cart:", error);
            return false;
        }
    };

    const removeFromCart = async (
        ticket: ITicketForsale,
        options?: { skipRefresh?: boolean }
    ) => {
        setCart(prevCart => prevCart.filter(item => item.id !== ticket.id));

        try {
            const res = await cartFetch(`${apiBaseUrl}/ticketForSale/${ticket.id}/removeFromBasket`, {
                method: "POST",
            });

            if (!res.ok) {
                setCart(prevCart => [...prevCart, ticket]);
                console.error("Failed to remove ticket from basket.");
                return;
            }

            if (!options?.skipRefresh && cart.length > 1) {
                const refreshRes = await cartFetch(`${apiBaseUrl}/ticketForSale/basket/refresh`, { method: "POST" });
                if (refreshRes.ok) {
                    const refreshData = (await refreshRes.json()) as IBasketRefreshResponse;
                    if (refreshData.basketExpiresAt) {
                        setBasketExpiresAt(refreshData.basketExpiresAt);
                        localStorage.setItem("basketExpiresAt", refreshData.basketExpiresAt);
                    } else {
                        clearCart();
                    }
                }
            } else if (cart.length <= 1) {
                setBasketExpiresAt(null);
                localStorage.removeItem("basketExpiresAt");
            }
        } catch (error) {
            setCart(prevCart => [...prevCart, ticket]);
            console.error("Error removing ticket from cart:", error);
        }
    }

    const contextValue: ICartContext = {
        tickets: cart,
        addToCart,
        removeFromCart,
        clearCart,
        basketExpiresAt,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContextProvider;
