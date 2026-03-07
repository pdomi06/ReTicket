const Sidebar = () => {
    return (
        <div>
            <h2>Dashboard Menu</h2>
            <ul>
                <li><a href="/dashboard/events">My Events</a></li>
                <li><a href="/dashboard/sales">Sales</a></li>
                <li><a href="/dashboard/analytics">Analytics</a></li>
            </ul>
        </div>
    );
}

export default Sidebar;