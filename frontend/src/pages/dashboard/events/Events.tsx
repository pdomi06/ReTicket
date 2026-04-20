import { useCallback, useLayoutEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import type { IEvent } from "../../../utils/interfaces";
import { TicketStatus } from "../../../utils/enums";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import styles from "./Events.module.css";
import Button from "../../../components/ui/button/Button";
import Modal from "../../../components/ui/modal/Modal";
import { formatUnixDateTime } from "../../../utils/dateTime";
import { defaultIEvent } from "../../../utils/defaults";
import type { IEventForm, IVenueMap } from "../../../utils/interfaces";
import { EventCategory } from "../../../utils/enums";
import { toDateTimeLocalValue, toUnixSeconds } from "../../../utils/dateTime";
import { apiFetch } from "../../../lib/apiFetch";
import { usePageLoading } from "../../../contexts/loading/LoadingContext";

export default function Events() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [statusUpdatingEventId, setStatusUpdatingEventId] = useState<number | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [editFormData, setEditFormData] = useState<IEventForm>(defaultIEvent);
  const [venues, setVenues] = useState<IVenueMap[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trackPageLoading = usePageLoading();
  const [filters, setFilters] = useState({
    name: "",
    venue: "",
    category: "",
  });

  const fetchInitialData = useCallback(async () => {
    const fetchEvents = async () => {
      try {
        const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/events`);
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
    };

    const fetchVenues = async () => {
      try {
        const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/venues`);
        if (!response.ok) return;

        const data = await response.json();
        const venueList = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setVenues(venueList);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    };

    await Promise.all([fetchEvents(), fetchVenues()]);
  }, []);

  useLayoutEffect(() => {
    const initialDataPromise = fetchInitialData();
    void trackPageLoading(initialDataPromise);
  }, [fetchInitialData, trackPageLoading]);

  const handleStatusChange = useCallback(async (eventId: number, newStatus: string) => {
    setStatusUpdatingEventId(eventId);
    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/originalTickets/bulkStatusChange`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      setStatusUpdatingEventId(null);
    }
  }, []);

  const handleDeleteEvent = useCallback(async (eventId: number, eventName: string) => {
    if (!confirm(`Are you sure you want to delete the event "${eventName}"?`)) {
      return;
    }

    setDeletingEventId(eventId);
    try {
      const response = await apiFetch(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
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
  }, []);

  const handleOpenEdit = useCallback((eventItem: IEvent) => {
    setSelectedEvent(eventItem);
    setEditFormData({
      id: eventItem.id,
      name: eventItem.name,
      description: eventItem.description,
      venue: eventItem.venue,
      address: eventItem.address,
      city: eventItem.city,
      state: eventItem.state,
      country: eventItem.country,
      eventDate: toDateTimeLocalValue(eventItem.eventDate),
      eventEndDate: toDateTimeLocalValue(eventItem.eventEndDate),
      category: eventItem.category,
      basePrice: eventItem.basePrice,
      imageUrl: eventItem.imageUrl,
      isFeatured: eventItem.isFeatured,
    });
    setEditModalOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditModalOpen(false);
    setSelectedEvent(null);
    setEditFormData(defaultIEvent);
  }, []);

  const handleSaveEdit = async () => {
    if (!selectedEvent) return;

    setIsSubmitting(true);
    try {
      const eventDateUnix = toUnixSeconds(editFormData.eventDate);
      const eventEndDateUnix = toUnixSeconds(editFormData.eventEndDate);

      if (eventDateUnix === null || eventEndDateUnix === null) {
        throw new Error("Please provide valid event start and end date/time values.");
      }

      const payload = {
        ...editFormData,
        eventDate: eventDateUnix,
        eventEndDate: eventEndDateUnix,
      };

      const eventResponse = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/events/${selectedEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!eventResponse.ok) {
        const errorText = await eventResponse.text();
        throw new Error(`Failed to update event: ${eventResponse.status} ${eventResponse.statusText} - ${errorText}`);
      }

      const updatedEvent = await eventResponse.json();
      const updatedEventId = updatedEvent?.data?.id ?? updatedEvent?.id;

      if (!updatedEventId) {
        throw new Error("Event updated but no id returned by API");
      }

      const selectedVenue = venues
        .filter((venue) => venue.venue === editFormData.venue)
        .map((venue) => ({
          section: venue.section,
          row: venue.rows,
          col: venue.cols,
          rate: venue.rate,
        }));

      if (selectedVenue.length === 0) {
        throw new Error("Failed to update tickets: no matching venue found for the event");
      }

      const ticketsResponse = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/originalTickets/bulk`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: updatedEventId,
          eventBasePrice: editFormData.basePrice,
          venue: selectedVenue,
        }),
      });

      if (!ticketsResponse.ok) {
        const errorText = await ticketsResponse.text();
        throw new Error(`Failed to update tickets: ${ticketsResponse.status} ${ticketsResponse.statusText} - ${errorText}`);
      }

      setEvents((prev) => prev.map((event) => (
        event.id === selectedEvent.id
          ? {
            ...event,
            ...editFormData,
            eventDate: eventDateUnix,
            eventEndDate: eventEndDateUnix,
          }
          : event
      )));

      handleCloseEdit();
    } catch (error) {
      console.error("Error updating event:", error);
      alert(error instanceof Error ? error.message : "Failed to update event");
    } finally {
      setIsSubmitting(false);
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

  const eventsById = useMemo(() => {
    const eventsMap = new Map<number, IEvent>();
    filteredEvents.forEach((eventItem) => {
      eventsMap.set(eventItem.id, eventItem);
    });
    return eventsMap;
  }, [filteredEvents]);

  const getEventIdFromControl = useCallback((control: HTMLButtonElement | HTMLSelectElement) => {
    const eventId = Number(control.dataset.eventId);
    return Number.isFinite(eventId) ? eventId : null;
  }, []);

  const getEventFromControl = useCallback((control: HTMLButtonElement | HTMLSelectElement) => {
    const eventId = getEventIdFromControl(control);
    if (eventId === null) {
      return null;
    }

    return eventsById.get(eventId) ?? null;
  }, [eventsById, getEventIdFromControl]);

  const handleStatusSelectChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const eventId = getEventIdFromControl(event.currentTarget);
    if (eventId === null) {
      return;
    }

    void handleStatusChange(eventId, event.currentTarget.value);
  }, [getEventIdFromControl, handleStatusChange]);

  const handleOpenEditButtonClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const eventItem = getEventFromControl(event.currentTarget);
    if (!eventItem) {
      return;
    }

    handleOpenEdit(eventItem);
  }, [getEventFromControl, handleOpenEdit]);

  const handleDeleteButtonClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const eventItem = getEventFromControl(event.currentTarget);
    if (!eventItem) {
      return;
    }

    void handleDeleteEvent(eventItem.id, eventItem.name);
  }, [getEventFromControl, handleDeleteEvent]);

  const uniqueCategories = [...new Set(events.map((e) => e.category))];

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.headerSection}>
        <h1>Events</h1>
        <div>
          <Button text="+ Add Event" link="/dashboard/create-event" />
        </div>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <div className={styles.filterField}>
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
          <div className={styles.filterField}>
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
          <div className={styles.filterField}>
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
            <div>
              <Button text="Clear" onClick={handleClearFilters} variant="outline" />
            </div>
          )}
        </div>
        <p className={styles.resultCount}>
          Showing {filteredEvents.length} of {events.length} events
        </p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Category</th>
              <th>Base Price</th>
              <th>Ticket Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyState}>
                  {events.length === 0 ? "No events found" : "No events match your filters"}
                </td>
              </tr>
            ) : (
              filteredEvents.map((eventItem) => (
                <tr key={eventItem.id}>
                  <td>{eventItem.name}</td>
                  <td>{eventItem.venue}</td>
                  <td>{formatUnixDateTime(eventItem.eventDate)}</td>
                  <td>{eventItem.category}</td>
                  <td>{eventItem.basePrice} Ft</td>
                  <td>
                    <select
                      className={styles.statusSelect}
                      data-event-id={eventItem.id}
                      value={eventItem.firstTicketStatus || ""}
                      onChange={handleStatusSelectChange}
                      disabled={statusUpdatingEventId === eventItem.id}
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
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.iconButton}
                        data-event-id={eventItem.id}
                        onClick={handleOpenEditButtonClick}
                        title="Edit event"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.iconButton}
                        data-event-id={eventItem.id}
                        onClick={handleDeleteButtonClick}
                        disabled={deletingEventId === eventItem.id}
                        title="Delete event"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={handleCloseEdit}
        title="Edit Event"
        confirmText={isSubmitting ? "Updating Event..." : "Update Event"}
        onConfirm={handleSaveEdit}
      >
        <div className={styles.editModal}>
          <Input type="text" name="name" label="Event Name" onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} value={editFormData.name || ''} />
          <Input type="text" name="description" label="Description" onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} value={editFormData.description || ''} />
          <Select name="venue" label="Venue" theme="dark" onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })} value={editFormData.venue || ''}>
            <option value="" disabled aria-hidden="true">Select Venue</option>
            {venues.map((venue) => (
              <option key={venue.venue} value={venue.venue}>{venue.venue} - {venue.rows * venue.cols} seats</option>
            ))}
          </Select>
          <Input type="text" name="address" label="Address" onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} value={editFormData.address || ''} />
          <Input type="text" name="city" label="City" onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })} value={editFormData.city || ''} />
          <Input type="text" name="state" label="State" onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })} value={editFormData.state || ''} />
          <Input type="text" name="country" label="Country" onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })} value={editFormData.country || ''} />
          <Input type="datetime-local" name="eventDate" label="Event Date & Time" onChange={(e) => setEditFormData({ ...editFormData, eventDate: e.target.value })} value={typeof editFormData.eventDate === "string" ? editFormData.eventDate : ''} />
          <Input type="datetime-local" name="eventEndDate" label="Event End Date & Time" onChange={(e) => setEditFormData({ ...editFormData, eventEndDate: e.target.value })} value={typeof editFormData.eventEndDate === "string" ? editFormData.eventEndDate : ''} />
          <Input type="number" name="basePrice" label="Base Price" min={0} step={0.01} onChange={(e) => setEditFormData({ ...editFormData, basePrice: Number(e.target.value) })} value={editFormData.basePrice || ''} />
          <Input type="text" name="imageUrl" label="Image URL" onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })} value={editFormData.imageUrl || ''} />
          <Select name="category" label="Category" theme="dark" onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as IEvent['category'] })} value={editFormData.category || ''}>
            <option value="" disabled aria-hidden="true">Select Category</option>
            {Object.entries(EventCategory).map(([, value]) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}
