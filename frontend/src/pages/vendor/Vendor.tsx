import VendorHero from './VendorHero';
import VendorBenefits from './VendorBenefits';
import VendorStats from './VendorStats';
import VendorProcess from './VendorProcess';
import VendorFAQ from './VendorFAQ';
import VendorCTA from './VendorCTA';
import styles from './Vendor.module.css';

const Vendor = () => {
  return (
    <main className={styles.vendorPage}>
      <VendorHero />
      <VendorBenefits />
      <VendorStats />
      <VendorProcess />
      <VendorFAQ />
      <VendorCTA />
    </main>
  );
};

export default Vendor;