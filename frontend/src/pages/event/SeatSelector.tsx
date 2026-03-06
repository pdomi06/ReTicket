import { useContext, useState } from "react"
import { CartContext } from "../../contexts/cart/CartContextDef"
import { type IVenueMap, type IOriginalTicket } from "../../utils/interfaces"
import Button from "../../components/ui/button/Button"
import style from "./Event.module.css"

interface SeatSelectorProps {
    venue: IVenueMap
    eventId: string
    loading: boolean
    tickets: IOriginalTicket[]
}

const SeatSelector = ({ venue, eventId, loading, tickets }: SeatSelectorProps) => {
    const { addToCart } = useContext(CartContext)
    const [checkedSeats, setCheckedSeats] = useState<string[]>([])
    const [addingToCart, setAddingToCart] = useState(false)
    const [zoom, setZoom] = useState(1)

    const seatExists = (row: number, col: number) => {
        return tickets.some(t => Number(t.row) === row && Number(t.seatNumber) === col)
    }

    const handleZoomIn = () => {
        setZoom(prev => Math.min(3, prev + 0.2))
    }

    const handleZoomOut = () => {
        setZoom(prev => Math.max(0.5, prev - 0.2))
    }

    async function handleAddToCart() {
        if (checkedSeats.length === 0) {
            alert("Please select at least one seat before adding to cart.")
            return
        }
        setAddingToCart(true)
        for (const seat of checkedSeats) {
            const [row, col] = seat.split('')
            await addToCart(eventId, row, col)
        }
        setAddingToCart(false)
        alert("Selected tickets have been added to your cart!")
    }

    return (
        <div className={`${style.backgroundColorSecondary} p-4 mt-3`}>
            <h2 className="fw-bold mb-3 lh-1">Tickets</h2>
            {loading ? (
                <p>Loading venue information...</p>
            ) : venue.venue ? (
                <div>
                    <div className="d-flex gap-2 mb-3">
                        <button
                            onClick={handleZoomOut}
                            className="btn btn-sm btn-outline-light"
                            disabled={zoom <= 0.5}
                        >
                            −
                        </button>
                        <span className="align-self-center" style={{ minWidth: '60px', textAlign: 'center' }}>
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            onClick={handleZoomIn}
                            className="btn btn-sm btn-outline-light"
                            disabled={zoom >= 3}
                        >
                            +
                        </button>
                    </div>
                    <div
                        className={style.seatGridContainer}
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
                                                disabled={!available}
                                                onChange={(e) => {
                                                    if (!available) return
                                                    const seatKey = `${row}${col}`
                                                    if (e.target.checked) {
                                                        setCheckedSeats(prev => [...prev, seatKey])
                                                    } else {
                                                        setCheckedSeats(prev => prev.filter(s => s !== seatKey))
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
                    <Button text="Add to Cart" className="w-100 mt-3" onClick={handleAddToCart} disabled={addingToCart} />
                </div>
            ) : (
                <p className="mb-0">Tickets are not available for this event.</p>
            )}
        </div>
    )
}

export default SeatSelector
