import { useContext, useState } from "react"
import { CartContext } from "../../contexts/cart/CartContextDef"
import { type IVenueMap, type IOriginalTicket } from "../../utils/interfaces"
import Button from "../../components/ui/button/Button"
import style from "./Event.module.css"

interface SeatSelectorProps {
    venue: IVenueMap
    eventId: string
    loading: boolean
    dbTickets: IOriginalTicket[]
    onReload: () => Promise<void>
}

const SeatSelector = ({ venue, eventId, loading, dbTickets, onReload }: SeatSelectorProps) => {
    const { addToCart } = useContext(CartContext)
    const [addingToCart, setAddingToCart] = useState(false)
    const [zoom, setZoom] = useState(1)
    const [isReloading, setIsReloading] = useState(false)

    const seatExists = (row: number, col: number) => {
        return dbTickets.some(t => t.row === row && t.seatNumber === col)
    }

    const handleZoomIn = () => {
        setZoom(prev => Math.min(3, prev + 0.2))
    }

    const handleZoomOut = () => {
        setZoom(prev => Math.max(0.5, prev - 0.2))
    }

    const handleReload = async () => {
        setIsReloading(true)
        try {
            await onReload()
        } finally {
            setIsReloading(false)
        }
    }

    async function handleAddToCart(seat: string) {
        setAddingToCart(true)
        const [rowStr, colStr] = seat.split('-')
        const row = Number(rowStr)
        const col = Number(colStr)
        if (!dbTickets.some(t => t.row === row && t.seatNumber === col)) {
            alert(`Seat ${row}-${col} is no longer available.`)
            setAddingToCart(false)
            return
        }
        await addToCart(eventId, row, col)
        await handleReload()
        setAddingToCart(false)
        alert("Selected tickets have been added to your cart!")
    }

    return (
        <div className={`${style.backgroundColorSecondary} p-4 mt-3 ${addingToCart ? style.loadingCursor : ''}`}>
            <h2 className="fw-bold mb-3 lh-1">Tickets</h2>
            {loading ? (
                <p>Loading venue information...</p>
            ) : venue.venue ? (
                <div>
                    <div className={style.controlBar}>
                        <div className={style.zoomButtonWrapper}>
                            <Button text="−" variant="outline" onClick={handleZoomOut} disabled={zoom <= 0.5} />
                        </div>
                        <span className={style.zoomDisplay}>
                            {Math.round(zoom * 100)}%
                        </span>
                        <div className={style.zoomButtonWrapper}>
                            <Button text="+" variant="outline" onClick={handleZoomIn} disabled={zoom >= 3} />
                        </div>
                        <div className={style.reloadButtonWrapper}>
                            <Button text={<><span className={`${style.reloadIcon} ${isReloading ? style.spinning : ''}`}>↻</span> Reload</>} variant="outline" onClick={handleReload} disabled={isReloading} />
                        </div>
                    </div>
                    <div
                        className={`${style.seatGridContainer}`}
                        style={{ '--seat-zoom': zoom } as React.CSSProperties}
                    >
                        {Array.from({ length: venue.rows }, (_, i) => (
                            <div className={style.seatRow} key={`row-${i}`}>
                                {Array.from({ length: venue.cols }, (_, j) => {
                                    const row = i + 1
                                    const col = j + 1
                                    const available = seatExists(row, col)

                                    return (
                                        <div
                                            key={`seat-${i}-${j}`}
                                            className={`${style.seatSelector} ${!available ? style.seatUnavailable : ""}`}
                                            title={available ? "Click to select" : "Seat not available"}
                                        >
                                            <input
                                                type="checkbox"
                                                name={`seat-${row}-${col}`}
                                                id={`seat-${row}-${col}`}
                                                disabled={!available || addingToCart}
                                                onChange={(e) => {
                                                    if (!available) return
                                                    const seatKey = `${row}-${col}`
                                                    if (e.target.checked) {
                                                        if (!dbTickets.some(t => t.row === row && t.seatNumber === col)) {
                                                            alert(`Seat ${row}-${col} is no longer available.`)
                                                            e.target.checked = false
                                                            return
                                                        }
                                                        handleAddToCart(seatKey)
                                                    }
                                                }}
                                            />
                                            <label htmlFor={`seat-${row}-${col}`}>{row}-{col}</label>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="mb-0">Tickets are not available for this event.</p>
            )}
        </div>
    )
}

export default SeatSelector
