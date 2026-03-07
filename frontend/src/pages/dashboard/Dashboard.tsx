import styles from './Dashboard.module.css';

const Dashboard = () => {
    return (
        <div className={`row ${styles.dashboard}`}>
            <div className={`col-3 ${styles.sidebar}`}>
                <h2>Dashboard Menu</h2>
            </div>
            <div className={`col-9 ${styles.content}`}>
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard! Here you can manage your events, view sales, and access analytics.</p>
                <p>Use the navigation menu to access different sections of your dashboard.</p>
            </div>
        </div>
    );
}

export default Dashboard;