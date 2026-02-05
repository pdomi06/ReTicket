import { Outlet } from 'react-router';
import Navbar from './navbar/navbar.tsx';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
