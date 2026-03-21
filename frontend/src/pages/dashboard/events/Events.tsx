import { useEffect, useState } from "react";
import { LuCalendar, LuMapPin, LuTag } from "react-icons/lu";
import type { IEvent } from "../../../utils/interfaces";
import { TicketStatus } from "../../../utils/enums";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import styles from "./Events.module.css";
import Button from "../../../components/ui/button/Button";
import { formatUnixDateTime } from "../../../utils/dateTime";

export default function Events() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<number | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    name: "",
    venue: "",
    category: "",
  });

  useEffect(() => {
    async function fetchEvents() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setEvents(data);
          return;
        }

        if (Array.isArray(data?.data)) {
          setEvents(data.data);
          return;
        }

        setEvents([]);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    fetchEvents();
  }, []);


  const handleStatusChange = async (eventId: number, newStatus: string) => {
    setLoadingStatus(eventId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/originalTickets/bulkStatusChange`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ eventId, status: newStatus }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to change ticket status");
        return;
      }

      setEvents((prev) => prev.map((event) =>
        event.id === eventId ? { ...event, firstTicketStatus: newStatus as typeof TicketStatus[keyof typeof TicketStatus] } : event
      ));
    } catch (error) {
      console.error("Error changing ticket status:", error);
      alert("Failed to change ticket status");
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleDeleteEvent = async (eventId: number, eventName: string) => {
    if (!confirm(`Are you sure you want to delete the event "${eventName}"?`)) {
      return;
    }

    setDeletingEventId(eventId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to delete event");
        return;
      }

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    } finally {
      setDeletingEventId(null);
    }
  };

  const filteredEvents = events.filter((event) => {
    const nameMatch = event.name.toLowerCase().includes(filters.name.toLowerCase());
    const venueMatch = event.venue.toLowerCase().includes(filters.venue.toLowerCase());
    const categoryMatch = !filters.category || event.category === filters.category;

    return nameMatch && venueMatch && categoryMatch;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ name: "", venue: "", category: "" });
  };

  const uniqueCategories = [...new Set(events.map((e) => e.category))];

  return (
    <div className={`container-fluid mt-4 ${styles.eventsContainer}`}>
      <div className={styles.headerSection}>
        <h1>Events</h1>
        <div>
          <Button text="+ Add Event" link="/dashboard/create-event" />
        </div>
      </div>

      <div className={styles.filtersSection}>
        <div className={`row ${styles.filterGroup}`}>
          <div className="col-2">
            <Input
              type="text"
              label="Filter by event name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              theme="dark"
              size="medium"
            />
          </div>
          <div className="col-2">
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
          <div className="col-2">
            <Select
              label="All Categories"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              theme="dark"
              size="medium"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>
          {(filters.name || filters.venue || filters.category) && (
            <div className="col-2">
              <Button text="Clear" onClick={handleClearFilters} variant="outline" />
            </div>
          )}
        </div>
        <p className={styles.resultCount}>
          Showing {filteredEvents.length} of {events.length} events
        </p>
      </div>

      <div className={`table-responsive ${styles.tableWrapper}`}>
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th>
                <LuCalendar size={16} className="me-2" />
                Event
              </th>
              <th>
                <LuMapPin size={16} className="me-2" />
                Venue
              </th>
              <th>Date</th>
              <th className="text-center">Category</th>
              <th>
                <LuTag size={16} className="me-2" />
                Base Price
              </th>
              <th className="text-center">Ticket Status</th>
              <th className="text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  {events.length === 0 ? "No events found" : "No events match your filters"}
                </td>
              </tr>
            ) : (
              filteredEvents.map((eventItem) => (
                <tr key={eventItem.id}>
                  <td>{eventItem.name}</td>
                  <td>{eventItem.venue}</td>
                  <td>{formatUnixDateTime(eventItem.eventDate)}</td>
                  <td className="text-center">
                    {eventItem.category}
                  </td>
                  <td>{eventItem.basePrice} Ft</td>
                  <td className="text-center">
                    <select
                      className={styles.statusSelect}
                      value={eventItem.firstTicketStatus || ""}
                      onChange={(e) => handleStatusChange(eventItem.id, e.target.value)}
                      disabled={loadingStatus === eventItem.id}
                    >
                      {!eventItem.firstTicketStatus && (
                        <option value="" disabled>No tickets</option>
                      )}
                      {Object.values(TicketStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`text-center ${styles.actionButtons}`}>
                    <Button text="Edit" link={`/dashboard/edit-event/${eventItem.id}`} variant="outline" />
                    <Button text={deletingEventId === eventItem.id ? "Deleting..." : "Delete"} variant="outline" onClick={() => handleDeleteEvent(eventItem.id, eventItem.name)} disabled={deletingEventId === eventItem.id} />
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
