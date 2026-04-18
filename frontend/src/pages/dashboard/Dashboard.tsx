import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

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
