import { lazy } from "react";
import { type RouteObject } from "react-router";
import MainLayout from "../components/layout/MainLayout.tsx";
import RequireAuth from "../components/auth/RequireAuth";


const About = lazy(() => import("../pages/about/About.tsx"));
const Contact = lazy(() => import("../pages/contact/Contact.tsx"));
const Terms = lazy(() => import("../pages/terms/Terms.tsx"));
const Privacy = lazy(() => import("../pages/privacy/Privacy.tsx"));
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
const Checkout = lazy(() => import("../pages/checkout/Checkout.tsx"));
const Validate = lazy(() => import("../pages/validate/Validate.tsx"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard.tsx"));
const DashboardCreateVenue = lazy(() => import("../pages/dashboard/create-venue/CreateVenue.tsx"));
const DashboardCreateEvent = lazy(() => import("../pages/dashboard/create-event/CreateEvent.tsx"));
const DashboardEditVenue = lazy(() => import("../pages/dashboard/edit-venue/EditVenue.tsx"));
const DashboardEditEvent = lazy(() => import("../pages/dashboard/edit-event/EditEvent.tsx"));
const DashboardMyTickets = lazy(() => import("../pages/dashboard/my-tickets/MyTickets.tsx"));
const DashboardMyEvents = lazy(() => import("../pages/dashboard/my-events/MyEvents.tsx"));
const DashboardSalesHistory = lazy(() => import("../pages/dashboard/sales-history/SalesHistory.tsx"));
const DashboardStatistics = lazy(() => import("../pages/dashboard/statistics/Statistics.tsx"));
const DashboardVenues = lazy(() => import("../pages/dashboard/venues/Venues.tsx"));
const DashboardEvents = lazy(() => import("../pages/dashboard/events/Events.tsx"));
const DashboardTickets = lazy(() => import("../pages/dashboard/tickets/Tickets.tsx"));
const DashboardUsers = lazy(() => import("../pages/dashboard/users/Users.tsx"));
const DashboardOrders = lazy(() => import("../pages/dashboard/orders/Orders.tsx"));
const DashboardReviews = lazy(() => import("../pages/dashboard/reviews/Reviews.tsx"));
const DashboardWebsite = lazy(() => import("../pages/dashboard/website/WebsiteManagement.tsx"));
const DashboardHistory = lazy(() => import("../pages/dashboard/history/TicketHistory.tsx"));
const DashboardUserSettings = lazy(() => import("../pages/dashboard/user-settings/UserSettings.tsx"));
const DashboardListTicket = lazy(() => import("../pages/dashboard/list-ticket/ListTicket.tsx"));
const ResetPassword = lazy(() => import("../pages/reset-password/ResetPassword.tsx"));

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Welcome /> },
      { path: "/welcome", element: <Welcome /> },
      { path: "/test", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/profile", element: <RequireAuth><Profile /></RequireAuth> },
      { path: "/browse", element: <Browse /> },
      { path: "/event", element: <Event /> },
      { path: "/vendor", element: <Vendor /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/validate", element: <RequireAuth><Validate /></RequireAuth> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/terms", element: <Terms /> },
      { path: "/privacy", element: <Privacy /> },
      {
        path: "/dashboard",
        element: <RequireAuth><Dashboard /></RequireAuth>,
        children: [
          { index: true, element: <DashboardMyTickets /> },
          { path: "create-venue", element: <DashboardCreateVenue /> },
          { path: "create-event", element: <DashboardCreateEvent /> },
          { path: "edit-venue/:id", element: <DashboardEditVenue /> },
          { path: "edit-event/:id", element: <DashboardEditEvent /> },
          { path: "list-tickets", element: <DashboardMyTickets /> },
          { path: "list-ticket", element: <DashboardListTicket /> },
          { path: "my-events", element: <DashboardMyEvents /> },
          { path: "sales-history", element: <DashboardSalesHistory /> },
          { path: "statistics", element: <DashboardStatistics /> },
          { path: "venues", element: <DashboardVenues /> },
          { path: "events", element: <DashboardEvents /> },
          { path: "tickets", element: <DashboardTickets /> },
          { path: "users", element: <DashboardUsers /> },
          { path: "orders", element: <DashboardOrders /> },
          { path: "reviews", element: <DashboardReviews /> },
          { path: "website", element: <DashboardWebsite /> },
          { path: "history", element: <DashboardHistory /> },
          { path: "user-settings", element: <DashboardUserSettings /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
