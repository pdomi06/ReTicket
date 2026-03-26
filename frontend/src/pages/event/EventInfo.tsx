import { type IEvent } from "../../utils/interfaces"
import { formatUnixDateTime } from "../../utils/dateTime"
import style from "./Event.module.css"

interface EventInfoProps {
    event: IEvent
}

const EventInfo = ({ event }: EventInfoProps) => {
    return (
        <>
            <div className={`position-relative ${style.eventImage}`}>
                {event.imageUrl && (
                    <img
                        src={event.imageUrl}
                        alt={event.name || "Event image"}
                        className={`w-100 h-100 ${style.eventImageTag}`}
                    />
                )}
            </div>
            <div className={`${style.backgroundColorSecondary} p-4`}>
                <div className="mb-3">
                    {event.category && (
                        <span className={`badge ${style.categoryBadge} small fw-semibold mb-2 d-inline-block`}>
                            {event.category}
                        </span>
                    )}
                </div>
                <h1 className={`fw-bold mb-3 lh-1 ${style.eventTitle}`}>{event.name}</h1>
                <p className="text-white-75 mb-0 lh-lg">{event.description}</p>
                <div className="row border-top border-white border-opacity-25 pt-3 mb-3">
                    {/* TODO: (Not urgent at all) Implement google maps integration for locations and map links */}
                    <div className="col">
                        <p className="text-white-50 small mb-1">📍 Venue</p>
                        <p className={`mb-2 ${style.venueInfo}`}>{event.venue}</p>
                    </div>
                    <div className="col">
                        <p className="text-white-50 small mb-1">🌍 Location</p>
                        <p className={`mb-2 ${style.venueInfo}`}>{event.city}, {event.state}, {event.country}</p>
                    </div>
                    <div className="col">
                        <p className="text-white-50 small mb-1">📬 Address</p>
                        <p className={`mb-2 ${style.venueInfo}`}>{event.address}</p>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col">
                        <p className="text-white-50 small mb-1">Event start:</p>
                        <p className="mb-0">
                            {formatUnixDateTime(event.eventDate)}
                        </p>
                    </div>
                    <div className="col">
                        <p className="text-white-50 small mb-1">Event end:</p>
                        <p className="mb-0">
                            {formatUnixDateTime(event.eventEndDate)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventInfo
