import { Outlet, useLocation } from 'react-router';
import Navbar from './navbar/navbar.tsx';
import Footer from './footer/footer.tsx';
import styles from './MainLayout.module.css';
import EventContextProvider from '../../contexts/event/EventContext.tsx';
import CartContextProvider from '../../contexts/cart/CartContext.tsx';
import { useIsPageLoading } from '../../contexts/loading/LoadingContext.tsx';
import PageLoader from '../loading/PageLoader.tsx';

export default function MainLayout() {
  return <MainLayoutContent />;
}

function MainLayoutContent() {
  const { pathname } = useLocation();
  const isPageLoading = useIsPageLoading();
  const hideFooter = pathname.startsWith('/dashboard');

  return (
    <>
      <div
        className={`${styles.layout} ${isPageLoading ? styles.pageLoading : ""}`}
        aria-busy={isPageLoading}
        aria-hidden={isPageLoading || undefined}
        inert={isPageLoading || undefined}
      >
        <EventContextProvider>
          <CartContextProvider>
            <Navbar />
            <main className={styles.main}>
              <Outlet />
            </main>
            {!hideFooter && <Footer />}
          </CartContextProvider>
        </EventContextProvider>
      </div>
      <PageLoader />
    </>
  );
}
