import Sidebar from "./sidebar/Sidebar";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebarWrapper}>
                <Sidebar />
            </div>
            <div className={styles.contentWrapper}>
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard! Here you can manage your events, view sales, and access analytics.</p>
                <p>Use the navigation menu to access different sections of your dashboard.</p>
            </div>
        </div>
    );
}

export default Dashboard;