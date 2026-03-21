import { NavLink } from "react-router-dom";
import { LuLayoutDashboard, LuTicket, LuCalendar, LuTrendingUp, LuMapPin } from "react-icons/lu";
import style from "./Sidebar.module.css";

const NAV_ITEMS = [
    { label: "Overview", icon: LuLayoutDashboard, link: "/dashboard" },
];

const TICKET_ITEMS = [
    { label: "List Tickets for Sale", icon: LuTicket, link: "/dashboard/list-tickets" },
];

const MANAGE_ITEMS = [
    { label: "My Events", icon: LuCalendar, link: "/dashboard/my-events" },
    { label: "Sales", icon: LuTrendingUp, link: "/dashboard/sales" },
];

const ADMIN_ITEMS = [
    { label: "Venues", icon: LuMapPin, link: "/dashboard/venues" },
    { label: "Events", icon: LuCalendar, link: "/dashboard/events" },
    { label: "Tickets", icon: LuTicket, link: "/dashboard/tickets" },
];

const Sidebar = () => {
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;
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

                <div className={style.sectionLabel}>TICKETS</div>
                {TICKET_ITEMS.map(({ label, icon: Icon, link }) => (
                    <NavLink key={link} to={link} className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ''}`}>
                        <Icon className={style.icon} />
                        <span>{label}</span>
                    </NavLink>
                ))}

                <div className={style.sectionLabel}>MANAGE</div>
                {MANAGE_ITEMS.map(({ label, icon: Icon, link }) => (
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
                <div className={style.profileSettings}><NavLink to="/dashboard/user-settings">
                    {userData ? userData.name : "User Settings"}
                </NavLink></div>
            </nav>
        </div>
    );
}

export default Sidebar;
