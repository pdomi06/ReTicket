import { Outlet } from 'react-router';
import Navbar from './navbar/navbar.tsx';
import Footer from './footer/footer.tsx';
import styles from './MainLayout.module.css';
import EventContextProvider from '../../contexts/event/EventContext.tsx';

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <EventContextProvider>
        <Outlet />
        </EventContextProvider>
      </main>
      <Footer />
    </div>
  );
}
