import { useEffect, useState } from "react";
import { LuCalendar, LuMapPin, LuTag } from "react-icons/lu";
import type { IEvent } from "../../../utils/interfaces";
import styles from "./Events.module.css";
import Button from "../../../components/ui/button/Button";

export default function Events() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`);
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

  return (
    <div className={`container-fluid mt-4 ${styles.eventsContainer}`}>
      <div className={styles.headerSection}>
        <h1>Events</h1>
        <div>
          <Button text="+ Add Event" link="/dashboard/create-event" />
        </div>
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
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No events found
                </td>
              </tr>
            ) : (
              events.map((eventItem) => (
                <tr key={eventItem.id}>
                  <td>{eventItem.name}</td>
                  <td>{eventItem.venue}</td>
                  <td>{new Date(eventItem.eventDate).toLocaleDateString()}</td>
                  <td className="text-center">
                    {eventItem.category}
                  </td>
                  <td>{eventItem.basePrice} Ft</td>
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
