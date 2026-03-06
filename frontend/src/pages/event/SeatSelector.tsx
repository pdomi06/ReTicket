import { useContext, useState } from "react"
import { CartContext } from "../../contexts/cart/CartContextDef"
import { type IVenueMap } from "../../utils/interfaces"
import Button from "../../components/ui/button/Button"
import style from "./Event.module.css"

interface SeatSelectorProps {
    venue: IVenueMap
    eventId: string
    loading: boolean
}

const SeatSelector = ({ venue, eventId, loading }: SeatSelectorProps) => {
    const { addToCart } = useContext(CartContext)
    const [checkedSeats, setCheckedSeats] = useState<string[]>([])
    const [addingToCart, setAddingToCart] = useState(false)

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
                <div className="container">
                    {Array.from({ length: venue.rows }, (_, i) => (
                        <div className="d-flex justify-content-center mb-2 gap-2" key={`row-${i}`}>
                            {Array.from({ length: venue.cols }, (_, j) => (
                                <div key={`seat-${i}-${j}`} className={style.seatSelector}>
                                    <input
                                        type="checkbox"
                                        name={`seat-${i + 1}-${j + 1}`}
                                        id={`seat-${i + 1}-${j + 1}`}
                                        onChange={(e) => {
                                            const seatKey = `${i + 1}${j + 1}`
                                            if (e.target.checked) {
                                                setCheckedSeats(prev => [...prev, seatKey])
                                            } else {
                                                setCheckedSeats(prev => prev.filter(s => s !== seatKey))
                                            }
                                        }}
                                    />
                                    <label htmlFor={`seat-${i + 1}-${j + 1}`}>{i + 1}-{j + 1}</label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <Button text="Add to Cart" className="w-100 mt-3" onClick={handleAddToCart} disabled={addingToCart} />
                </div>
            ) : (
                <p className="mb-0">Tickets are not available for this event.</p>
            )}
        </div>
    )
}

export default SeatSelector
