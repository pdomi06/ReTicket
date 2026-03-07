import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebarWrapper}>
                <Sidebar />
            </div>
            <div className={styles.contentWrapper}>
                <Outlet />
            </div>
        </div>
    );
}

export default Dashboard;
