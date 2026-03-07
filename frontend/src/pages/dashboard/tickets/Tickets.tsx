import { useEffect, useState } from "react";
import { LuCalendar, LuTag, LuTicket } from "react-icons/lu";
import type { IOriginalTicket } from "../../../utils/interfaces";
import styles from "./Tickets.module.css";

export default function Tickets() {
  const [tickets, setTickets] = useState<IOriginalTicket[]>([]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/originalTickets`);
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
        <h1>Tickets</h1>
        <button className={`btn ${styles.addButton}`}>+ Add Ticket</button>
      </div>

      <div className={`table-responsive ${styles.tableWrapper}`}>
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th>
                <LuTicket size={16} className="me-2" />
                Section
              </th>
              <th className="text-center">Row</th>
              <th className="text-center">Seat</th>
              <th>
                <LuTag size={16} className="me-2" />
                Price
              </th>
              <th>
                <LuCalendar size={16} className="me-2" />
                Status
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No tickets found
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.section}</td>
                  <td className="text-center">
                    {ticket.row}
                  </td>
                  <td className="text-center">
                    {ticket.seatNumber}
                  </td>
                  <td>${ticket.price}</td>
                  <td>
                    {String(ticket.status)}
                  </td>
                  <td className={`text-center ${styles.actionButtons}`}>
                    <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
