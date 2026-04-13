import { useState } from "react";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import styles from "./ListTicket.module.css";

const ListTicket = () => {
    const [ticketCode, setTicketCode] = useState("");

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>List Ticket</h1>

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
                        text="List Ticket"
                        disabled={!ticketCode.trim()}
                    />
                </div>
            </div>
        </div>
    );
};

export default ListTicket;
