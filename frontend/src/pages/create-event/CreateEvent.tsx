import { useState, useEffect, type FormEvent } from "react";
import { defaultIEvent } from "../../utils/defaults";
import type { IEvent, IVenueMap } from "../../utils/interfaces";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import Select from "../../components/ui/select/Select";
import { EventCategory } from "../../utils/enums";
import style from "./CreateEvent.module.css";

const CreateEvent = () => {
    const [eventParams, setEventParams] = useState<IEvent>(defaultIEvent);
    const [loading, setLoading] = useState(false);
    const [venues, setVenues] = useState<IVenueMap[]>([]);

    useEffect(() => {
        const abortController = new AbortController();

        async function fetchVenues() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venue`, {
                    signal: abortController.signal,
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
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventParams),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create event: ${response.status} ${response.statusText} - ${errorText}`);
            }
            alert("Event created successfully!");
            try {
                const createdOriginalTickets = await fetch(`${import.meta.env.VITE_API_BASE_URL}/originalTickets/bulk`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        eventId: eventParams.id,
                        eventBasePrice: eventParams.basePrice,
                        venue: eventParams.venue
                    }),
                });
                if (!createdOriginalTickets.ok) {
                    const errorText = await createdOriginalTickets.text();
                    throw new Error(`Failed to create original tickets: ${createdOriginalTickets.status} ${createdOriginalTickets.statusText} - ${errorText}`);
                }
            } catch (error) {
                console.error("Error creating original tickets:", error);
            }
        } catch (error) {
            console.error("Error creating event:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <form onSubmit={handleSubmit} className={`container w-50`}>
                <div className={`rounded p-4 ${style['event-form']}`}>
                    <h1>Create Event</h1>
                    <hr />
                    <div className="d-grid gap-3">
                        <Input type="text" name="name" label="Event Name" onChange={(e) => setEventParams({ ...eventParams, name: e.target.value })} value={eventParams.name || ''} />
                        <Input type="text" name="description" label="Description" onChange={(e) => setEventParams({ ...eventParams, description: e.target.value })} value={eventParams.description || ''} />
                        <Select name="venue" label="Venue" theme="dark" onChange={(e) => setEventParams({ ...eventParams, venue: e.target.value })} value={eventParams.venue || ''} >
                            <option value="" disabled>Select Venue</option>
                            <option value="">None</option>
                            {venues.map((venue) => (
                                <option key={venue.venue} value={venue.venue}>{venue.venue} - {venue.rows * venue.cols} seats</option>
                            ))}
                        </Select>
                        <Input type="text" name="address" label="Address" onChange={(e) => setEventParams({ ...eventParams, address: e.target.value })} value={eventParams.address || ''} />
                        <Input type="text" name="city" label="City" onChange={(e) => setEventParams({ ...eventParams, city: e.target.value })} value={eventParams.city || ''} />
                        <Input type="text" name="state" label="State" onChange={(e) => setEventParams({ ...eventParams, state: e.target.value })} value={eventParams.state || ''} />
                        <Input type="text" name="country" label="Country" onChange={(e) => setEventParams({ ...eventParams, country: e.target.value })} value={eventParams.country || ''} />
                        <Input type="date" name="eventDate" label="Event Date" onChange={(e) => setEventParams({ ...eventParams, eventDate: e.target.value })} value={eventParams.eventDate || ''} />
                        <Input type="date" name="eventEndDate" label="Event End Date" onChange={(e) => setEventParams({ ...eventParams, eventEndDate: e.target.value })} value={eventParams.eventEndDate || ''} />
                        <Input type="number" name="basePrice" label="Base Price" min={0} step={0.01} onChange={(e) => setEventParams({ ...eventParams, basePrice: Number(e.target.value) })} value={eventParams.basePrice || ''} />
                        <Input type="text" name="imageUrl" label="Image URL" onChange={(e) => setEventParams({ ...eventParams, imageUrl: e.target.value })} value={eventParams.imageUrl || ''} />
                        <Select name="category" label="Category" theme="dark" onChange={(e) => setEventParams({ ...eventParams, category: e.target.value as IEvent['category'] })} value={eventParams.category || ''}>
                            <option value="" disabled>Select Category</option>
                            <option value="">None</option>
                            {Object.entries(EventCategory).map(([, value]) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </Select>
                        {loading ? <Button type="button" text="Creating Event..." disabled={true} /> : <Button type="submit" text="Create Event" />}
                    </div>
                </div>
            </form>
        </div>
    );
}
export default CreateEvent;