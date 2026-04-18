import { useEffect, useState } from "react";
import { LuCalendar, LuMapPin, LuTag, LuTicket } from "react-icons/lu";
import type { IDashboardTicket } from "../../../utils/interfaces";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import styles from "./Tickets.module.css";
import Button from "../../../components/ui/button/Button";
import { formatUnixDateTime, toDateInputValue } from "../../../utils/dateTime";
import { apiFetch } from "../../../lib/apiFetch";

export default function Tickets() {
  const [tickets, setTickets] = useState<IDashboardTicket[]>([]);
  const [filters, setFilters] = useState({
    event: "",
    venue: "",
    section: "",
    status: "",
    date: "",
  });

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/originalTickets/dashboard`);
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

  const filteredTickets = tickets.filter((ticket) => {
    const eventMatch = ticket.eventName.toLowerCase().includes(filters.event.toLowerCase());
    const venueMatch = ticket.venue.toLowerCase().includes(filters.venue.toLowerCase());
    const sectionMatch = ticket.section.toLowerCase().includes(filters.section.toLowerCase());
    const statusMatch = !filters.status || ticket.status === filters.status;
    const ticketDate = toDateInputValue(ticket.eventDate);
    const dateMatch = !filters.date || ticketDate === filters.date;

    return eventMatch && venueMatch && sectionMatch && statusMatch && dateMatch;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ event: "", venue: "", section: "", status: "", date: "" });
  };

  const uniqueStatuses = [...new Set(tickets.map((t) => t.status))];

  return (
    <div className={`container-fluid mt-4 ${styles.ticketsContainer}`}>
      <div className={styles.headerSection}>
        <h1>Tickets</h1>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <div>
            <Input
              type="text"
              label="Filter by event"
              name="event"
              value={filters.event}
              onChange={handleFilterChange}
              theme="dark"
              size="medium"
            />
          </div>
          <div>
            <Input
              type="date"
              label="Filter by date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              theme="dark"
              size="medium"
            />
          </div>
          <div>
            <Input
              type="text"
              label="Filter by venue"
              name="venue"
              value={filters.venue}
              onChange={handleFilterChange}
              theme="dark"
              size="medium"
            />
          </div>
          <div>
            <Input
              type="text"
              label="Filter by section"
              name="section"
              value={filters.section}
              onChange={handleFilterChange}
              theme="dark"
              size="medium"
            />
          </div>
          <div>
            <Select
              label="All Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              theme="dark"
              size="medium"
            >
              <option value="">All Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {String(status)}
                </option>
              ))}
            </Select>
          </div>
          {(filters.event || filters.venue || filters.section || filters.status || filters.date) && (
            <div>
              <Button text="Clear" onClick={handleClearFilters} variant="outline" />
            </div>
          )}
        </div>
        <p className={styles.resultCount}>
          Showing {filteredTickets.length} of {tickets.length} tickets
        </p>
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
              <th>
                <LuCalendar size={16} className="me-2" />
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  {tickets.length === 0 ? "No tickets found" : "No tickets match your filters"}
                </td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.eventName}</td>
                  <td>{formatUnixDateTime(ticket.eventDate)}</td>
                  <td>{ticket.venue}</td>
                  <td>{ticket.section}</td>
                  <td className="text-center">
                    {ticket.row}
                  </td>
                  <td className="text-center">
                    {ticket.seatNumber}
                  </td>
                  <td>{ticket.price} Ft</td>
                  <td>
                    {String(ticket.status)}
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
