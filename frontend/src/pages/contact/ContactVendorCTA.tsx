import styles from './contact.module.css';
import { useNavigate } from 'react-router-dom';

const ContactVendorCTA = () => {
  const navigate = useNavigate();

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
        <button
          className={styles.vendorCtaButton}
          onClick={() => navigate('/vendor')}
        >
          Go to Vendor Guide →
        </button>
      </div>
    </section>
  );
};

export default ContactVendorCTA;
