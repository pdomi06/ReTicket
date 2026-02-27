import { useState, type ReactNode } from "react";
import { EventContext } from "./EventContextDef";
import type { IEvent } from "../../utils/interfaces";

const EventContextProvider = ({children}: {children: ReactNode}) =>{
    const [event, setEvent] = useState<IEvent>()

    async function getEvent(id: string): Promise<boolean> {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/events/${id}`);
        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            return false;
        }
        if (!contentType.includes('application/json')) {
            return false;
        }
        const data = await response.json();
        setEvent(data as IEvent);
        return true;
    }

    return (
        <EventContext.Provider value={{event, getEvent}}>
            {children}
        </EventContext.Provider>
    )
}

export default EventContextProvider