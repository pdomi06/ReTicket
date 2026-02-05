import { Outlet } from 'react-router';
import Navbar from './navbar/navbar.tsx';
import Footer from './footer/footer.tsx';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
