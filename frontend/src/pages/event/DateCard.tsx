import { type IEvent } from "../../utils/interfaces"
import Button from "../../components/ui/button/Button"
import { toDateFromUnix } from "../../utils/dateTime"
import style from "./Event.module.css"

interface DateCardProps {
    event: IEvent
}

const DateCard = ({ event: e }: DateCardProps) => {
    const eventDate = toDateFromUnix(e.eventDate) ?? new Date()
    const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' })
    const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <div className={`${style.backgroundColorSecondary} mx-3 mb-3 rounded-2 overflow-hidden ${style.dateCard}`}>
            <div className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                        <p className={`small fw-semibold letter-spacing mb-1 ${style.dayLabel}`}>
                            {dayName.toUpperCase()}
                        </p>
                        <h5 className="mb-0 fw-bold fs-5 text-white">{formattedDate}</h5>
                    </div>
                    {e.category && (
                        <span className={`badge ${style.categoryBadge} small fw-semibold`}>{e.category}</span>
                    )}
                </div>
                <div className={`border-top border-white border-opacity-25 pt-3 mb-3 ${style.accentBorder}`}>
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <p>
                                <span className={`small mb-2 ${style.priceLabel}`}>From</span>
                                <span className={`fw-semibold ms-1 ${style.priceValue}`}>
                                    {e.basePrice.toLocaleString()} Ft
                                </span>
                            </p>
                        </div>
                        {e.venue && (
                            <p className="text-white-50 small mb-0 text-end">📍 {e.venue}<br />{e.city}</p>
                        )}
                    </div>
                </div>
                <Button text="Book Now" link={`/event?event=${e.id}`} />
            </div>
        </div>
    )
}

export default DateCard
