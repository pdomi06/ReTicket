import { useEffect, useMemo, useState } from "react";
import type { ITicketHistory } from "../../../utils/interfaces";
import styles from "./TicketHistory.module.css";
import { apiFetch } from "../../../lib/apiFetch";
import { usePageLoading } from "../../../contexts/loading/LoadingContext";
import Input from "../../../components/ui/input/Input";
import Button from "../../../components/ui/button/Button";
import Select from "../../../components/ui/select/Select";

const TicketHistory = () => {
    const trackPageLoading = usePageLoading();
    const [histories, setHistories] = useState<ITicketHistory[]>([]);
    const [filters, setFilters] = useState({
        query: "",
        isResell: "",
    });

    useEffect(() => {
        const loadHistoryPromise = (async () => {
            try {
                const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/ticketHistory`);
                if (!response.ok) throw new Error("Failed to fetch ticket history");

                const payload = await response.json();
                const parsedHistories = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.data)
                        ? payload.data
                        : [];

                setHistories(parsedHistories);
            } catch (error) {
                console.error("Error fetching ticket history:", error);
            }
        })();

        void trackPageLoading(loadHistoryPromise);
    }, [trackPageLoading]);

    const filteredHistories = useMemo(() => {
        return histories.filter((history) => {
            const query = filters.query.trim().toLowerCase();
            const queryMatches =
                !query ||
                String(history.id).toLowerCase().includes(query) ||
                String(history.originalTicketId).toLowerCase().includes(query) ||
                history.ticketListingId.toLowerCase().includes(query) ||
                String(history.fromUserId ?? "").toLowerCase().includes(query) ||
                history.toUser.toLowerCase().includes(query) ||
                String(history.price).toLowerCase().includes(query) ||
                String(history.platformFee).toLowerCase().includes(query);

            const resellMatches =
                !filters.isResell ||
                (filters.isResell === "yes" && history.isResell) ||
                (filters.isResell === "no" && !history.isResell);

            return queryMatches && resellMatches;
        });
    }, [histories, filters]);

    const isFiltered = filters.query || filters.isResell;

    const handleClearFilters = () => {
        setFilters({ query: "", isResell: "" });
    };

    return (
        <div className={styles.historyContainer}>
            <div className={styles.headerSection}>
                <div>
                    <h1>Ticket History</h1>
                    <p className={styles.subtitle}>View and search every ticket history record in the system.</p>
                </div>
            </div>

            <div className={styles.filtersSection}>
                <div className={styles.filterGroup}>
                    <div className={styles.searchField}>
                        <Input
                            type="text"
                            label="Search history"
                            name="query"
                            value={filters.query}
                            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                            theme="dark"
                            size="medium"
                        />
                    </div>

                    <div className={styles.selectField}>
                        <Select
                            label="Resell"
                            name="resell-filter"
                            value={filters.isResell}
                            onChange={(e) => setFilters((prev) => ({ ...prev, isResell: e.target.value }))}
                            theme="dark"
                            size="medium"
                        >
                            <option value="" disabled aria-hidden="true">Resell</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Select>
                    </div>

                    {isFiltered && (
                        <div>
                            <Button text="Clear" variant="outline" onClick={handleClearFilters} />
                        </div>
                    )}
                </div>
                <p className={styles.resultCount}>
                    Showing {filteredHistories.length} of {histories.length} histories
                </p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Original Ticket ID</th>
                            <th>Ticket Listing ID</th>
                            <th>From User ID</th>
                            <th>To User</th>
                            <th>Price</th>
                            <th>Platform Fee</th>
                            <th>Is Resell</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHistories.length === 0 ? (
                            <tr>
                                <td colSpan={8} className={styles.emptyState}>
                                    {histories.length === 0 ? "No ticket history found" : "No history matches your filters"}
                                </td>
                            </tr>
                        ) : (
                            filteredHistories.map((history) => (
                                <tr key={history.id}>
                                    <td className={styles.mono}>{history.id}</td>
                                    <td>{history.originalTicketId}</td>
                                    <td className={styles.mono}>{history.ticketListingId}</td>
                                    <td>{history.fromUserId ?? "-"}</td>
                                    <td>{history.toUser}</td>
                                    <td>{history.price} Ft</td>
                                    <td>{history.platformFee} Ft</td>
                                    <td>
                                        <span className={history.isResell ? styles.yesBadge : styles.noBadge}>
                                            {history.isResell ? "Yes" : "No"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketHistory;