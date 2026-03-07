import { type IEvent } from "../../utils/interfaces"
import DateCard from "./DateCard"
import style from "./Event.module.css"

interface EventDatesProps {
    events: IEvent[]
    loading: boolean
}

const EventDates = ({ events, loading }: EventDatesProps) => {
    if (loading) {
        return <div className="text-white text-center py-4">Loading dates...</div>
    }

    return (
        <div className={`rounded-2 ${style.backgroundColorMain} text-white ${style.datesList}`}>
            <div className="p-4 pb-3 flex-shrink-0">
                <h2 className="mb-2 fw-bold">Available Dates</h2>
            </div>
            <hr className="border-white opacity-25 my-0 flex-shrink-0" />
            <div className={style.datesScrollArea}>
                {events.map((e) => (
                    <DateCard key={e.id} event={e} />
                ))}
            </div>
        </div>
    )
}

export default EventDates
