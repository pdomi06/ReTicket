import { useSearchParams } from "react-router-dom"
import style from "./Event.module.css"
import { useEventData } from "./useEventData"
import EventInfo from "./EventInfo"
import SeatSelector from "./SeatSelector"
import EventDates from "./EventDates"

const Event = () => {
    const [searchParams] = useSearchParams()
    const eventId = searchParams.get("event") || ""
    const { event, events, venue, dbTickets, refreshTickets } = useEventData(eventId)
    if (!eventId) {
        return <p>Event not specified.</p>
    }
    if (eventId) {
        return (
            <div className="container my-5">
                {event ? (
                    <div className="row">
                        <div className={`col-12 col-md-7 text-white mb-4 p-0`}>
                            <div className={`w-100 ${style.backgroundColorMain} rounded-2 overflow-hidden`}>
                                <EventInfo event={event} />
                                <SeatSelector venue={venue} eventId={Number(eventId)} loading={false} dbTickets={dbTickets} onReload={refreshTickets} />
                            </div>
                        </div>
                        <div className="col-12 col-md-5">
                            <EventDates events={events} loading={false} />
                        </div>
                    </div>
                ) : (
                    <p>Event not found.</p>
                )}
            </div>
        )
    }
}

export default Event