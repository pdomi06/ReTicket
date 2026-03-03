import styles from './Vendor.module.css';

interface Stat {
  number: string;
  label: string;
  subtitle: string;
}

const VendorStats = () => {
  const stats: Stat[] = [
    {
      number: '50K+',
      label: 'Active Vendors',
      subtitle: 'Trusted sellers on the platform'
    },
    {
      number: '$2.4B',
      label: 'Total Volume',
      subtitle: 'Processed annually'
    },
    {
      number: '4.8★',
      label: 'Average Rating',
      subtitle: 'From millions of buyers'
    },
    {
      number: '10.2M+',
      label: 'Active Tickets',
      subtitle: 'Available for sale right now'
    }
  ];

  return (
    <section className={styles.stats}>
      <div className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statNumber}>{stat.number}</div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statSubtitle}>{stat.subtitle}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VendorStats;
