import { useState } from "react";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import Notification from "../../../components/ui/notification/Notification";
import type { IDashboardTicket } from "../../../utils/interfaces";
import { toDateFromUnix } from "../../../utils/dateTime";
import styles from "./ListTicket.module.css";

const ListTicket = () => {
    const [ticketCode, setTicketCode] = useState("");
    const [ticketInfo, setTicketInfo] = useState<IDashboardTicket | null>(null);
    const [ticketMessage, setTicketMessage] = useState("");
    const [resellPrice, setResellPrice] = useState("");
    const [averagePrice, setAveragePrice] = useState<number | null>(null);

    async function handleCheckTicket() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/activeTickets/checkTicket`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ticketListingId: ticketCode,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to check ticket");
            }
            const data = await response.json();
            if (!data.exists) {
                setTicketMessage(data.message || "Ticket not found");
                setTicketInfo(null);
                setAveragePrice(null);
                return;
            }
            setTicketMessage(data.message || "Ticket found");
            setTicketInfo(data.originalTicket);
            const parsedAveragePrice = Number(data.averagePrice);
            setAveragePrice(Number.isFinite(parsedAveragePrice) ? parsedAveragePrice : null);
        } catch (error) {
            console.error("Error checking ticket:", error);
        }
    }
    async function handleResell() {
        if (!ticketInfo) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/activeTickets/resell`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    ticketListingId: ticketCode,
                    price: resellPrice,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to resell ticket");
            }
            const data = await response.json();
            if (data.success) {
                setTicketMessage("Ticket resold successfully.");
                setTicketInfo(null);
            } else {
                setTicketMessage(data.error || "Failed to resell ticket.");
            }
        } catch (error) {
            console.error("Error reselling ticket:", error);
        }
    }


    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>List Ticket</h1>

            {ticketMessage && (
                <Notification
                    text={ticketMessage}
                    variant={ticketInfo ? "success" : "error"}
                />
            )}

            <div className={styles.ticketCodeSection}>
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
                        text="Check Ticket"
                        disabled={!ticketCode.trim()}
                        onClick={handleCheckTicket}
                    />
                </div>
            </div>
            {ticketInfo && (
                <>
                    <article className={styles.ticketCard}>
                        <header className={styles.ticketHeader}>
                            <h2 className={styles.eventTitle}>{ticketInfo.eventName}</h2>
                        </header>

                        <div className={styles.ticketBody}>
                            <div className={styles.ticketGrid}>
                                <div className={styles.ticketField}>
                                    <span className={styles.fieldLabel}>Date</span>
                                    <span className={styles.fieldValue}>
                                        {toDateFromUnix(ticketInfo.eventDate)?.toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        }) || "-"}
                                    </span>
                                </div>
                                <div className={styles.ticketField}>
                                    <span className={styles.fieldLabel}>Time</span>
                                    <span className={styles.fieldValue}>
                                        {toDateFromUnix(ticketInfo.eventDate)?.toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        }) || "-"}
                                    </span>
                                </div>
                                <div className={styles.ticketField}>
                                    <span className={styles.fieldLabel}>Venue</span>
                                    <span className={styles.fieldValue}>{ticketInfo.venue}</span>
                                </div>
                                <div className={styles.ticketField}>
                                    <span className={styles.fieldLabel}>Section</span>
                                    <span className={styles.fieldValue}>{ticketInfo.section}</span>
                                </div>
                                <div className={styles.ticketField}>
                                    <span className={styles.fieldLabel}>Row</span>
                                    <span className={styles.fieldValue}>{ticketInfo.row}</span>
                                </div>
                                <div className={styles.ticketField}>
                                    <span className={styles.fieldLabel}>Seat</span>
                                    <span className={styles.fieldValue}>{ticketInfo.seatNumber}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.tearDivider}>
                            <span className={styles.tearCutoutLeft}></span>
                            <span className={styles.tearLine}></span>
                            <span className={styles.tearCutoutRight}></span>
                        </div>

                        <footer className={styles.ticketFooter}>
                            <div className={styles.pillGroup}>
                                <div className={styles.metaPill}>
                                    <span className={styles.pillLabel}>Row</span>
                                    <span className={styles.pillValue}>{ticketInfo.row}</span>
                                </div>
                                <div className={styles.metaPill}>
                                    <span className={styles.pillLabel}>Seat</span>
                                    <span className={styles.pillValue}>{ticketInfo.seatNumber}</span>
                                </div>
                            </div>
                            <div className={styles.ticketId}>#TKT-{String(ticketInfo.id).padStart(3, "0")}</div>
                        </footer>
                    </article>

                    <section className={styles.averageCard}>
                        <h3 className={styles.averageTitle}>Pricing Insight</h3>
                        <p className={styles.averageText}>
                            Average resale price for similar tickets: {" "}
                            <strong>
                                {typeof averagePrice === "number" ? `${averagePrice.toFixed(2)} Ft` : "Not available yet"}
                            </strong>
                        </p>
                        <p className={styles.averageHint}>
                            Suggested listing range: {" "}
                            {typeof averagePrice === "number"
                                ? `${(averagePrice * 0.9).toFixed(2)} Ft - ${(averagePrice * 1.05).toFixed(2)} Ft`
                                : "Set a competitive price close to recent market values."}
                        </p>
                    </section>

                    <section className={styles.resellCard}>
                        <div className={styles.resellInputWrapper}>
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
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button
                                type="button"
                                text="Resell"
                                disabled={!resellPrice.trim()}
                                onClick={handleResell}
                            />
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default ListTicket;
