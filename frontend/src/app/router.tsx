import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.tsx";


const Home = lazy(() => import("../pages/test/test.tsx"));
const CreateVenue = lazy(() => import("../pages/create-venue/CreateVenue.tsx"));
const CreateEvent = lazy(() => import("../pages/create-event/CreateEvent.tsx"));
const Login = lazy(() => import("../pages/login/Login.tsx"));
const Register = lazy(() => import("../pages/register/Register.tsx"));
const Profile = lazy(() => import("../pages/profile/Profile.tsx"));
const NotFound = lazy(() => import("../pages/notfound/NotFound.tsx"));
const Welcome = lazy(() => import("../pages/welcome/Welcome.tsx"));
const Browse = lazy(() => import("../pages/browse/Browse.tsx"));
const Event = lazy(() => import("../pages/event/Event.tsx"));
const Vendor = lazy(() => import("../pages/vendor/Vendor.tsx"));
const Cart = lazy(() => import("../pages/cart/Cart.tsx"));

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Welcome /> },
      { path: "/welcome", element: <Welcome /> },
      { path: "/test", element: <Home /> },
      { path: "/create-venue", element: <CreateVenue /> },
      { path: "/create-event", element: <CreateEvent /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/profile", element: <Profile /> },
      { path: "/browse", element: <Browse /> },
      { path: "/event", element: <Event/>},
      { path: "/vendor", element : <Vendor/>},
      { path: "/cart", element : <Cart/>},
      { path: "*", element: <NotFound /> },
    ],
  },
];
