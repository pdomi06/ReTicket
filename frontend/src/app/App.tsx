import { useRoutes } from 'react-router';
import { routes } from './router';
import { Suspense } from 'react';

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {useRoutes(routes)}
    </Suspense>
  )
}
