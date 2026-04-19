import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import styles from "./Dashboard.module.css";
import PageLoader from "../../components/loading/PageLoader";

const Dashboard = () => {
    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebarWrapper}>
                <Sidebar />
            </div>
            <div className={styles.contentWrapper}>
                <Outlet />
                <PageLoader isContained className={styles.pageLoader} />
            </div>
        </div>
    );
}

export default Dashboard;
