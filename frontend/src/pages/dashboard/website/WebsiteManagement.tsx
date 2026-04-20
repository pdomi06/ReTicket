import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LuChevronDown, LuSearch, LuStar, LuX } from "react-icons/lu";
import type { IEvent } from "../../../utils/interfaces";
import styles from "./WebsiteManagement.module.css";
import { apiFetch } from "../../../lib/apiFetch";
import { usePageLoading } from "../../../contexts/loading/LoadingContext";
import Input from "../../../components/ui/input/Input";
import Button from "../../../components/ui/button/Button";
import { formatUnixDateTime } from "../../../utils/dateTime";

const categoryClassMap: Record<string, string> = {
    cultural: styles.categoryCultural,
    music: styles.categoryMusic,
    sport: styles.categorySport,
};

const getInitials = (value: string) => {
    const parts = value.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "E";
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "E";
};

const WebsiteManagement = () => {
    const trackPageLoading = usePageLoading();
    const [events, setEvents] = useState<IEvent[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [updatingEventId, setUpdatingEventId] = useState<number | null>(null);
    const [isFeaturedSectionOpen, setIsFeaturedSectionOpen] = useState(true);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    useEffect(() => {
        const loadEventsPromise = (async () => {
            try {
                const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/events`);
                if (!response.ok) throw new Error("Failed to fetch events");

                const payload = await response.json();
                const parsedEvents = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.data)
                        ? payload.data
                        : [];

                setEvents(parsedEvents);
            } catch (error) {
                console.error("Error fetching events for website management:", error);
            }
        })();

        void trackPageLoading(loadEventsPromise);
    }, [trackPageLoading]);

    const featuredEvents = useMemo(
        () => events.filter((event) => event.isFeatured).sort((left, right) => left.eventDate - right.eventDate || left.name.localeCompare(right.name)),
        [events],
    );

    const allEvents = useMemo(
        () => events,
        [events],
    );

    const selectorEvents = useMemo(() => {
        const groupedByName = new Map<string, IEvent>();

        const sortedEvents = [...allEvents].sort((left, right) => {
            const nameComparison = left.name.localeCompare(right.name);
            if (nameComparison !== 0) return nameComparison;

            const featuredComparison = Number(left.isFeatured) - Number(right.isFeatured);
            if (featuredComparison !== 0) return featuredComparison;

            return left.eventDate - right.eventDate || left.id - right.id;
        });

        sortedEvents.forEach((event) => {
            const nameKey = event.name.trim().toLowerCase();
            const currentEvent = groupedByName.get(nameKey);

            if (!currentEvent) {
                groupedByName.set(nameKey, event);
                return;
            }

            if (currentEvent.isFeatured && !event.isFeatured) {
                groupedByName.set(nameKey, event);
                return;
            }

            if (currentEvent.isFeatured === event.isFeatured && event.eventDate < currentEvent.eventDate) {
                groupedByName.set(nameKey, event);
            }
        });

        return Array.from(groupedByName.values());
    }, [allEvents]);

    const availableToFeature = useMemo(
        () => selectorEvents.filter((event) => !event.isFeatured),
        [selectorEvents],
    );

    const filteredAvailableEvents = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return selectorEvents.filter((event) => {
            if (!query) return true;

            return [event.name, event.venue, event.city, event.country, event.category]
                .some((value) => String(value ?? "").toLowerCase().includes(query));
        });
    }, [selectorEvents, searchQuery]);

    const selectedEvent = useMemo(
        () => selectorEvents.find((event) => event.id === selectedEventId) ?? null,
        [selectorEvents, selectedEventId],
    );

    const handleFeaturedToggle = async (eventId: number, isFeatured: boolean) => {
        setUpdatingEventId(eventId);

        try {
            const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFeatured }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to update featured status");
            }

            setEvents((previousEvents) => previousEvents.map((event) => (
                event.id === eventId ? { ...event, isFeatured } : event
            )));

            if (!isFeatured) {
                setSelectedEventId((currentSelectedId) => (currentSelectedId === eventId ? null : currentSelectedId));
                setSearchQuery((currentQuery) => {
                    const currentSelected = selectedEvent?.id === eventId;
                    return currentSelected ? "" : currentQuery;
                });
            }
        } catch (error) {
            console.error("Error updating featured event:", error);
            alert(error instanceof Error ? error.message : "Failed to update featured status");
        } finally {
            setUpdatingEventId(null);
        }
    };

    const handleSelectEvent = (event: IEvent) => {
        setSelectedEventId(event.id);
        setSearchQuery(event.name);
        setIsSelectorOpen(false);
    };

    const handleAddFeaturedEvent = async () => {
        if (!selectedEvent || selectedEvent.isFeatured) return;
        await handleFeaturedToggle(selectedEvent.id, true);
        setSelectedEventId(null);
        setSearchQuery("");
        setIsSelectorOpen(false);
    };

    const handleClearSelector = () => {
        setSearchQuery("");
        setSelectedEventId(null);
        setIsSelectorOpen(false);
    };

    const renderEventThumb = (event: IEvent): ReactNode => {
        if (event.imageUrl) {
            return <img src={event.imageUrl} alt={event.name} className={styles.thumbnail} />;
        }

        return <div className={styles.avatar}>{getInitials(event.name)}</div>;
    };

    return (
        <div className={styles.websiteContainer}>
            <div className={styles.headerSection}>
                <div>
                    <h1>Website Management</h1>
                    <p className={styles.subtitle}>Control what appears on the public site</p>
                </div>
            </div>

            <section className={styles.section}>
                <button
                    type="button"
                    className={`${styles.sectionHeader} ${isFeaturedSectionOpen ? styles.sectionHeaderOpen : ""}`}
                    onClick={() => setIsFeaturedSectionOpen((value) => !value)}
                    aria-expanded={isFeaturedSectionOpen}
                >
                    <div className={styles.sectionHeaderLeft}>
                        <LuStar className={styles.sectionIcon} />
                        <div>
                            <div className={styles.sectionTitle}>Featured Events</div>
                            <div className={styles.sectionSubtitle}>Events shown on the landing page carousel</div>
                        </div>
                    </div>
                    <LuChevronDown className={`${styles.chevron} ${isFeaturedSectionOpen ? styles.chevronOpen : ""}`} />
                </button>

                <div className={`${styles.sectionBody} ${isFeaturedSectionOpen ? styles.sectionBodyOpen : styles.sectionBodyClosed}`}>
                    <div className={styles.chipRow}>
                        <span className={styles.chipAccent}>Featured: {featuredEvents.length}</span>
                        <span className={styles.chipMuted}>Total Events: {allEvents.length}</span>
                        <span className={styles.chipSubtle}>Available to Feature: {availableToFeature.length}</span>
                    </div>

                    <div className={styles.panelHeaderRow}>
                        <div className={styles.panelHeaderLabel}>Currently Featured</div>
                        <span className={styles.countBadge}>{featuredEvents.length}</span>
                    </div>

                    {featuredEvents.length === 0 ? (
                        <div className={styles.emptyFeaturedState}>
                            <LuStar className={styles.emptyIcon} />
                            <div className={styles.emptyTitle}>No featured events yet</div>
                            <div className={styles.emptySubtitle}>Add events from the list below</div>
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Venue</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {featuredEvents.map((event) => (
                                        <tr key={event.id}>
                                            <td>
                                                <div className={styles.eventCell}>
                                                    {renderEventThumb(event)}
                                                    <div className={styles.eventCopy}>
                                                        <div className={styles.eventName}>{event.name}</div>
                                                        <div className={styles.eventMetaLine}>
                                                            <span className={`${styles.categoryBadge} ${categoryClassMap[event.category] ?? styles.categoryDefault}`}>
                                                                {event.category}
                                                            </span>
                                                            <span>·</span>
                                                            <span>{formatUnixDateTime(event.eventDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{event.venue}</td>
                                            <td>{event.city}, {event.country}</td>
                                            <td>{formatUnixDateTime(event.eventDate)}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={styles.removeButton}
                                                    onClick={() => handleFeaturedToggle(event.id, false)}
                                                    disabled={updatingEventId === event.id}
                                                    aria-label={`Remove ${event.name} from featured events`}
                                                    title="Remove"
                                                >
                                                    <LuX />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className={styles.sectionDivider} />

                    <div className={styles.panelHeaderLabel}>Add to Carousel</div>

                    <div className={styles.selectorControls}>
                        <div className={styles.searchField}>
                            <Input
                                type="text"
                                label="Search active events..."
                                name="featured-search"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSelectedEventId(null);
                                    setIsSelectorOpen(true);
                                }}
                                onFocus={() => setIsSelectorOpen(true)}
                                theme="dark"
                                size="medium"
                            />
                        </div>
                        <div>
                            <Button
                                text="Add to Featured"
                                onClick={handleAddFeaturedEvent}
                                disabled={!selectedEvent || selectedEvent.isFeatured || updatingEventId === selectedEvent.id}
                            />
                        </div>
                        {searchQuery && (
                            <div>
                                <Button text="Clear" variant="outline" onClick={handleClearSelector} />
                            </div>
                        )}
                    </div>

                    {isSelectorOpen && (
                        <div className={styles.selectorPanel}>
                            {allEvents.length === 0 ? (
                                <div className={styles.selectorEmptyBlock}>
                                    <LuSearch className={styles.selectorEmptyIcon} />
                                    <div>No events exist yet</div>
                                </div>
                            ) : filteredAvailableEvents.length === 0 ? (
                                <div className={styles.selectorEmptyBlock}>
                                    <div>No events match your search</div>
                                </div>
                            ) : (
                                filteredAvailableEvents.map((event) => (
                                    <button
                                        key={event.id}
                                        type="button"
                                        className={`${styles.selectorItem} ${selectedEventId === event.id ? styles.selectorItemSelected : ""}`}
                                        onClick={() => handleSelectEvent(event)}
                                    >
                                        {renderEventThumb(event)}
                                        <div className={styles.selectorCopy}>
                                            <div className={styles.selectorNameRow}>
                                                <strong>{event.name}</strong>
                                                <span>{event.venue}</span>
                                            </div>
                                            <div className={styles.selectorMetaRow}>
                                                <span className={`${styles.categoryBadge} ${categoryClassMap[event.category] ?? styles.categoryDefault}`}>
                                                    {event.category}
                                                </span>
                                                <span>·</span>
                                                <span>{event.city}, {event.country}</span>
                                                <span>·</span>
                                                <span>{formatUnixDateTime(event.eventDate)}</span>
                                                <span>·</span>
                                                <span>{event.isFeatured ? "Featured" : "Not featured"}</span>
                                            </div>
                                        </div>
                                        <span className={styles.selectorAction}>Select</span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {selectedEvent && (
                        <div className={styles.selectedCard}>
                            {renderEventThumb(selectedEvent)}
                            <div className={styles.selectedCopy}>
                                <strong>{selectedEvent.name}</strong>
                                <div>
                                    {selectedEvent.venue} · {selectedEvent.city}, {selectedEvent.country}
                                </div>
                            </div>
                            <div className={styles.selectedMeta}>
                                <span className={`${styles.categoryBadge} ${categoryClassMap[selectedEvent.category] ?? styles.categoryDefault}`}>
                                    {selectedEvent.category}
                                </span>
                                <span>{formatUnixDateTime(selectedEvent.eventDate)}</span>
                                <span>{selectedEvent.isFeatured ? "Already featured" : "Ready to feature"}</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* 
              TODO: Additional Website Management sections go here.
              Each section follows the same collapsible pattern as Featured Events.
              Example: Hero Banner, Announcements, Homepage Categories, etc.
            */}
        </div>
    );
};

export default WebsiteManagement;