import { lazy } from 'react';
import { type RouteObject } from 'react-router';
import MainLayout from '../components/layout/MainLayout.tsx';
const Home = lazy(() => import('../pages/test/test.tsx'));
const Scenery = lazy(() => import('../pages/scenery/Scenery.tsx'));
export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/test', element: <Home /> },
      { path: '/scenery', element: <Scenery /> },
    ],
  },
];
