import { Outlet } from 'react-router';
import Navbar from './navbar/navbar.tsx';
import Footer from './footer/footer.tsx';
import styles from './MainLayout.module.css';
import EventContextProvider from '../../contexts/event/EventContext.tsx';
import CartContextProvider from '../../contexts/cart/CartContext.tsx';

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <EventContextProvider>
        <CartContextProvider>
          <Navbar />
          <main className={styles.main}>
            <Outlet />
          </main>
          <Footer />
        </CartContextProvider>
      </EventContextProvider>
    </div >
  );
}
