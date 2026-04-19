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
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const hideFooter = pathname.startsWith('/dashboard');
  const shouldShowGlobalLoader = !isDashboardRoute;
  const shouldBlockMainLayout = isPageLoading && shouldShowGlobalLoader;

  return (
    <>
      <div
        className={`${styles.layout} ${shouldBlockMainLayout ? styles.pageLoading : ""}`}
        aria-busy={shouldBlockMainLayout}
        aria-hidden={shouldBlockMainLayout || undefined}
        inert={shouldBlockMainLayout || undefined}
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
      <PageLoader isEnabled={shouldShowGlobalLoader} />
    </>
  );
}
