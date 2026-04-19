import { useState } from "react";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import type { IDashboardTicket } from "../../../utils/interfaces";
import { toDateFromUnix } from "../../../utils/dateTime";
import styles from "./ListTicket.module.css";
import { apiFetch } from "../../../lib/apiFetch";

const ListTicket = () => {
    const [ticketCode, setTicketCode] = useState("");
    const [ticketInfo, setTicketInfo] = useState<IDashboardTicket | null>(null);
    const [ticketMessage, setTicketMessage] = useState("");
    const [notificationVariant, setNotificationVariant] = useState<"success" | "error">("success");
    const [resellPrice, setResellPrice] = useState("");
    const [averagePrice, setAveragePrice] = useState<number | null>(null);
    const [isCheckingTicket, setIsCheckingTicket] = useState(false);
    const [isReselling, setIsReselling] = useState(false);

    async function readResponseMessage(response: Response, fallbackMessage: string) {
        const contentType = response.headers.get("content-type") ?? "";

        if (contentType.includes("application/json")) {
            const data = await response.json() as { message?: string; error?: string };
            return data.message ?? data.error ?? fallbackMessage;
        }

        const text = await response.text();
        return text.trim() || fallbackMessage;
    }

    async function handleCheckTicket() {
        try {
            setIsCheckingTicket(true);
            const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/activeTickets/checkTicket`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticketListingId: ticketCode,
                }),
            });
            if (!response.ok) {
                setTicketMessage(await readResponseMessage(response, "Failed to check ticket."));
                setNotificationVariant("error");
                setTicketInfo(null);
                setAveragePrice(null);
                return;
            }
            const contentType = response.headers.get("content-type") ?? "";
            if (!contentType.includes("application/json")) {
                setTicketMessage(await readResponseMessage(response, "Failed to check ticket."));
                setNotificationVariant("error");
                setTicketInfo(null);
                setAveragePrice(null);
                return;
            }

            const data = await response.json();
            if (!data.exists) {
                setTicketMessage(data.message || "Ticket not found");
                setNotificationVariant("error");
                setTicketInfo(null);
                setAveragePrice(null);
                return;
            }
            setTicketMessage(data.message || "Ticket found");
            setNotificationVariant("success");
            setTicketInfo(data.originalTicket);
            const parsedAveragePrice = Number(data.averagePrice);
            setAveragePrice(Number.isFinite(parsedAveragePrice) ? parsedAveragePrice : null);
        } catch (error) {
            setTicketMessage("Failed to check ticket.");
            setNotificationVariant("error");
            console.error("Error checking ticket:", error);
        } finally {
            setIsCheckingTicket(false);
        }
    }

    async function handleResell() {
        if (!ticketInfo) return;

        const parsedResellPrice = Number(resellPrice);
        if (!Number.isFinite(parsedResellPrice) || parsedResellPrice <= 0) {
            setTicketMessage("Please enter a valid resell price greater than 0.");
            setNotificationVariant("error");
            return;
        }

        try {
            setIsReselling(true);
            const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/activeTickets/resell`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticketListingId: ticketCode,
                    price: parsedResellPrice,
                }),
            });
            if (!response.ok) {
                setTicketMessage(await readResponseMessage(response, "Failed to resell ticket."));
                setNotificationVariant("error");
                return;
            }
            const contentType = response.headers.get("content-type") ?? "";
            if (!contentType.includes("application/json")) {
                setTicketMessage(await readResponseMessage(response, "Failed to resell ticket."));
                setNotificationVariant("error");
                return;
            }

            const data = await response.json();
            if (data.success) {
                setTicketMessage("Ticket resold successfully.");
                setNotificationVariant("success");
                setTicketInfo(null);
            } else {
                setTicketMessage(data.error || "Failed to resell ticket.");
                setNotificationVariant("error");
            }
        } catch (error) {
            setTicketMessage("Failed to resell ticket.");
            setNotificationVariant("error");
            console.error("Error reselling ticket:", error);
        } finally {
            setIsReselling(false);
        }
    }
    const eventDate = toDateFromUnix(ticketInfo?.eventDate ?? null);

    return (
        <div className={styles.container}>
            {/* Phase 1: Verification Card */}
            <section className={`${styles.verificationCard} ${ticketInfo ? styles.collapsed : ""}`}>
                {!ticketInfo && (
                    <>
                        <p className={styles.verificationLabel}>
                            Enter your ticket code to list for resale
                        </p>
                        <Input
                            type="text"
                            name="ticketCode"
                            label="Ticket Code"
                            value={ticketCode}
                            onChange={(e) => setTicketCode(e.target.value)}
                            theme="dark"
                            size="medium"
                        />
                        <Button
                            type="button"
                            text={isCheckingTicket ? "Checking..." : "Check Ticket"}
                            disabled={!ticketCode.trim() || isCheckingTicket}
                            onClick={handleCheckTicket}
                            variant="primary"
                        />
                    </>
                )}

                {ticketMessage && (
                    <div
                        className={`${styles.statusBadge} ${notificationVariant === "success"
                            ? styles.statusSuccess
                            : styles.statusError
                            }`}
                    >
                        {notificationVariant === "success" ? (
                            <>
                                <span className={styles.badgeSymbol}>✓</span>
                                <span>{ticketCode}</span>
                            </>
                        ) : (
                            ticketMessage
                        )}
                    </div>
                )}
            </section>

            {/* Phase 2: Ticket as Hero */}
            {ticketInfo && (
                <article className={styles.ticketHero}>
                    {/* Top Section: Ticket Visual */}
                    <div className={styles.ticketVisual}>
                        <div className={styles.ticketHeader}>
                            <h2 className={styles.eventName}>{ticketInfo.eventName}</h2>
                            <span className={styles.ticketId}>
                                #TKT-{String(ticketInfo.id).padStart(3, "0")}
                            </span>
                        </div>

                        {/* Metadata Grid */}
                        <div className={styles.metadataGrid}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Date</span>
                                <span className={styles.metaValue}>
                                    {eventDate?.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }) || "-"}
                                </span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Time</span>
                                <span className={styles.metaValue}>
                                    {eventDate?.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    }) || "-"}
                                </span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Venue</span>
                                <span className={styles.metaValue}>{ticketInfo.venue}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Section</span>
                                <span className={styles.metaValue}>{ticketInfo.section}</span>
                            </div>
                        </div>

                        {/* Row & Seat Pills */}
                        <div className={styles.pillContainer}>
                            <span className={styles.pill}>
                                <span className={styles.pillLabel}>Row</span>
                                {ticketInfo.row}
                            </span>
                            <span className={styles.pill}>
                                <span className={styles.pillLabel}>Seat</span>
                                {ticketInfo.seatNumber}
                            </span>
                        </div>
                    </div>

                    {/* Tear Divider */}
                    <div className={styles.tearDivider}>
                        <div className={styles.tearLeft} />
                        <div className={styles.tearRight} />
                    </div>

                    {/* Bottom Section: Pricing + Resell */}
                    <div className={styles.pricingSection}>
                        <div className={styles.pricingInsight}>
                            <span className={styles.pricingLabel}>Pricing Insight</span>
                            <span className={styles.averagePrice}>
                                {typeof averagePrice === "number"
                                    ? `${averagePrice.toFixed(2)} Ft`
                                    : "Not available yet"}
                            </span>
                            <span className={styles.suggestedRange}>
                                Suggested range:{" "}
                                {typeof averagePrice === "number"
                                    ? `${(averagePrice * 0.9).toFixed(2)} Ft - ${(averagePrice * 1.05).toFixed(2)} Ft`
                                    : "Set a competitive price close to recent market values."}
                            </span>
                        </div>

                        {/* Input + Button Joined Row */}
                        <div className={styles.resellRow}>
                            <Input
                                type="number"
                                name="resellPrice"
                                label="Resell Price"
                                value={resellPrice}
                                min={0}
                                step={0.01}
                                onChange={(e) => setResellPrice(e.target.value)}
                                theme="dark"
                                size="medium"
                            />
                            <Button
                                type="button"
                                text={isReselling ? "Reselling..." : "Resell"}
                                disabled={!resellPrice.trim() || isReselling}
                                onClick={handleResell}
                                variant="primary"
                            />
                        </div>

                        {ticketMessage && (
                            <div
                                className={`${styles.statusBadge} ${notificationVariant === "success"
                                    ? styles.statusSuccess
                                    : styles.statusError
                                    }`}
                            >
                                {ticketMessage}
                            </div>
                        )}
                    </div>
                </article>
            )}
        </div>
    );
};;

export default ListTicket;
