import { Outlet, useLocation } from 'react-router';
import Navbar from './navbar/navbar.tsx';
import Footer from './footer/footer.tsx';
import styles from './MainLayout.module.css';
import EventContextProvider from '../../contexts/event/EventContext.tsx';
import CartContextProvider from '../../contexts/cart/CartContext.tsx';

export default function MainLayout() {
  const { pathname } = useLocation();
  const hideFooter = pathname.startsWith('/dashboard');

  return (
    <div className={styles.layout}>
      <EventContextProvider>
        <CartContextProvider>
          <Navbar />
          <main className={styles.main}>
            <Outlet />
          </main>
          {!hideFooter && <Footer />}
        </CartContextProvider>
      </EventContextProvider>
    </div >
  );
}
