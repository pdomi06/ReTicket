import styles from './Contact.module.css';
import { Link } from 'react-router-dom';

const ContactVendorCTA = () => {

  return (
    <section className={styles.vendorCta}>
      <div className={styles.vendorCtaContent}>
        <div className={styles.vendorCtaIcon}>🎫</div>
        <h2 className={styles.vendorCtaTitle}>Looking to Sell Tickets?</h2>
        <p className={styles.vendorCtaSubtext}>
          Our Vendor page walks you through everything - step by step - from listing
          your first ticket to getting paid. Plus, find answers to the most common
          seller questions in our FAQ.
        </p>
          <Link to="/vendor" className={styles.vendorCtaButton}>
            Go to Vendor Guide →
          </Link>
      </div>
    </section>
  );
};

export default ContactVendorCTA;
