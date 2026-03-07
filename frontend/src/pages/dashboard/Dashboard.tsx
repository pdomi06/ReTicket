import Sidebar from "./sidebar/Sidebar";

const Dashboard = () => {
    return (
        <div className={`row`}>
            <div className={`col-12 col-lg-3`}>
                <Sidebar />
            </div>
            <div className={`col-12 col-lg-9`}>
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard! Here you can manage your events, view sales, and access analytics.</p>
                <p>Use the navigation menu to access different sections of your dashboard.</p>
            </div>
        </div>
    );
}

export default Dashboard;