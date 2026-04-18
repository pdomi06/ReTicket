import { Outlet, useLocation } from 'react-router';
import Navbar from './navbar/navbar.tsx';
import Footer from './footer/footer.tsx';
import styles from './MainLayout.module.css';
import EventContextProvider from '../../contexts/event/EventContext.tsx';
import CartContextProvider from '../../contexts/cart/CartContext.tsx';
import { LoadingProvider, useIsPageLoading } from '../../contexts/loading/LoadingContext.tsx';
import PageLoader from '../loading/PageLoader.tsx';

export default function MainLayout() {
  return (
    <LoadingProvider>
      <MainLayoutContent />
    </LoadingProvider>
  );
}

function MainLayoutContent() {
  const { pathname } = useLocation();
  const isPageLoading = useIsPageLoading();
  const hideFooter = pathname.startsWith('/dashboard');

  return (
    <>
      <div className={`${styles.layout} ${isPageLoading ? styles.pageLoading : ""}`}>
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
