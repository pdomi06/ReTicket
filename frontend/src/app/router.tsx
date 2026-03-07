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
const DashboardCreateVenue = lazy(() => import("../pages/dashboard/create-venue/CreateVenue.tsx"));
const DashboardCreateEvent = lazy(() => import("../pages/dashboard/create-event/CreateEvent.tsx"));
const ListTickets = lazy(() => import("../pages/dashboard/list-tickets/ListTickets.tsx"));
const MyEvents = lazy(() => import("../pages/dashboard/my-events/MyEvents.tsx"));
const Sales = lazy(() => import("../pages/dashboard/sales/Sales.tsx"));
const Venues = lazy(() => import("../pages/dashboard/venues/Venues.tsx"));
const Events = lazy(() => import("../pages/dashboard/events/Events.tsx"));
const Tickets = lazy(() => import("../pages/dashboard/tickets/Tickets.tsx"));

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
          { path: "create-venue", element: <DashboardCreateVenue /> },
          { path: "create-event", element: <DashboardCreateEvent /> },
          { path: "list-tickets", element: <ListTickets /> },
          { path: "my-events", element: <MyEvents /> },
          { path: "sales", element: <Sales /> },
          { path: "venues", element: <Venues /> },
          { path: "events", element: <Events /> },
          { path: "tickets", element: <Tickets /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
