import { Outlet } from 'react-router';
import Navbar from './navbar/navbar.tsx';
import Footer from './footer/footer.tsx';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
