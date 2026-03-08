import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.tsx";


const Home = lazy(() => import("../pages/test/test.tsx"));
const Login = lazy(() => import("../pages/login/Login.tsx"));
const Register = lazy(() => import("../pages/register/Register.tsx"));
const Profile = lazy(() => import("../pages/profile/Profile.tsx"));
const NotFound = lazy(() => import("../pages/notfound/NotFound.tsx"));
const Welcome = lazy(() => import("../pages/welcome/Welcome.tsx"));
const Browse = lazy(() => import("../pages/browse/Browse.tsx"));
const Event = lazy(() => import("../pages/event/Event.tsx"));
const Vendor = lazy(() => import("../pages/vendor/Vendor.tsx"));
const Cart = lazy(() => import("../pages/cart/Cart.tsx"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard.tsx"));
const DashboardOverview = lazy(() => import("../pages/dashboard/overview/Overview.tsx"));
const DashboardCreateVenue = lazy(() => import("../pages/dashboard/create-venue/CreateVenue.tsx"));
const DashboardCreateEvent = lazy(() => import("../pages/dashboard/create-event/CreateEvent.tsx"));
const DashboardEditVenue = lazy(() => import("../pages/dashboard/edit-venue/EditVenue.tsx"));
const DashboardEditEvent = lazy(() => import("../pages/dashboard/edit-event/EditEvent.tsx"));
const DashboardListTickets = lazy(() => import("../pages/dashboard/list-tickets/ListTickets.tsx"));
const DashboardMyEvents = lazy(() => import("../pages/dashboard/my-events/MyEvents.tsx"));
const DashboardSales = lazy(() => import("../pages/dashboard/sales/Sales.tsx"));
const DashboardVenues = lazy(() => import("../pages/dashboard/venues/Venues.tsx"));
const DashboardEvents = lazy(() => import("../pages/dashboard/events/Events.tsx"));
const DashboardTickets = lazy(() => import("../pages/dashboard/tickets/Tickets.tsx"));

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Welcome /> },
      { path: "/welcome", element: <Welcome /> },
      { path: "/test", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/profile", element: <Profile /> },
      { path: "/browse", element: <Browse /> },
      { path: "/event", element: <Event /> },
      { path: "/vendor", element: <Vendor /> },
      { path: "/cart", element: <Cart /> },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          { index: true, element: <DashboardOverview /> },
          { path: "create-venue", element: <DashboardCreateVenue /> },
          { path: "create-event", element: <DashboardCreateEvent /> },
          { path: "edit-venue/:id", element: <DashboardEditVenue /> },
          { path: "edit-event/:id", element: <DashboardEditEvent /> },
          { path: "list-tickets", element: <DashboardListTickets /> },
          { path: "my-events", element: <DashboardMyEvents /> },
          { path: "sales", element: <DashboardSales /> },
          { path: "venues", element: <DashboardVenues /> },
          { path: "events", element: <DashboardEvents /> },
          { path: "tickets", element: <DashboardTickets /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
