import { useState, useEffect, type FormEvent } from "react";
import { defaultIEvent } from "../../../utils/defaults";
import type { IEvent, IEventForm, IVenueMap } from "../../../utils/interfaces";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import { EventCategory } from "../../../utils/enums";
import { toDateTimeLocalValue, toUnixSeconds } from "../../../utils/dateTime";
import style from "./EditEvent.module.css";
import { useParams } from "react-router-dom";

const EditEvent = () => {
    const [eventParams, setEventParams] = useState<IEventForm>(defaultIEvent);
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [venues, setVenues] = useState<IVenueMap[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);


    useEffect(() => {
        const abortController = new AbortController();
        async function fetchEvent() {
            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/${id}`, {
                    signal: abortController.signal,
                    headers
                });
                if (!response.ok) {
                    console.error('Failed to fetch event:', response.status, response.statusText);
                    return;
                }
                const contentType = response.headers.get('content-type') || '';
                if (!contentType.toLowerCase().includes('application/json')) {
                    console.error('Unexpected content-type when fetching event:', contentType);
                    return;
                }
                const data = await response.json();
                const eventData = data?.data || data;
                if (typeof eventData !== 'object' || eventData === null) {
                    console.error('Expected an event object but got:', eventData);
                    return;
                }
                const normalizedEventData = eventData as IEvent;
                setEventParams({
                    ...normalizedEventData,
                    eventDate: toDateTimeLocalValue(normalizedEventData.eventDate),
                    eventEndDate: toDateTimeLocalValue(normalizedEventData.eventEndDate),
                } as IEventForm);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching event:', error);
                }
            }
        }
        fetchEvent();
        return () => abortController.abort();
    }, [id]);

    useEffect(() => {
        const abortController = new AbortController();

        async function fetchVenues() {
            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venue`, {
                    signal: abortController.signal,
                    headers
                });
                if (!response.ok) {
                    console.error('Failed to fetch venues:', response.status, response.statusText);
                    return;
                }
                const contentType = response.headers.get('content-type') || '';
                if (!contentType.toLowerCase().includes('application/json')) {
                    console.error('Unexpected content-type when fetching venues:', contentType);
                    return;
                }
                const data: unknown = await response.json();
                if (!Array.isArray(data)) {
                    console.error('Expected an array of venues but got:', data);
                    return;
                }
                setVenues(data as IVenueMap[]);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching venues:', error);
                }
            }
        }
        fetchVenues();

        return () => abortController.abort();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const eventDateUnix = toUnixSeconds(eventParams.eventDate);
            const eventEndDateUnix = toUnixSeconds(eventParams.eventEndDate);

            if (eventDateUnix === null || eventEndDateUnix === null) {
                throw new Error("Please provide valid event start and end date/time values.");
            }

            const token = localStorage.getItem('token');
            const headers: HeadersInit = { "Content-Type": "application/json" };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const payload = {
                ...eventParams,
                eventDate: eventDateUnix,
                eventEndDate: eventEndDateUnix,
            };

            const eventResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/events/${eventParams.id}`,
                {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(payload),
                }
            );

            if (!eventResponse.ok) {
                const errorText = await eventResponse.text();
                throw new Error(
                    `Failed to update event: ${eventResponse.status} ${eventResponse.statusText} - ${errorText}`
                );
            }

            const createdEvent = await eventResponse.json();
            const createdEventId = createdEvent?.data?.id ?? createdEvent?.id;
            if (!createdEventId) {
                throw new Error("Event updated but no id returned by API");
            }

            const selectedVenue = venues
                .filter((venue) => venue.venue === eventParams.venue)
                .map((venue) => ({
                    section: venue.section,
                    row: venue.rows,
                    col: venue.cols,
                    rate: venue.rate,
                }));

            if (selectedVenue.length === 0) {
                throw new Error("Failed to update tickets: no matching venue found for the event");
            }

            const ticketsResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/originalTickets/bulk`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        eventId: createdEventId,
                        eventBasePrice: eventParams.basePrice,
                        venue: selectedVenue,
                    }),
                }
            );

            if (!ticketsResponse.ok) {
                const errorText = await ticketsResponse.text();
                throw new Error(
                    `Failed to update tickets: ${ticketsResponse.status} ${ticketsResponse.statusText} - ${errorText}`
                );
            }

            setMessage({
                type: "success",
                text: "Event and tickets updated successfully!",
            });
            setEventParams(defaultIEvent);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "An unexpected error occurred";
            setMessage({ type: "error", text: errorMessage });
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <form onSubmit={handleSubmit} className={`container w-50`}>
                <div className={`rounded p-4 ${style['event-form']}`}>
                    <h1>Edit Event</h1>
                    <hr />
                    {message && (
                        <div
                            className={`alert alert-${message.type === "success" ? "success" : "danger"} mb-3`}
                            role="alert"
                        >
                            {message.text}
                        </div>
                    )}
                    <div className="d-grid gap-3">
                        <Input type="text" name="name" label="Event Name" onChange={(e) => setEventParams({ ...eventParams, name: e.target.value })} value={eventParams.name || ''} />
                        <Input type="text" name="description" label="Description" onChange={(e) => setEventParams({ ...eventParams, description: e.target.value })} value={eventParams.description || ''} />
                        <Select name="venue" label="Venue" theme="dark" onChange={(e) => setEventParams({ ...eventParams, venue: e.target.value })} value={eventParams.venue || ''} >
                            <option value="" disabled aria-hidden="true">
                                Select Venue
                            </option>
                            {venues.map((venue) => (
                                <option key={venue.venue} value={venue.venue}>{venue.venue} - {venue.rows * venue.cols} seats</option>
                            ))}
                        </Select>
                        <Input type="text" name="address" label="Address" onChange={(e) => setEventParams({ ...eventParams, address: e.target.value })} value={eventParams.address || ''} />
                        <Input type="text" name="city" label="City" onChange={(e) => setEventParams({ ...eventParams, city: e.target.value })} value={eventParams.city || ''} />
                        <Input type="text" name="state" label="State" onChange={(e) => setEventParams({ ...eventParams, state: e.target.value })} value={eventParams.state || ''} />
                        <Input type="text" name="country" label="Country" onChange={(e) => setEventParams({ ...eventParams, country: e.target.value })} value={eventParams.country || ''} />
                        <Input type="datetime-local" name="eventDate" label="Event Date & Time" onChange={(e) => setEventParams({ ...eventParams, eventDate: e.target.value })} value={typeof eventParams.eventDate === "string" ? eventParams.eventDate : ''} />
                        <Input type="datetime-local" name="eventEndDate" label="Event End Date & Time" onChange={(e) => setEventParams({ ...eventParams, eventEndDate: e.target.value })} value={typeof eventParams.eventEndDate === "string" ? eventParams.eventEndDate : ''} />
                        <Input type="number" name="basePrice" label="Base Price" min={0} step={0.01} onChange={(e) => setEventParams({ ...eventParams, basePrice: Number(e.target.value) })} value={eventParams.basePrice || ''} />
                        <Input type="text" name="imageUrl" label="Image URL" onChange={(e) => setEventParams({ ...eventParams, imageUrl: e.target.value })} value={eventParams.imageUrl || ''} />
                        <Select name="category" label="Category" theme="dark" onChange={(e) => setEventParams({ ...eventParams, category: e.target.value as IEvent['category'] })} value={eventParams.category || ''}>
                            <option value="" disabled aria-hidden="true">
                                Select Category
                            </option>
                            {Object.entries(EventCategory).map(([, value]) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                        {loading ? <Button type="button" text="Updating Event..." disabled={true} /> : <Button type="submit" text="Update Event" />}
                    </div>
                </div>
            </form>
        </div>
    );
}
export default EditEvent;
