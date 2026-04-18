
import { useEffect, useState } from "react";
import type { IEvent } from "../../utils/interfaces";
import Select from "../../components/ui/select/Select";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import Notification from "../../components/ui/notification/Notification";
import styles from "./Validate.module.css";
import { useAuth } from "../../contexts/auth/useAuth";
import { apiFetch } from "../../lib/apiFetch";
import { usePageLoading } from "../../contexts/loading/LoadingContext";

const Validate = () => {
    const { user, status } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [events, setEvents] = useState<IEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
    const [ticketCode, setTicketCode] = useState<string>("");
    const [isValidating, setIsValidating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validationResult, setValidationResult] = useState<string | null>(null);
    const trackPageLoading = usePageLoading();

    useEffect(() => {
        if (status !== "ready") {
            return;
        }

        if (!user || (user.role !== "organizer" && user.role !== "admin")) {
            setIsAuthorized(false);
            return;
        }

        setIsAuthorized(true);
    }, [status, user]);

    useEffect(() => {
        if (!isAuthorized) return;

        const fetchEventsPromise = (async () => {
            try {
                setErrorMessage(null);
                const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setEvents(data);
                } else if (Array.isArray(data?.data)) {
                    setEvents(data.data);
                } else {
                    setEvents([]);
                }
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : "Failed to load events"
                );
                setEvents([]);
            }
        })();

        void trackPageLoading(fetchEventsPromise);
    }, [isAuthorized, trackPageLoading]);

    const handleEventSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEventId(e.target.value);
    };

    const handleApplyEvent = () => {
        if (!selectedEventId) {
            setErrorMessage("Please select an event");
            return;
        }

        const event = events.find((e) => e.id.toString() === selectedEventId);
        if (event) {
            setSelectedEvent(event);
            setTicketCode("");
            setValidationResult(null);
            setErrorMessage(null);
        }
    };

    const handleValidateTicket = async () => {
        if (!ticketCode.trim()) {
            setValidationResult(null);
            setErrorMessage("Please enter a ticket code");
            return;
        }

        if (!selectedEvent) {
            setValidationResult(null);
            setErrorMessage("No event selected");
            return;
        }

        try {
            setErrorMessage(null);
            setValidationResult(null);
            setIsValidating(true);
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await apiFetch(`${apiBaseUrl}/activeTickets/validate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticketListingId: ticketCode,
                    eventId: selectedEvent.id,
                }),
            });

            const contentType = response.headers.get("content-type") ?? "";
            const data = contentType.includes("application/json") ? await response.json() : null;

            if (!response.ok) {
                const message = data?.error || data?.message || "Ticket validation failed";
                setErrorMessage(message);
                return;
            }

            if (data.success) {
                const ticket = data.originalTicket;
                setValidationResult(`Ticket for seat ${ticket.section} ${ticket.row}-${ticket.seatNumber} is validated!`);
                setTicketCode("");
                setSelectedEventId("");
                setSelectedEvent(null);

            } else {
                setValidationResult(null);
                setErrorMessage(data.error || "Ticket validation failed");
            }

        } catch (error) {
            setValidationResult(null);
            setErrorMessage(
                error instanceof Error ? error.message : "Failed to validate ticket"
            );
        } finally {
            setIsValidating(false);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return (
            <div className={styles.accessDeniedContainer}>
                <h1 className={styles.accessDeniedHeading}>Access Denied</h1>
                <p className={styles.accessDeniedMessage}>You are not authorized to access this page.</p>
                <p className={styles.accessDeniedMessage}>This page is only accessible to organizers.</p>
                {user && (
                    <div className={styles.accessDeniedRole}>
                        <span className={styles.roleLabel}>Your role: </span>
                        <span className={styles.roleBadge}>{user.role}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Validate Tickets</h1>
            {user && <p className={styles.welcome}>Welcome, {user.name}!</p>}

            {validationResult && (
                <Notification text={validationResult} variant="success" />
            )}
            {errorMessage && (
                <Notification text={errorMessage} variant="error" />
            )}

            {selectedEvent ? (
                <div className={styles.ticketCodeSection}>
                    <h2 className={styles.eventHeading}>{selectedEvent.name}</h2>

                    <div className={styles.ticketCodeInputWrapper}>
                        <Input
                            type="text"
                            name="ticketCode"
                            label="Ticket Code"
                            value={ticketCode}
                            onChange={(e) => setTicketCode(e.target.value)}
                            theme="dark"
                            size="medium"
                        />
                    </div>

                    <div className={styles.buttonWrapper}>
                        <Button
                            type="button"
                            text={isValidating ? "Validating..." : "Validate"}
                            onClick={handleValidateTicket}
                            disabled={!ticketCode.trim() || isValidating}
                        />
                    </div>
                </div>
            ) : events.length > 0 ? (
                <div className={styles.eventSelectorSection}>
                    <label className={styles.eventLabel}>Event</label>
                    <div className={styles.selectorWrapper}>
                        <Select
                            name="events"
                            label="Select an Event"
                            value={selectedEventId}
                            onChange={handleEventSelect}
                        >
                            <option value="">-- Choose an Event --</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id.toString()}>
                                    {event.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className={styles.buttonWrapper}>
                        <Button
                            type="button"
                            text="Apply"
                            onClick={handleApplyEvent}
                            disabled={!selectedEventId}
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <p>No events available.</p>
                </div>
            )}
        </div>
    );
};

export default Validate;