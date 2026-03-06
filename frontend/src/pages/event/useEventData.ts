import { useContext, useEffect, useState } from "react"
import { EventContext } from "../../contexts/event/EventContextDef"
import { type IVenueMap, type IEvent } from "../../utils/interfaces"
import { defaultIVenueMap } from "../../utils/defaults"

export function useEventData(eventId: string) {
    const { event, getEvent } = useContext(EventContext)
    const [events, setEvents] = useState<IEvent[]>([])
    const [venue, setVenue] = useState<IVenueMap>(defaultIVenueMap)
    const [loadingEvent, setLoadingEvent] = useState(true)
    const [loadingEvents, setLoadingEvents] = useState(true)
    const [loadingVenue, setLoadingVenue] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function fetchEvent() {
            setLoadingEvent(true)
            try {
                await getEvent(eventId)
            } catch (err) {
                console.error(err)
            } finally {
                if (!cancelled) {
                    setLoadingEvent(false)
                }
            }
        }

        if (eventId) {
            void fetchEvent()
        } else {
            setLoadingEvent(false)
            setLoadingEvents(false)
        }

        return () => {
            cancelled = true
        }
    }, [eventId, getEvent])

    useEffect(() => {
        if (!event?.name) {
            return
        }

        let cancelled = false

        async function fetchSubEvents() {
            setLoadingEvents(true)
            try {
                const eventNameQuery = encodeURIComponent(event!.name)
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events/search?name=${eventNameQuery}`)
                const contentType = response.headers.get("content-type") || ""
                if (!response.ok || !contentType.includes("application/json")) {
                    console.error("Unexpected response when fetching sub-events", {
                        status: response.status,
                        contentType,
                    })
                    return
                }
                const json = await response.json()
                if (!cancelled) {
                    setEvents(json.data)
                }
            } catch (err) {
                console.error(err)
            } finally {
                if (!cancelled) {
                    setLoadingEvents(false)
                }
            }
        }

        void fetchSubEvents()

        return () => {
            cancelled = true
        }
    }, [event?.name])

    useEffect(() => {
        if (!event?.venue) {
            setLoadingVenue(false)
            return
        }

        let cancelled = false

        async function fetchVenue() {
            setLoadingVenue(true)
            try {
                const venueQuery = encodeURIComponent(event!.venue)
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/venues/search?venue=${venueQuery}`)
                const contentType = response.headers.get("content-type") || ""
                if (!response.ok || !contentType.includes("application/json")) {
                    console.error("Unexpected response when fetching venue", {
                        status: response.status,
                        contentType,
                    })
                    return
                }
                const json = await response.json()
                if (!cancelled) {
                    setVenue(json.data[0])
                }
            } catch (err) {
                console.error(err)
            } finally {
                if (!cancelled) {
                    setLoadingVenue(false)
                }
            }
        }

        void fetchVenue()

        return () => {
            cancelled = true
        }
    }, [event?.venue])

    return { event, events, venue, loadingEvent, loadingEvents, loadingVenue }
}
