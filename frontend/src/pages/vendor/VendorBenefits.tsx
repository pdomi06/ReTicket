import styles from './Vendor.module.css';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const VendorBenefits = () => {
  const benefits: Benefit[] = [
    {
      icon: '📈',
      title: 'Maximize Your Profits',
      description: 'Competitive commission rates and transparent pricing help you keep more of what you earn'
    },
    {
      icon: '🛡️',
      title: 'Safe & Secure',
      description: 'Industry-leading security measures protect both you and your buyers'
    },
    {
      icon: '⚡',
      title: 'Quick Payouts',
      description: '7-day payout cycle with multiple payment methods available'
    },
    {
      icon: '📱',
      title: 'Easy Management',
      description: 'Intuitive dashboard to manage inventory, pricing, and sales in one place'
    },
    {
      icon: '🌍',
      title: 'Reach More Buyers',
      description: 'Access to millions of active buyers across the ReTicket platform'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Dedicated vendor support team ready to help whenever you need'
    }
  ];

  return (
    <section className={styles.benefits}>
      <div className={styles.sectionHeader}>
        <h2>Why Sell on ReTicket?</h2>
        <p>Everything you need to succeed as a vendor</p>
      </div>
      <div className={styles.benefitsGrid}>
        {benefits.map((benefit, index) => (
          <div key={index} className={styles.benefitCard}>
            <div className={styles.benefitIcon}>{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VendorBenefits;
