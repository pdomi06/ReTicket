import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.tsx";


const Home = lazy(() => import("../pages/test/test.tsx"));
const Scenery = lazy(() => import("../pages/scenery/Scenery.tsx"));
const Login = lazy(() => import("../pages/login/Login.tsx"));
const Register = lazy(() => import("../pages/register/Register.tsx"));
const Profile = lazy(() => import("../pages/profile/Profile.tsx"));
const NotFound = lazy(() => import("../pages/notfound/NotFound.tsx"));

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/test", element: <Home /> },
      { path: "/scenery", element: <Scenery /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
