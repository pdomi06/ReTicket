import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import type { IEvent } from "../../utils/interfaces";
import Card from "../../components/ui/card/Card";
import Sidebar from "./sidebar/Sidebar";
import { useLocation, useSearchParams } from "react-router";
import styles from "./Browse.module.css";
import { usePageLoading } from "../../contexts/loading/LoadingContext";

interface IBrowseEventGroup extends IEvent {
    occurrenceCount: number;
    occurrences: IEvent[];
}

function appendDistinctEvents(previousEvents: IBrowseEventGroup[], nextEvents: IBrowseEventGroup[]) {
    const seenEvents = new Set(previousEvents.map((event) => event.id));
    const mergedEvents = [...previousEvents];

    for (const event of nextEvents) {
        if (seenEvents.has(event.id)) {
            continue;
        }

        seenEvents.add(event.id);
        mergedEvents.push(event);
    }

    return mergedEvents;
}

interface PaginationInfo {
    limit: number;
    returned_count: number;
    has_more: boolean;
    next_cursor: string | null;
    total_groups?: number;
}

interface SearchEventsResponse {
    data: IBrowseEventGroup[];
    pagination?: PaginationInfo;
}

const Browse = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const queryWithoutCursor = useMemo(() => {
        const params = new URLSearchParams(searchParams);
        params.delete("page");
        params.delete("cursor");
        return params.toString();
    }, [searchParams]);

    const suppressGlobalLoader = Boolean(
        location.state && typeof location.state === "object" && "suppressGlobalLoader" in location.state
            ? (location.state as { suppressGlobalLoader?: boolean }).suppressGlobalLoader
            : false,
    );

    const [events, setEvents] = useState<IBrowseEventGroup[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLocalLoading, setIsLocalLoading] = useState(false);
    const trackPageLoading = usePageLoading();

    const getEvents = useCallback(async (q: string, cursor?: string | null, signal?: AbortSignal) => {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const params = new URLSearchParams(q);
        params.set("limit", "20");

        if (cursor) {
            params.set("cursor", cursor);
        } else {
            params.delete("cursor");
        }

        const queryString = params.toString();
        const url = queryString ? `${apiBaseUrl}/events/search?${queryString}` : `${apiBaseUrl}/events/search`;

        const response = await fetch(url, { signal });
        const contentType = response.headers.get("content-type") || "";

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        if (!contentType.includes("application/json")) {
            throw new Error("API did not return JSON. Check your API base URL and backend server.");
        }

        const json = await response.json();
        const paginationData = json.pagination;

        return {
            data: (json.data ?? []) as IBrowseEventGroup[],
            pagination: paginationData
                ? {
                    limit: Number(paginationData.limit ?? 20),
                    returned_count: Number(paginationData.returned_count ?? 0),
                    has_more: Boolean(paginationData.has_more),
                    next_cursor: paginationData.next_cursor ? String(paginationData.next_cursor) : null,
                    total_groups: paginationData.total_groups ? Number(paginationData.total_groups) : undefined,
                }
                : {
                    limit: 20,
                    returned_count: Number((json.data ?? []).length),
                    has_more: false,
                    next_cursor: null,
                },
        } as SearchEventsResponse;
    }, []);

    useLayoutEffect(() => {
        const controller = new AbortController();
        let isActive = true;
        setError(null);
        setLoadMoreError(null);
        setEvents([]);
        setHasMore(false);
        setNextCursor(null);
        setIsLocalLoading(suppressGlobalLoader);

        const fetchEventsPromise = getEvents(queryWithoutCursor, null, controller.signal)
            .then((response) => {
                setEvents(response.data);
                setHasMore(response.pagination?.has_more ?? false);
                setNextCursor(response.pagination?.next_cursor ?? null);
            })
            .catch((err: unknown) => {
                if (err instanceof DOMException && err.name === "AbortError") return;
                const message = err instanceof Error ? err.message : "Failed to load events";
                setError(message);
                setHasMore(false);
                setNextCursor(null);
            })
            .finally(() => {
                if (isActive) {
                    setIsLocalLoading(false);
                }
            });

        if (suppressGlobalLoader) {
            void fetchEventsPromise;
        } else {
            void trackPageLoading(fetchEventsPromise);
        }

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [getEvents, queryWithoutCursor, suppressGlobalLoader, trackPageLoading]);

    const handleLoadMore = async () => {
        if (!hasMore || !nextCursor || isLoadingMore) {
            return;
        }

        setIsLoadingMore(true);
        setLoadMoreError(null);

        try {
            const response = await getEvents(queryWithoutCursor, nextCursor);
            setEvents((previousEvents) => appendDistinctEvents(previousEvents, response.data));
            setHasMore(response.pagination?.has_more ?? false);
            setNextCursor(response.pagination?.next_cursor ?? null);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to load more events";
            setLoadMoreError(message);
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <main className={`container-fluid ${styles.browsePage}`}>
            <header className={styles.pageHeader}>
                <h1>Browse Events</h1>
                <p>Showing {events.length} events</p>
            </header>

            <div className="row g-3">
                <div className="col-12 col-md-3">
                    <Sidebar isLoading={isLocalLoading} />
                </div>

                <div className="col-12 col-md-9">
                    {error ? (
                        <p>{error}</p>
                    ) : isLocalLoading ? (
                        <p>Loading events...</p>
                    ) : events.length > 0 ? (
                        <>
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                                {events.map((event) => (
                                    <Card
                                        key={event.id}
                                        title={event.name}
                                        description={event.description}
                                        buttonText="View Details"
                                        link={`/event?event=${event.id}`}
                                        imageUrl={event.imageUrl}
                                    />
                                ))}
                            </div>

                            {hasMore ? (
                                <div className={styles.loadMoreContainer}>
                                    <button
                                        type="button"
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className={styles.loadMoreButton}
                                    >
                                        {isLoadingMore ? "Loading..." : "Load More..."}
                                    </button>
                                </div>
                            ) : null}

                            {loadMoreError ? <p className={styles.loadMoreError}>{loadMoreError}</p> : null}
                        </>
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Browse;