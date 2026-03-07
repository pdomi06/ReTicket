import { NavLink } from "react-router-dom";
import { LuLayoutDashboard, LuTicket, LuCalendar, LuTrendingUp, LuMapPin, LuPartyPopper } from "react-icons/lu";
import style from "./Sidebar.module.css";

const NAV_ITEMS = [
    { label: "Overview", icon: LuLayoutDashboard, link: "/dashboard" },
];

const TICKET_ITEMS = [
    { label: "List Tickets for Sale", icon: LuTicket, link: "/dashboard/list-tickets" },
];

const MANAGE_ITEMS = [
    { label: "My Events", icon: LuCalendar, link: "/dashboard/events" },
    { label: "Sales", icon: LuTrendingUp, link: "/dashboard/sales" },
];

const ADMIN_ITEMS = [
    { label: "Create Venue", icon: LuMapPin, link: "/dashboard/create-venue" },
    { label: "Create Event", icon: LuPartyPopper, link: "/dashboard/create-event" },
];

const Sidebar = () => {
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
            </nav>
        </div>
    );
}

export default Sidebar;
