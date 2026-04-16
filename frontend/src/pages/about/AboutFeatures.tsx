import styles from './About.module.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const AboutFeatures = () => {
  const features: Feature[] = [
    { icon: '🛡️', title: 'Fraud-Proof Resale', description: 'Our regeneration system makes double-selling impossible' },
    { icon: '🔍', title: 'Real-Time Validation', description: 'QR codes are verified instantly at the door' },
    { icon: '💳', title: 'Secure Payments', description: 'Stripe-powered checkout - your money is safe' },
    { icon: '📱', title: 'Modern Experience', description: 'Clean, responsive design powered by React and Bootstrap' }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.sectionHeader}>
        <h2>What We Offer</h2>
      </div>
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureIcon}>{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutFeatures;
