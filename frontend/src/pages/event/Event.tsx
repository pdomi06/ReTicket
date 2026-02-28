import { useContext, useEffect, useState } from "react"
import { EventContext } from "../../contexts/event/EventContextDef"
import { useSearchParams } from "react-router-dom";

const Event = () => {
    const { event, getEvent } = useContext(EventContext)
    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetchEvent() {
            setLoading(true)
            try {
                await getEvent(searchParams.get("event") || "")
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchEvent()
    }, [getEvent, searchParams])
    return (
        <div className="container my-5">
            {loading ? (
                <p>Loading...</p>
            ) : event ? (
            <div className="card bg-black text-white">
                <div className="card-body">
                    <img src={event?.imageUrl || ""} alt={event?.name || "Event image"} className="card-img-top" />
                    <h5 className="card-title">{event?.name}</h5>
                    <p className="card-text">{event?.description}</p>
                </div>
            </div>
            ) : (
                <p>Event not found.</p>
            )}
        </div>
    )
}

export default Event