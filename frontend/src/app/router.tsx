import { type RouteObject } from 'react-router';
import Home from '../pages/test/test.tsx';
import Scenery from '../pages/scenery/Scenery.tsx';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/test',
    element: <Home />,
  },
  {
    path: '/scenery',
    element: <Scenery />,
  },
];
