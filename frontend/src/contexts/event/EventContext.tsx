import { useCallback, useMemo, useState, type ReactNode } from "react";
import { EventContext } from "./EventContextDef";
import type { IEvent } from "../../utils/interfaces";
import { apiFetch } from "../../lib/apiFetch";

const EventContextProvider = ({ children }: { children: ReactNode }) => {
    const [event, setEvent] = useState<IEvent>()

    const getEvent = useCallback(async (id: string): Promise<IEvent | undefined> => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await apiFetch(`${apiBaseUrl}/events/${id}`, {
            headers: {},
        });
        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            setEvent(undefined);
            return undefined;
        }
        if (!contentType.includes('application/json')) {
            setEvent(undefined);
            return undefined;
        }
        const json = await response.json();
        const eventData = ((json as { data?: unknown }).data ?? json) as IEvent;
        setEvent(eventData);
        return eventData;
    }, []);

    const value = useMemo(() => ({ event, getEvent }), [event, getEvent]);

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    )
}

export default EventContextProvider