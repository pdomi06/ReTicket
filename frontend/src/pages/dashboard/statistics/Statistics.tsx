import { useEffect, useMemo, useState, type ComponentType } from "react";
import { LuCalendarClock, LuCircleCheck, LuCircleOff, LuCircleX, LuEye } from "react-icons/lu";
import { apiFetch } from "../../../lib/apiFetch";
import { usePageLoading } from "../../../contexts/loading/LoadingContext";
import styles from "./Statistics.module.css";

type EventStatusKey = "pre-release" | "active" | "expired" | "cancelled";

interface IMyEventStatisticsResponse {
    success: boolean;
    data?: {
        totalEvents?: number;
        totalViews?: number;
        eventStatusCounts?: Partial<Record<EventStatusKey, number>>;
        topViewedEvents?: Array<{
            name?: string;
            groupKey?: string;
            views?: number;
            eventCount?: number;
        }>;
    };
}

interface IStatusCard {
    key: EventStatusKey;
    label: string;
    value: number;
    Icon: ComponentType<{ size?: string | number }>;
}

const DEFAULT_COUNTS: Record<EventStatusKey, number> = {
    "pre-release": 0,
    active: 0,
    expired: 0,
    cancelled: 0,
};

const Statistics = () => {
    const [counts, setCounts] = useState<Record<EventStatusKey, number>>(DEFAULT_COUNTS);
    const [totalEvents, setTotalEvents] = useState<number>(0);
    const [totalViews, setTotalViews] = useState<number>(0);
    const [topViewedEvents, setTopViewedEvents] = useState<Array<{ name: string; views: number; eventCount: number }>>([]);
    const trackPageLoading = usePageLoading();

    useEffect(() => {
        const fetchStatisticsPromise = (async () => {
            try {
                const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/events/statistics/my`);
                if (!response.ok) {
                    throw new Error("Failed to fetch statistics");
                }

                const payload = (await response.json()) as IMyEventStatisticsResponse;
                const responseCounts = payload?.data?.eventStatusCounts ?? {};
                const responseTopViewedEvents = payload?.data?.topViewedEvents ?? [];

                setCounts({
                    "pre-release": Number(responseCounts["pre-release"] ?? 0),
                    active: Number(responseCounts.active ?? 0),
                    expired: Number(responseCounts.expired ?? 0),
                    cancelled: Number(responseCounts.cancelled ?? 0),
                });
                setTotalEvents(Number(payload?.data?.totalEvents ?? 0));
                setTotalViews(Number(payload?.data?.totalViews ?? 0));
                setTopViewedEvents(
                    responseTopViewedEvents.map((event) => ({
                        name: String(event.name ?? "Untitled event"),
                        views: Number(event.views ?? 0),
                        eventCount: Number(event.eventCount ?? 0),
                    }))
                );
            } catch (error) {
                console.error("Error fetching event statistics:", error);
                setCounts(DEFAULT_COUNTS);
                setTotalEvents(0);
                setTotalViews(0);
                setTopViewedEvents([]);
            }
        })();

        void trackPageLoading(fetchStatisticsPromise);
    }, [trackPageLoading]);

    const cards = useMemo<IStatusCard[]>(() => {
        return [
            {
                key: "pre-release",
                label: "Pre-release",
                value: counts["pre-release"],
                Icon: LuCalendarClock,
            },
            {
                key: "active",
                label: "Active",
                value: counts.active,
                Icon: LuCircleCheck,
            },
            {
                key: "expired",
                label: "Expired",
                value: counts.expired,
                Icon: LuCircleOff,
            },
            {
                key: "cancelled",
                label: "Cancelled",
                value: counts.cancelled,
                Icon: LuCircleX,
            },
        ];
    }, [counts]);

    return (
        <div className={`container-fluid mt-4 ${styles.statisticsContainer}`}>
            <div className={styles.headerSection}>
                <h1>Statistics</h1>
                <p>Status and view distribution for your own events.</p>
            </div>

            <div className={styles.cardsGrid}>
                {cards.map(({ key, label, value, Icon }) => (
                    <article key={key} className={styles.statusCard} aria-label={`${label} events`}>
                        <div className={styles.cardHeader}>
                            <span className={styles.label}>{label}</span>
                            <span className={styles.iconWrap}>
                                <Icon size={18} />
                            </span>
                        </div>
                        <p className={styles.value}>{value}</p>
                        <p className={styles.meta}>events</p>
                    </article>
                ))}
            </div>

            <section className={styles.summaryCard} aria-label="Total events summary">
                <p className={styles.summaryTitle}>Total own events</p>
                <p className={styles.summaryValue}>{totalEvents}</p>
            </section>

            <section className={styles.summaryCard} aria-label="Total views summary">
                <div className={styles.summaryHeaderRow}>
                    <p className={styles.summaryTitle}>Total views</p>
                    <span className={styles.summaryIconWrap}>
                        <LuEye size={16} />
                    </span>
                </div>
                <p className={styles.summaryValue}>{totalViews}</p>
            </section>

            <section className={styles.topEventsCard} aria-label="Top viewed events">
                <div className={styles.topEventsHeader}>
                    <div>
                        <p className={styles.topEventsTitle}>Top 3 events by views</p>
                        <p className={styles.topEventsSubtitle}>Grouped by event name across all sub-events.</p>
                    </div>
                </div>

                {topViewedEvents.length === 0 ? (
                    <p className={styles.emptyState}>No view data available yet.</p>
                ) : (
                    <ol className={styles.topEventsList}>
                        {topViewedEvents.map((event, index) => (
                            <li key={`${event.name}-${index}`} className={styles.topEventItem}>
                                <div>
                                    <p className={styles.topEventName}>{event.name}</p>
                                    <p className={styles.topEventMeta}>{event.eventCount} Date{event.eventCount === 1 ? "" : "s"}</p>
                                </div>
                                <div className={styles.topEventViewsWrap}>
                                    <span className={styles.topEventRank}>#{index + 1}</span>
                                    <strong className={styles.topEventViews}>{event.views}</strong>
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
            </section>
        </div>
    );
};

export default Statistics;
