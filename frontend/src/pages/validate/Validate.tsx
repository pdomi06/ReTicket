
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IEvent } from "../../utils/interfaces";
import Select from "../../components/ui/select/Select";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import styles from "./Validate.module.css";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    [key: string]: unknown;
}

const Validate = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [events, setEvents] = useState<IEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
    const [ticketCode, setTicketCode] = useState<string>("");
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [validationResult, setValidationResult] = useState<string | null>(null);

    // Check authorization
    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Parse user from localStorage
        let userData: User | null = null;
        try {
            const userString = localStorage.getItem("user");
            userData = userString ? JSON.parse(userString) : null;
        } catch (e) {
            console.error("Failed to parse user from localStorage:", e);
            userData = null;
        }

        // Check if user has organizer or admin role
        if (!userData || (userData.role !== "organizer" && userData.role !== "admin")) {
            setIsAuthorized(false);
            setUser(userData);
            return;
        }

        // User is authorized
        setIsAuthorized(true);
        setUser(userData);
    }, [navigate]);

    // Fetch events when authorized
    useEffect(() => {
        if (!isAuthorized) return;

        async function fetchEvents() {
            try {
                setLoadingEvents(true);
                setErrorMessage(null);
                const token = localStorage.getItem("token");
                const headers: HeadersInit = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
                    headers,
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
                console.error("Error fetching events:", error);
                setErrorMessage(
                    error instanceof Error ? error.message : "Failed to load events"
                );
                setEvents([]);
            } finally {
                setLoadingEvents(false);
            }
        }

        fetchEvents();
    }, [isAuthorized]);

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
            console.log("Selected event:", event);
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
            const token = localStorage.getItem("token");
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${apiBaseUrl}/activeTickets/validate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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
        console.log(user)
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
                <div className={styles.validationResult}>
                    {validationResult}
                </div>
            )}
            {errorMessage && (
                <div className={styles.errorMessage}>
                    {errorMessage}
                </div>
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
            ) : loadingEvents ? (
                <p className={styles.loadingMessage}>Loading events...</p>
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