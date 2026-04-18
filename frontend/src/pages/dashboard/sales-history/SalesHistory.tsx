import { LuCalendar, LuMapPin, LuTag, LuTicket, LuBadgePercent, LuBanknote } from "react-icons/lu";
import styles from "./SalesHistory.module.css";
import Button from "../../../components/ui/button/Button";
import { useEffect, useState } from "react";
import { formatUnixDateTime } from "../../../utils/dateTime";
import { apiFetch } from "../../../lib/apiFetch";

interface ISalesHistory {
    balance: number;
    eventName: string;
    eventDate: number | string;
    venue: string;
    section: string;
    row: number;
    seat: string;
    salePrice: number;
    platformFee: number;
};

interface ISalesSummary {
    balance: number;
    totalEarned: number;
}

const SalesHistory = () => {
    const [history, setHistory] = useState<ISalesHistory[]>([]);
    const [salesSummary, setSalesSummary] = useState<ISalesSummary>({ balance: 0, totalEarned: 0 });

    async function fetchSalesHistory() {
        try {
            const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/ticketHistory/myHistory`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch sales history");
            }

            const contentType = response.headers.get("content-type") ?? "";
            if (!contentType.includes("application/json")) {
                const raw = await response.text();
                throw new Error(`Expected JSON but received ${contentType || "unknown content type"}. Response starts with: ${raw.slice(0, 80)}`);
            }

            const data = await response.json();
            setHistory(data.history);
            setSalesSummary(data.salesSummary);
        } catch (error) {
            console.error("Error fetching sales history:", error);
        }
    }
    useEffect(() => {
        fetchSalesHistory();
    }, []);

    return (
        <div className={`container-fluid mt-4 ${styles.ticketsContainer}`}>
            <div className={styles.headerSection}>
                <h1>Sales History</h1>
                <div>
                    <Button text="Payout" link="/dashboard/payout" />
                </div>
            </div>

            <section className={styles.balanceCard} aria-label="Sales balance summary">
                <div className={styles.balanceHeader}>
                    <div>
                        <p className={styles.balanceLabel}>Available Balance</p>
                        <div className={styles.balanceValueRow}>
                            <h2 className={styles.balanceValue}>{salesSummary.balance} Ft</h2>
                            {salesSummary.totalEarned - salesSummary.balance > 0 && (
                                <span className={styles.balanceBadge}>(+{salesSummary.totalEarned - salesSummary.balance} Ft) pending</span>
                            )}
                        </div>
                        <p className={styles.balanceNote}>Pending clears after the event date passes.</p>
                    </div>
                </div>

                <div className={styles.balanceDivider} />

                <div className={styles.balanceStats}>
                    <div className={styles.balanceStat}>
                        <span className={styles.balanceStatLabel}>Total Earned</span>
                        <strong className={styles.balanceStatValue}>{salesSummary.totalEarned} Ft</strong>
                    </div>
                    <div className={styles.balanceStat}>
                        <span className={styles.balanceStatLabel}>Pending</span>
                        {salesSummary.totalEarned - salesSummary.balance === 0 && (
                            <strong className={styles.balanceStatValue}> - </strong>
                        )}
                        {salesSummary.totalEarned - salesSummary.balance > 0 && (
                            <strong className={styles.balanceStatValue}>{salesSummary.totalEarned - salesSummary.balance} Ft</strong>
                        )}
                    </div>
                </div>
            </section>

            <div className={`table-responsive ${styles.tableWrapper}`}>
                <table className={`table ${styles.table}`}>
                    <thead>
                        <tr>
                            <th>
                                <LuTag size={16} className="me-2" />
                                Event
                            </th>
                            <th>
                                <LuCalendar size={16} className="me-2" />
                                Date
                            </th>
                            <th>
                                <LuMapPin size={16} className="me-2" />
                                Venue
                            </th>
                            <th>
                                <LuTicket size={16} className="me-2" />
                                Seat
                            </th>
                            <th className="text-center">
                                <LuTag size={16} className="me-2" />
                                Sale Price
                            </th>
                            <th className="text-center">
                                <LuBadgePercent size={16} className="me-2" />
                                Platform Fee
                            </th>
                            <th className="text-center">
                                <LuBanknote size={16} className="me-2" />
                                Net Earnings
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4">
                                    No tickets found
                                </td>
                            </tr>
                        ) : (
                            history.map((sale, index) => (
                                <tr key={index}>
                                    <td>{sale.eventName}</td>
                                    <td>{formatUnixDateTime(sale.eventDate)}</td>
                                    <td>{sale.venue}</td>
                                    <td>{`${sale.section} - Row ${sale.row} Seat ${sale.seat}`}</td>
                                    <td className="text-center">{sale.salePrice} Ft</td>
                                    <td className="text-center">{sale.platformFee} Ft</td>
                                    <td className="text-center">{sale.salePrice - sale.platformFee} Ft</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesHistory;