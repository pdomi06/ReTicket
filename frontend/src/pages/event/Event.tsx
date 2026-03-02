import { useContext, useEffect, useState } from "react"
import { EventContext } from "../../contexts/event/EventContextDef"
import { useSearchParams } from "react-router-dom";
import type { IEvent } from "../../utils/interfaces";
import Button from "../../components/ui/button/Button"
import style from "./Event.module.css"

const Event = () => {
    const { event, getEvent } = useContext(EventContext)
    const [events, setEvents] = useState<IEvent[]>([])
    const [searchParams] = useSearchParams()
    const [loadingEvent, setLoadingEvent] = useState(true)
    const [loadingEvents, setLoadingEvents] = useState(true)
    useEffect(() => {
        async function fetchEvent(): Promise<boolean> {
            setLoadingEvent(true)
            try {
                await getEvent(searchParams.get("event") || "")
            } catch (err) {
                console.error(err)
                return false
            } finally {
                setLoadingEvent(false)

            }
            return true
        }
        async function fetchSubEvents() {
            setLoadingEvents(true)
            try {
                const data = await (await fetch(`${import.meta.env.VITE_API_BASE_URL}/events?name=${event?.name}`)).json()
                setEvents(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoadingEvents(false)
            }
        }
        (async () => {
            const result = await fetchEvent()
            if (result) {
                await fetchSubEvents()
            } else {
                setLoadingEvents(false)
            }
        })()

    }, [searchParams])
    return (
        <div className="container my-5">
            {loadingEvent ? (
                <p>Loading...</p>
            ) : event ? (
                <div className="row">
                    <div className={`col-12 col-md-7 text-white mb-4 p-0`}>
                        <div className={`w-100 ${style.backgroundColorMain} rounded-2 overflow-hidden`}>
                            <div className={`position-relative ${style.eventImage}`}>
                                <img src={event?.imageUrl || ""} alt={event?.name || "Event image"} className={`w-100 h-100 ${style.eventImageTag}`} />
                            </div>
                            <div className={`${style.backgroundColorSecondary} p-4`}>
                                <div className="mb-3">
                                    {event?.category && <span className={`badge ${style.categoryBadge} small fw-semibold mb-2 d-inline-block`}>{event.category}</span>}
                                </div>
                                <h1 className={`fw-bold mb-3 lh-1 ${style.eventTitle}`}>{event?.name}</h1>
                                <p className="text-white-75 mb-0 lh-lg">{event?.description}</p>
                                <div className="row border-top border-white border-opacity-25 pt-3 mb-3">
                                    {/* TODO: (Not urgent at all) Implement google maps integration for locations and map links */}
                                    <div className="col">
                                        <p className="text-white-50 small mb-1">📍 Venue</p>
                                        <p className={`mb-2 ${style.venueInfo}`}>{event?.venue}</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-white-50 small mb-1">🌍 Location</p>
                                        <p className={`mb-2 ${style.venueInfo}`}>{event?.city}, {event?.state}, {event?.country}</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-white-50 small mb-1">📬 Address</p>
                                        
                                        <p className={`mb-2 ${style.venueInfo}`}>{event?.address}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col">
                                        <p className="text-white-50 small mb-1">Event start:</p>
                                        <p className="mb-0">{new Date(event?.eventDate || "").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <div className="col">
                                        <p className="text-white-50 small mb-1">Event end:</p>
                                        <p className="mb-0">{new Date(event?.eventEndDate || "").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-5">
                        {loadingEvents ? (
                            <div className="text-white text-center py-4">Loading dates...</div>
                        ) : (
                            <div className={`rounded-2 ${style.backgroundColorMain} text-white ${style.datesList}`}>
                                <div className="p-4 pb-3 flex-shrink-0">
                                    <h2 className="mb-2 fw-bold">Available Dates</h2>
                                </div>
                                <hr className="border-white opacity-25 my-0 flex-shrink-0" />
                                <div className={style.datesScrollArea}>
                                    {events.map((e: IEvent) => {
                                        const eventDate = new Date(e.eventDate);
                                        const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
                                        const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                        return (
                                            <div key={e.id} className={`${style.backgroundColorSecondary} mx-3 mb-3 rounded-2 overflow-hidden ${style.dateCard}`}>
                                                <div className="p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div className="flex-grow-1">
                                                            <p className={`small fw-semibold letter-spacing mb-1 ${style.dayLabel}`}>{dayName.toUpperCase()}</p>
                                                            <h5 className="mb-0 fw-bold fs-5 text-white">{formattedDate}</h5>
                                                        </div>
                                                        {event?.category && <span className={`badge ${style.categoryBadge} small fw-semibold`}>{e.category}</span>}
                                                    </div>
                                                    <div className={`border-top border-white border-opacity-25 pt-3 mb-3 ${style.accentBorder}`}>
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <p>
                                                                    <span className={`small mb-2 ${style.priceLabel}`}>
                                                                        From
                                                                    </span>
                                                                    <span className={`fw-semibold ms-1 ${style.priceValue}`}>
                                                                        {e.basePrice.toLocaleString()} Ft
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            {e.venue && <p className="text-white-50 small mb-0 text-end">📍 {e.venue}<br />{e.city}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <div style={{ flex: 1 }}>
                                                            <Button type="button" text="View Details" link={`/event?event=${e.id}`} />
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <Button type="button" text="Book Now" link={`/venue/${e.id}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Event not found.</p>
            )}
        </div>
    )
}

export default Event