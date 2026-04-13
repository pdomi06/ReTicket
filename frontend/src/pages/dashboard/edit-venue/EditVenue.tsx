import { useState, useEffect } from "react";
import type { IVenueMap, IEvent } from "../../../utils/interfaces";
import Input from "../../../components/ui/input/Input";
import style from './EditVenue.module.css'
import Button from "../../../components/ui/button/Button";
import Notification from '../../../components/ui/notification/Notification';
import { defaultIVenueMap } from "../../../utils/defaults";
import { useParams } from "react-router-dom";

const EditVenue = () => {
    const { id } = useParams<{ id: string }>();
    const [sceneryParams, setSceneryParams] = useState<IVenueMap>(defaultIVenueMap);
    const [affectedEvents, setAffectedEvents] = useState<IEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchVenue() {
            try {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venue/${id}`, {
                    signal: abortController.signal,
                    headers
                });
                if (!response.ok) {
                    console.error('Failed to fetch venue:', response.status, response.statusText);
                    return;
                }
                const contentType = response.headers.get('content-type') || '';
                if (!contentType.toLowerCase().includes('application/json')) {
                    console.error('Unexpected content-type when fetching venue:', contentType);
                    return;
                }
                const data: unknown = await response.json();
                if (typeof data !== 'object' || data === null) {
                    console.error('Expected a venue object but got:', data);
                    return;
                }
                const venueData = data as IVenueMap;
                setSceneryParams(venueData);

                // Fetch events that use this venue
                if (venueData.venue) {
                    fetchAffectedEvents(venueData.venue);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching venue:', error);
                }
            }
        }
        fetchVenue();
        return () => abortController.abort();
    }, [id]);

    async function fetchAffectedEvents(venueName: string) {
        try {
            const token = localStorage.getItem('token');
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/search?venue=${encodeURIComponent(venueName)}`, {
                headers
            });
            if (!response.ok) {
                console.error('Failed to fetch events:', response.status);
                return;
            }
            const contentType = response.headers.get('content-type') || '';
            if (!contentType.toLowerCase().includes('application/json')) {
                console.error('Unexpected content-type when fetching events:', contentType);
                return;
            }
            const data: unknown = await response.json();
            const events = (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: unknown }).data))
                ? (data as { data: IEvent[] }).data
                : Array.isArray(data)
                    ? (data as IEvent[])
                    : [];
            setAffectedEvents(events);
        } catch (error) {
            console.error('Error fetching affected events:', error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const parsedRows = Number(sceneryParams.rows);
        const parsedCols = Number(sceneryParams.cols);
        const isValidRows = Number.isInteger(parsedRows) && parsedRows >= 1;
        const isValidCols = Number.isInteger(parsedCols) && parsedCols >= 1;
        const isValidRate = Number.isFinite(sceneryParams.rate) && sceneryParams.rate >= 0.1 && sceneryParams.rate <= 9.9;

        if (!sceneryParams.venue || !sceneryParams.section || !isValidRows || !isValidCols || !isValidRate) {
            setMessage({ type: 'error', text: 'Please fill in all fields with valid values.' });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venue/${id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    venue: sceneryParams.venue,
                    section: sceneryParams.section,
                    rows: parsedRows,
                    cols: parsedCols,
                    rate: sceneryParams.rate,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update venue: ${response.status} ${response.statusText} - ${errorText}`);
            }

            setMessage({ type: 'success', text: 'Venue updated successfully!' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setMessage({ type: 'error', text: errorMessage });
            console.error('Error updating venue:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container my-5">
            <form onSubmit={handleSubmit} className={`container w-50`}>
                <div className={`rounded p-4 ${style['scenery-form']}`}>
                    <h1>Edit Venue</h1>
                    <hr />
                    {message && (
                        <Notification text={message.text} variant={message.type === 'success' ? 'success' : 'error'} />
                    )}
                    {affectedEvents.length > 0 && (
                        <div className="alert alert-warning mb-3" role="alert">
                            ⚠️ Warning: This venue is used by {affectedEvents.length} event{affectedEvents.length !== 1 ? 's' : ''}.
                            After updating, you must re-edit each affected event to regenerate their tickets with the new venue configuration.
                            <br />
                            Affected events: {affectedEvents.map(e => e.name).join(', ')}
                        </div>
                    )}
                    <div className="d-grid gap-3">
                        <Input type="text" name="venue" label="Venue" onChange={(e) => setSceneryParams({ ...sceneryParams, venue: e.target.value })} value={sceneryParams.venue || ''} />
                        <Input type="text" name="section" label="Section" onChange={(e) => setSceneryParams({ ...sceneryParams, section: e.target.value })} value={sceneryParams.section || ''} />
                        <Input type="number" name="rows" label="Rows" min={1} onChange={(e) => setSceneryParams({ ...sceneryParams, rows: Number(e.target.value) })} value={sceneryParams.rows || ''} />
                        <Input type="number" name="cols" label="Columns" min={1} onChange={(e) => setSceneryParams({ ...sceneryParams, cols: Number(e.target.value) })} value={sceneryParams.cols || ''} />
                        <Input type="number" name="rate" label="Rate" min={0.1} step={0.1} onChange={(e) => setSceneryParams({ ...sceneryParams, rate: Number(e.target.value) })} value={sceneryParams.rate || ''} />
                        {loading ? <Button type="button" text="Updating Venue..." disabled={true} /> : <Button type="submit" text="Update Venue" />}
                    </div>
                </div>
            </form>
        </div>
    );
}
export default EditVenue;
