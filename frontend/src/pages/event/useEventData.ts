import { useCallback, useContext, useEffect, useState } from "react"
import { EventContext } from "../../contexts/event/EventContextDef"
import { type IVenueMap, type IEvent, type IOriginalTicket } from "../../utils/interfaces"
import { defaultIVenueMap } from "../../utils/defaults"
import { usePageLoading } from "../../contexts/loading/LoadingContext"

interface IEventGroupResult extends IEvent {
    occurrences?: IEvent[]
}

function normalizeEventSearchResults(results: IEventGroupResult[]): IEvent[] {
    const expandedEvents = results.flatMap((result) => {
        if (Array.isArray(result.occurrences) && result.occurrences.length > 0) {
            return result.occurrences
        }

        return [result]
    })

    const dedupedEventsById = new Map<number, IEvent>()

    for (const expandedEvent of expandedEvents) {
        dedupedEventsById.set(Number(expandedEvent.id), expandedEvent)
    }

    return Array.from(dedupedEventsById.values()).sort((left, right) => left.eventDate - right.eventDate)
}

// Deduplicate simultaneous ticket requests for the same eventId
const inFlightTicketRequests = new Map<string, Promise<IOriginalTicket[]>>()

async function fetchOriginalTickets(eventId: string): Promise<IOriginalTicket[]> {
    const key = eventId.trim()
    const existing = inFlightTicketRequests.get(key)
    if (existing) return existing

    const request = fetch(
        `${import.meta.env.VITE_API_BASE_URL}/originalTickets/forSale/${encodeURIComponent(key)}`
    )
        .then(async (response) => {
            const contentType = response.headers.get("content-type") || ""
            if (!response.ok || !contentType.includes("application/json")) {
                console.error(`Failed to fetch tickets for event ${key}`, {
                    status: response.status,
                    statusText: response.statusText,
                    contentType,
                })
                return []
            }

            const json = await response.json()
            return json.data ?? json
        })
        .finally(() => {
            inFlightTicketRequests.delete(key)
        })

    inFlightTicketRequests.set(key, request)
    return request
}

function filterActiveTicketsForEvent(tickets: IOriginalTicket[], eventId: string): IOriginalTicket[] {
    const targetEventId = Number(eventId)
    if (!Number.isFinite(targetEventId)) {
        return []
    }

    return tickets.filter(
        (ticket) => String(ticket.status) === "active" && Number(ticket.eventId) === targetEventId
    )
}

export function useEventData(eventId: string) {
    const { event, getEvent } = useContext(EventContext)
    const [events, setEvents] = useState<IEvent[]>([])
    const [venue, setVenue] = useState<IVenueMap>(defaultIVenueMap)
    const [dbTickets, setDbTickets] = useState<IOriginalTicket[]>([])
    const trackPageLoading = usePageLoading()


    useEffect(() => {
        let cancelled = false

        if (!eventId) {
            return () => {
                cancelled = true
            }
        }

        const loadPageDataPromise = (async () => {
            const [eventData, tickets] = await Promise.all([
                getEvent(eventId),
                fetchOriginalTickets(eventId),
            ])

            if (cancelled) {
                return
            }

            setDbTickets(filterActiveTicketsForEvent(tickets, eventId))

            const fetchSubEventsPromise = (async () => {
                if (!eventData?.name) {
                    if (!cancelled) {
                        setEvents([])
                    }
                    return
                }

                const eventNameQuery = encodeURIComponent(eventData.name)
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/search?name=${eventNameQuery}`)
                const contentType = response.headers.get("content-type") || ""
                if (!response.ok || !contentType.includes("application/json")) {
                    console.error("Unexpected response when fetching sub-events", {
                        status: response.status,
                        contentType,
                    })
                    if (!cancelled) {
                        setEvents([])
                    }
                    return
                }

                const json = await response.json()
                if (!cancelled) {
                    const groupedResults = Array.isArray(json.data) ? (json.data as IEventGroupResult[]) : []
                    setEvents(normalizeEventSearchResults(groupedResults))
                }
            })()

            const fetchVenuePromise = (async () => {
                if (!eventData?.venue) {
                    if (!cancelled) {
                        setVenue(defaultIVenueMap)
                    }
                    return
                }

                const venueQuery = encodeURIComponent(eventData.venue)
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venues/search?venue=${venueQuery}`)
                const contentType = response.headers.get("content-type") || ""
                if (!response.ok || !contentType.includes("application/json")) {
                    console.error("Unexpected response when fetching venue", {
                        status: response.status,
                        contentType,
                    })
                    if (!cancelled) {
                        setVenue(defaultIVenueMap)
                    }
                    return
                }

                const json = await response.json()
                if (!cancelled) {
                    const nextVenue = Array.isArray(json.data) ? (json.data[0] as IVenueMap | undefined) : undefined
                    setVenue(nextVenue ?? defaultIVenueMap)
                }
            })()

            await Promise.all([fetchSubEventsPromise, fetchVenuePromise])
        })().catch((error) => {
            console.error(error)
        })

        void trackPageLoading(loadPageDataPromise)

        return () => {
            cancelled = true
        }
    }, [eventId, getEvent, trackPageLoading])


    const refreshTickets = useCallback(async () => {
        if (!eventId) return
        const tickets = await fetchOriginalTickets(eventId)
        setDbTickets(filterActiveTicketsForEvent(tickets, eventId))
    }, [eventId])

    return { event, events, venue, dbTickets, refreshTickets }
}
