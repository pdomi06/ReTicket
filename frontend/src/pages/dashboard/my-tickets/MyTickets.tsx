import { useEffect, useState } from "react";
import type { IMyDashboardTicket } from "../../../utils/interfaces";
import styles from "./MyTickets.module.css";
import { formatUnixDateTime } from "../../../utils/dateTime";
import Button from "../../../components/ui/button/Button";
import { apiFetch } from "../../../lib/apiFetch";
import { usePageLoading } from "../../../contexts/loading/LoadingContext";

const MyTickets = () => {
    const [tickets, setTickets] = useState<IMyDashboardTicket[]>([]);
    const trackPageLoading = usePageLoading();

    useEffect(() => {
        async function fetchTickets() {
            try {
                const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/ticketForSale/dashboard`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    setTickets(data);
                    return;
                }

                if (Array.isArray(data?.data)) {
                    setTickets(data.data);
                    return;
                }

                setTickets([]);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        }

        const fetchTicketsPromise = fetchTickets();
        void trackPageLoading(fetchTicketsPromise);
    }, [trackPageLoading]);

    return (
        <div className={styles.ticketsContainer}>
            <div className={styles.headerSection}>
                <h1>My Tickets</h1>
                <div>
                    <Button text="List Ticket" link="/dashboard/list-ticket" />
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Venue</th>
                            <th>Section</th>
                            <th>Row</th>
                            <th>Seat</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.emptyState}>
                                    No tickets found
                                </td>
                            </tr>
                        ) : (
                            tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{ticket.eventName}</td>
                                    <td>{formatUnixDateTime(ticket.eventDate)}</td>
                                    <td>{ticket.venue}</td>
                                    <td>{ticket.section}</td>
                                    <td>{ticket.row}</td>
                                    <td>{ticket.seatNumber}</td>
                                    <td>{ticket.price} Ft</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyTickets;
