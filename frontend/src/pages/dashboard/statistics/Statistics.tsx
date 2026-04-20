import { useEffect, useMemo, useState } from "react";
import { LuEye } from "react-icons/lu";
import { apiFetch } from "../../../lib/apiFetch";
import { usePageLoading } from "../../../contexts/loading/LoadingContext";
import styles from "./Statistics.module.css";

type EventStatusKey = "pre-release" | "active" | "expired" | "cancelled";

type KpiTone = "default" | "success" | "muted" | "danger";

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
        activeEvents?: Array<{
            id: number;
            name: string;
            eventDate: number;
            eventEndDate: number;
            views: number;
            totalTickets: number;
            availableTickets: number;
            soldTickets: number;
            soldPercentage: number;
        }>;
        expiredEvents?: Array<{
            id: number;
            name: string;
            eventDate: number;
            eventEndDate: number;
            views: number;
            soldTickets: number;
            soldPercentage: number;
            revenue: number;
        }>;
    };
}

const DEFAULT_COUNTS: Record<EventStatusKey, number> = {
    "pre-release": 0,
    active: 0,
    expired: 0,
    cancelled: 0,
};

const Statistics = () => {
    const [activeTab, setActiveTab] = useState<"active" | "expired">("active");
    const [counts, setCounts] = useState<Record<EventStatusKey, number>>(DEFAULT_COUNTS);
    const [totalEvents, setTotalEvents] = useState<number>(0);
    const [totalViews, setTotalViews] = useState<number>(0);
    const [topViewedEvents, setTopViewedEvents] = useState<Array<{ name: string; views: number; eventCount: number }>>([]);
    const [activeEvents, setActiveEvents] = useState<Array<{ id: number; name: string; eventDate: number; eventEndDate: number; views: number; totalTickets: number; availableTickets: number; soldTickets: number; soldPercentage: number }>>([]);
    const [expiredEvents, setExpiredEvents] = useState<Array<{ id: number; name: string; eventDate: number; eventEndDate: number; views: number; soldTickets: number; soldPercentage: number; revenue: number }>>([]);
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
                const responseActiveEvents = payload?.data?.activeEvents ?? [];
                const responseExpiredEvents = payload?.data?.expiredEvents ?? [];

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
                setActiveEvents(
                    responseActiveEvents.map((event) => ({
                        id: Number(event.id),
                        name: String(event.name ?? "Untitled event"),
                        eventDate: Number(event.eventDate ?? 0),
                        eventEndDate: Number(event.eventEndDate ?? 0),
                        views: Number(event.views ?? 0),
                        totalTickets: Number(event.totalTickets ?? 0),
                        availableTickets: Number(event.availableTickets ?? 0),
                        soldTickets: Number(event.soldTickets ?? 0),
                        soldPercentage: Number(event.soldPercentage ?? 0),
                    }))
                );
                setExpiredEvents(
                    responseExpiredEvents.map((event) => ({
                        id: Number(event.id),
                        name: String(event.name ?? "Untitled event"),
                        eventDate: Number(event.eventDate ?? 0),
                        eventEndDate: Number(event.eventEndDate ?? 0),
                        views: Number(event.views ?? 0),
                        soldTickets: Number(event.soldTickets ?? 0),
                        soldPercentage: Number(event.soldPercentage ?? 0),
                        revenue: Number(event.revenue ?? 0),
                    }))
                );
            } catch (error) {
                console.error("Error fetching event statistics:", error);
                setCounts(DEFAULT_COUNTS);
                setTotalEvents(0);
                setTotalViews(0);
                setTopViewedEvents([]);
                setActiveEvents([]);
                setExpiredEvents([]);
            }
        })();

        void trackPageLoading(fetchStatisticsPromise);
    }, [trackPageLoading]);

    const kpiChips = useMemo(() => {
        return [
            { key: "total-events", label: "Total Events", value: totalEvents, tone: "default" as KpiTone, showViewsIcon: false },
            { key: "active", label: "Active", value: counts.active, tone: "success" as KpiTone, showViewsIcon: false },
            { key: "pre-release", label: "Pre-release", value: counts["pre-release"], tone: "default" as KpiTone, showViewsIcon: false },
            { key: "expired", label: "Expired", value: counts.expired, tone: "muted" as KpiTone, showViewsIcon: false },
            { key: "cancelled", label: "Cancelled", value: counts.cancelled, tone: "danger" as KpiTone, showViewsIcon: false },
            { key: "total-views", label: "Total Views", value: totalViews, tone: "default" as KpiTone, showViewsIcon: true },
        ];
    }, [counts, totalEvents, totalViews]);

    const maxTopViews = useMemo(() => topViewedEvents.reduce((max, event) => Math.max(max, event.views), 0), [topViewedEvents]);

    const formatShortDate = (unixTimestamp: number): string => {
        if (!Number.isFinite(unixTimestamp) || unixTimestamp <= 0) {
            return "Date unavailable";
        }

        return new Date(unixTimestamp * 1000).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getChipValueClass = (value: number, tone: KpiTone): string => {
        if (value === 0) {
            return styles.kpiValueDisabled;
        }

        if (tone === "success") {
            return styles.kpiValueSuccess;
        }

        if (tone === "muted") {
            return styles.kpiValueMuted;
        }

        if (tone === "danger") {
            return styles.kpiValueDanger;
        }

        return styles.kpiValue;
    };

    return (
        <div className={`container-fluid mt-4 ${styles.statisticsContainer}`}>
            <div className={styles.headerSection}>
                <h1>Statistics</h1>
                <p>Status and view distribution for your own events.</p>
            </div>

            <section className={styles.kpiBar} aria-label="Statistics key performance indicators">
                {kpiChips.map((chip) => (
                    <article key={chip.key} className={styles.kpiChip}>
                        <div className={styles.kpiValueRow}>
                            {chip.showViewsIcon && (
                                <span className={styles.kpiEyeIcon}>
                                    <LuEye size={14} />
                                </span>
                            )}
                            <span className={getChipValueClass(chip.value, chip.tone)}>{chip.value}</span>
                        </div>
                        <span className={styles.kpiLabel}>{chip.label}</span>
                    </article>
                ))}
            </section>

            <section className={styles.chartsRow} aria-label="Analytics charts">
                <article className={styles.chartPanel} aria-label="Views by Event">
                    <div className={styles.panelHeader}>
                        <p className={styles.panelTitle}>Views by Event</p>
                        <p className={styles.panelSubtitle}>Grouped by event name across all dates.</p>
                    </div>

                    {topViewedEvents.length === 0 ? (
                        <p className={styles.emptyState}>No view data available yet.</p>
                    ) : (
                        <ol className={styles.viewsChartList}>
                            {topViewedEvents.map((event, index) => {
                                const barWidth = maxTopViews > 0 ? Math.max((event.views / maxTopViews) * 100, 0) : 0;

                                return (
                                    <li key={`${event.name}-${index}`} className={styles.viewsChartItem}>
                                        <div className={styles.viewsHeaderRow}>
                                            <div>
                                                <p className={styles.viewsEventName}>{event.name}</p>
                                                <p className={styles.viewsEventMeta}>{event.eventCount} Date{event.eventCount === 1 ? "" : "s"}</p>
                                            </div>
                                            <div className={styles.viewsRankWrap}>
                                                <span className={styles.rankBadge}>#{index + 1}</span>
                                                <span className={styles.viewsValue}>{event.views}</span>
                                            </div>
                                        </div>

                                        <div className={styles.viewsTrack}>
                                            <div className={styles.viewsFill} style={{ width: `${barWidth}%` }} aria-hidden="true" />
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </article>

                <article className={styles.chartPanel} aria-label="Ticket Sales Overview">
                    <div className={styles.panelHeader}>
                        <p className={styles.panelTitle}>Ticket Sales Overview</p>
                        <p className={styles.panelSubtitle}>Sold ratio and inventory for active events.</p>
                    </div>

                    {activeEvents.length === 0 ? (
                        <p className={styles.emptyState}>No active events found.</p>
                    ) : (
                        <div className={styles.salesOverviewRows}>
                            {activeEvents.map((event) => {
                                const total = event.totalTickets ?? 0;
                                const sold = event.soldTickets ?? 0;
                                const pct = total > 0 ? Math.round((sold / total) * 100) : 0;
                                const R = 18;
                                const circ = 2 * Math.PI * R;
                                const offset = circ * (1 - pct / 100);

                                return (
                                    <div key={event.id} className={styles.salesOverviewCard}>
                                        {/* Arc */}
                                        <div className={styles.salesOverviewArcWrap}>
                                            <svg width="48" height="48" viewBox="0 0 48 48" className={styles.salesOverviewArcSvg}>
                                                <circle cx="24" cy="24" r={R} fill="none" stroke="#2a2a2a" strokeWidth="4" />
                                                <circle
                                                    cx="24" cy="24" r={R}
                                                    fill="none"
                                                    stroke="#e8a020"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    strokeDasharray={circ}
                                                    strokeDashoffset={offset}
                                                    className={styles.salesOverviewArcFill}
                                                />
                                            </svg>
                                            <div className={styles.salesOverviewArcLabel}>
                                                {pct}%
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className={styles.salesOverviewInfo}>
                                            <div className={styles.salesOverviewInfoName}>
                                                {event.name}
                                            </div>
                                            <div className={styles.salesOverviewInfoDate}>
                                                {formatShortDate(event.eventDate)}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className={styles.salesOverviewStats}>
                                            {[["Total", total], ["Available", total - sold], ["Sold", sold]].map(([label, val]) => (
                                                <div key={label} className={styles.salesOverviewStat}>
                                                    <div className={styles.salesOverviewStatLabel}>
                                                        {label}
                                                    </div>
                                                    <div className={styles.salesOverviewStatValue}>
                                                        {val}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </article>
            </section>

            <section className={styles.eventsSection} aria-label="Events tables">
                <div className={styles.tabsBar} role="tablist" aria-label="Events tabs">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "active"}
                        className={`${styles.tabButton} ${activeTab === "active" ? styles.tabButtonActive : ""}`}
                        onClick={() => setActiveTab("active")}
                    >
                        Active Events
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === "expired"}
                        className={`${styles.tabButton} ${activeTab === "expired" ? styles.tabButtonActive : ""}`}
                        onClick={() => setActiveTab("expired")}
                    >
                        Expired Events
                    </button>
                </div>

                {activeTab === "active" ? (
                    activeEvents.length === 0 ? (
                        <p className={styles.emptyState}>No active events found.</p>
                    ) : (
                        <div className={styles.eventRows}>
                            {activeEvents.map((event) => (
                                <div key={event.id} className={styles.eventRowCard}>
                                    <div className={styles.eventRowCardLeft}>
                                        <div className={styles.eventRowCardName}>
                                            {event.name}
                                        </div>
                                        <div className={styles.eventRowCardMeta}>
                                            {formatShortDate(event.eventDate)} · Total {event.totalTickets} · Available {event.availableTickets} · Sold {event.soldTickets}
                                        </div>
                                    </div>

                                    <div className={styles.eventRowCardSoldBadge}>
                                        {Number(event.soldPercentage ?? 0).toFixed(1)}% sold
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    expiredEvents.length === 0 ? (
                        <p className={styles.emptyState}>No expired events found.</p>
                    ) : (
                        <div className={styles.eventRows}>
                            {expiredEvents.map((event) => (
                                <div key={event.id} className={styles.eventRowCard}>
                                    <div className={styles.eventRowCardLeft}>
                                        <div className={styles.eventRowCardName}>
                                            {event.name}
                                        </div>
                                        <div className={styles.eventRowCardMeta}>
                                            {formatShortDate(event.eventDate)} · {Number(event.soldPercentage ?? 0).toFixed(1)}% sold
                                        </div>
                                    </div>

                                    <div className={styles.eventRowCardRight}>
                                        <div className={styles.eventRowCardRevenue}>
                                            {Number(event.revenue ?? 0).toFixed(2)} Ft
                                        </div>
                                        <div className={styles.eventRowCardSoldCount}>
                                            {event.soldTickets} sold
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </section>
        </div>
    );
};

export default Statistics;
