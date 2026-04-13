import { useEffect, useState } from "react";
import { LuCalendar, LuMapPin, LuTag, LuTicket } from "react-icons/lu";
import type { IMyDashboardTicket } from "../../../utils/interfaces";
import styles from "./MyTickets.module.css";
import { formatUnixDateTime } from "../../../utils/dateTime";
import Button from "../../../components/ui/button/Button";

const MyTickets = () => {
    const [tickets, setTickets] = useState<IMyDashboardTicket[]>([]);

    useEffect(() => {
        async function fetchTickets() {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ticketForSale/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

        fetchTickets();
    }, []);

    return (
        <div className={`container-fluid mt-4 ${styles.ticketsContainer}`}>
            <div className={styles.headerSection}>
                <h1>My Tickets</h1>
                <div>
                    <Button text="List Ticket" link="/dashboard/list-ticket" />
                </div>
            </div>

            <div className={`table-responsive ${styles.tableWrapper}`}>
                <table className={`table ${styles.table}`}>
                    <thead>
                        <tr>
                            <th>
                                <LuTag size={16} className="me-2" />
                                Event
                            </th>
                            <th>
                                <LuCalendar size={16} className="me-2" />
                                Date
                            </th>
                            <th>
                                <LuMapPin size={16} className="me-2" />
                                Venue
                            </th>
                            <th>
                                <LuTicket size={16} className="me-2" />
                                Section
                            </th>
                            <th className="text-center">
                                <LuTicket size={16} className="me-2" />
                                Rows
                            </th>
                            <th className="text-center">
                                <LuTicket size={16} className="me-2" />
                                Columns
                            </th>
                            <th className="text-center">
                                <LuTag size={16} className="me-2" />
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4">
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
                                    <td className="text-center">{ticket.row}</td>
                                    <td className="text-center">{ticket.seatNumber}</td>
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
