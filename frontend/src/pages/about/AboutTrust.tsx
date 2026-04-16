import styles from './About.module.css';

interface TrustPillar {
  title: string;
  description: string;
}

const AboutTrust = () => {
  const pillars: TrustPillar[] = [
    {
      title: 'Technical Foundation',
      description: 'Built with Laravel, PostgreSQL, and Stripe for enterprise-grade reliability'
    },
    {
      title: 'User-First Design',
      description: 'Simple, intuitive, and fast (thanks to React and typescript)'
    },
    {
      title: 'Full Transparency',
      description: 'Every ticket transfer is logged and irreversible'
    },
    {
      title: 'Powered by AWS Infrastructure',
      description: 'Our Laravel backend, Neon database services, and Vercel-hosted frontend all rely on AWS for scalability, security, and uptime'
    }
  ];

  return (
    <section className={styles.trust}>
      <div className={styles.sectionHeader}>
        <h2>Why Trust Us?</h2>
      </div>
      <div className={styles.trustGrid}>
        {pillars.map((pillar, index) => (
          <div key={index} className={styles.trustCard}>
            <h3 className={styles.trustTitle}>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutTrust;
