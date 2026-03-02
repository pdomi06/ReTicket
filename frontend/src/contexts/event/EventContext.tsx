import { useCallback, useMemo, useState, type ReactNode } from "react";
import { EventContext } from "./EventContextDef";
import type { IEvent } from "../../utils/interfaces";

const EventContextProvider = ({children}: {children: ReactNode}) =>{
    const [event, setEvent] = useState<IEvent>()

    const getEvent = useCallback(async (id: string): Promise<boolean> => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/events/${id}`);
        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            setEvent(undefined);
            return false;
        }
        if (!contentType.includes('application/json')) {
            setEvent(undefined);
            return false;
        }
        const json = await response.json();
        const eventData = (json as { data?: unknown }).data ?? json;
        setEvent(eventData as IEvent);
        return true;
    }, []);

    const value = useMemo(() => ({ event, getEvent }), [event, getEvent]);

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    )
}

export default EventContextProvider