import { useContext, useEffect, useMemo, useState } from "react"
import { CartContext } from "../../contexts/cart/CartContextDef"
import { type IVenueMap, type IOriginalTicket, type ITicketForsale } from "../../utils/interfaces"
import Button from "../../components/ui/button/Button"
import style from "./Event.module.css"

interface SeatSelectorProps {
    venue: IVenueMap
    eventId: number
    loading: boolean
    dbTickets: IOriginalTicket[]
    onReload: () => Promise<void>
}

const seatKey = (eventId: number, row: number, col: number) => `${eventId}-${row}-${col}`

type SeatFeedback = {
    type: "loading" | "success"
    message: string
}

const SeatSelector = ({ venue, eventId, loading, dbTickets, onReload }: SeatSelectorProps) => {
    const { addToCart, removeFromCart, tickets: cartTickets } = useContext(CartContext)
    const [busySeat, setBusySeat] = useState<string | null>(null)
    const [zoom, setZoom] = useState(1)
    const [isReloading, setIsReloading] = useState(false)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [seatFeedback, setSeatFeedback] = useState<SeatFeedback | null>(null)
    const isSeatActionLoading = isReloading || busySeat !== null

    useEffect(() => {
        let isActive = true
        setStatusMessage(null)
        setIsReloading(true)

        void onReload().finally(() => {
            if (isActive) {
                setIsReloading(false)
            }
        })

        return () => {
            isActive = false
        }
    }, [eventId, onReload])

    const availableSeats = useMemo(() => {
        const set = new Set<string>()

        for (const t of dbTickets) {
            if (t.eventId !== eventId) {
                continue
            }
            set.add(seatKey(t.eventId, t.row, t.seatNumber))
        }
        return set
    }, [dbTickets, eventId])

    const cartSeatMap = useMemo(() => {
        const map = new Map<string, ITicketForsale>()
        for (const t of cartTickets) {
            if (t.row != null && t.col != null) {
                map.set(seatKey(t.eventId, t.row, t.col), t)
            }
        }
        return map
    }, [cartTickets])

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

    const handleSeatToggle = async (row: number, col: number, checked: boolean) => {
        if (busySeat !== null) {
            return
        }

        const key = seatKey(eventId, row, col)
        const selectedSeatCount = cartTickets.filter((ticket) => ticket.eventId === eventId).length
        const nextSelectedSeatCount = checked && !cartSeatMap.has(key)
            ? selectedSeatCount + 1
            : selectedSeatCount

        setBusySeat(key)
        setStatusMessage(null)
        setSeatFeedback({
            type: "loading",
            message: checked
                ? `Securing ${nextSelectedSeatCount} ${nextSelectedSeatCount === 1 ? "seat" : "seats"}... (Seat ${row}-${col})`
                : `Releasing seat ${row}-${col}...`,
        })

        try {
            if (checked) {
                const success = await addToCart(eventId, row, col)
                if (!success) {
                    setStatusMessage(`Seat ${row}-${col} is no longer available.`)
                    setSeatFeedback(null)
                    return
                }
                await onReload()
                const reservedCount = nextSelectedSeatCount
                setSeatFeedback({
                    type: "success",
                    message: `✓ ${reservedCount === 1 ? "Seat reserved" : `${reservedCount} seats reserved`}!`,
                })
            } else {
                const cartTicket = cartSeatMap.get(key)
                if (cartTicket) {
                    await removeFromCart(cartTicket)
                    await onReload()
                    setSeatFeedback({
                        type: "success",
                        message: `✓ Seat ${row}-${col} released.`,
                    })
                }
            }
        } finally {
            setBusySeat(null)
        }
    }

    useEffect(() => {
        if (!seatFeedback || seatFeedback.type !== "success") {
            return
        }

        const timeoutId = window.setTimeout(() => {
            setSeatFeedback((current) => (current?.type === "success" ? null : current))
        }, 1400)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [seatFeedback])

    return (
        <div className={`${style.backgroundColorSecondary} p-4 mt-3`}>
            <h2 className="fw-bold mb-3 lh-1">Tickets</h2>
            {statusMessage && (
                <div className="alert alert-warning alert-dismissible fade show py-2" role="alert">
                    {statusMessage}
                    <button type="button" className="btn-close" onClick={() => setStatusMessage(null)} aria-label="Close"></button>
                </div>
            )}
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
                    <div className={style.seatGridShell}>
                        <div
                            className={`${style.seatGridContainer} ${isSeatActionLoading ? style.seatGridLocked : ""}`}
                            style={{ '--seat-zoom': zoom } as React.CSSProperties}
                        >
                            {Array.from({ length: venue.rows }, (_, i) => (
                                <div className={style.seatRow} key={`row-${i}`}>
                                    {Array.from({ length: venue.cols }, (_, j) => {
                                        const row = i + 1
                                        const col = j + 1
                                        const key = seatKey(eventId, row, col)
                                        const inCart = cartSeatMap.has(key)
                                        const available = availableSeats.has(key) || inCart
                                        const isBusy = busySeat === key

                                        return (
                                            <div
                                                key={key}
                                                className={`${style.seatSelector} ${!available ? style.seatUnavailable : ""} ${(inCart || isBusy) ? style.seatPriority : ""}`}
                                                title={available ? "Click to select" : "Seat not available"}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name={`seat-${key}`}
                                                    id={`seat-${key}`}
                                                    checked={inCart}
                                                    disabled={!available || isBusy || isSeatActionLoading}
                                                    onChange={(e) => {
                                                        handleSeatToggle(row, col, e.target.checked)
                                                    }}
                                                />
                                                <label htmlFor={`seat-${key}`}>{row}-{col}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>

                        {isSeatActionLoading ? (
                            <div className={style.seatGridOverlay} aria-live="polite" aria-busy="true">
                            </div>
                        ) : null}

                        {seatFeedback ? (
                            <div className={`${style.seatStatusToast} ${seatFeedback.type === "success" ? style.seatStatusToastSuccess : ""}`} aria-live="polite">
                                {seatFeedback.type === "loading" ? (
                                    <div className={style.seatStatusDots} aria-hidden="true">
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                ) : null}
                                <p>{seatFeedback.message}</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : (
                <p className="mb-0">Tickets are not available for this event.</p>
            )}
        </div>
    )
}

export default SeatSelector
