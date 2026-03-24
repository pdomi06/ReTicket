import { NavLink } from "react-router-dom";
import { LuLayoutDashboard, LuTicket, LuCalendar, LuTrendingUp, LuMapPin, LuEllipsis, LuUsers, LuShoppingCart, LuStar, LuMonitor, LuHistory } from "react-icons/lu";
import style from "./Sidebar.module.css";

const NAV_ITEMS = [
    { label: "Overview", icon: LuLayoutDashboard, link: "/dashboard" },
];

const VENDOR_ITEMS = [
    { label: "My Tickets", icon: LuTicket, link: "/dashboard/list-tickets" },
    { label: "Sales History", icon: LuHistory, link: "/dashboard/sales-history" },
];

const ORGANIZER_ITEMS = [
    { label: "My Events", icon: LuCalendar, link: "/dashboard/my-events" },
    { label: "Statistics", icon: LuTrendingUp, link: "/dashboard/statistics" },
];

const ADMIN_ITEMS = [
    { label: "Venues", icon: LuMapPin, link: "/dashboard/venues" },
    { label: "Events", icon: LuCalendar, link: "/dashboard/events" },
    { label: "Tickets", icon: LuTicket, link: "/dashboard/tickets" },
    { label: "Users", icon: LuUsers, link: "/dashboard/users" },
    { label: "Orders", icon: LuShoppingCart, link: "/dashboard/orders" },
    { label: "Reviews", icon: LuStar, link: "/dashboard/reviews" },
    { label: "Website Management", icon: LuMonitor, link: "/dashboard/website" },
    { label: "Ticket History", icon: LuHistory, link: "/dashboard/history" },
];

const Sidebar = () => {
    const user = localStorage.getItem("user");
    let userData = null;

    try {
        userData = user ? JSON.parse(user) : null;
    } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        userData = null;
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className={style.sidebar}>
            <div className={style.brand}>
                <span className={style.brandName}>ReTicket</span>
            </div>
            <nav className={style.nav}>
                {NAV_ITEMS.map(({ label, icon: Icon, link }) => (
                    <NavLink key={link} to={link} end className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ''}`}>
                        <Icon className={style.icon} />
                        <span>{label}</span>
                    </NavLink>
                ))}

                <div className={style.sectionLabel}>VENDOR</div>
                {VENDOR_ITEMS.map(({ label, icon: Icon, link }) => (
                    <NavLink key={link} to={link} className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ''}`}>
                        <Icon className={style.icon} />
                        <span>{label}</span>
                    </NavLink>
                ))}

                <div className={style.sectionLabel}>ORGANIZER</div>
                {ORGANIZER_ITEMS.map(({ label, icon: Icon, link }) => (
                    <NavLink key={link} to={link} className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ''}`}>
                        <Icon className={style.icon} />
                        <span>{label}</span>
                    </NavLink>
                ))}

                <div className={style.sectionLabel}>ADMIN</div>
                {ADMIN_ITEMS.map(({ label, icon: Icon, link }) => (
                    <NavLink key={link} to={link} className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ''}`}>
                        <Icon className={style.icon} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {userData && (
                <NavLink to="/dashboard/user-settings" className={style.profileCard}>
                    <div className={style.avatarContainer}>
                        <div className={style.avatar}>{getInitials(userData.name)}</div>
                    </div>
                    <div className={style.profileInfo}>
                        <div className={style.profileName}>{userData.name}</div>
                        <div className={style.profileRole}>Settings</div>
                    </div>
                    <LuEllipsis className={style.profileMenu} />
                </NavLink>
            )}
        </div>
    );
}

export default Sidebar;
