import styles from './About.module.css';

interface TrustPillar {
  title: string;
  description: string;
}

const AboutTrust = () => {
  const pillars: TrustPillar[] = [
    {
      title: 'Technical Foundation',
      description: 'Built with Laravel, PostgreSQL, and Stripe for enterprise-grade reliability and scale'
    },
    {
      title: 'User-First Design',
      description: 'Simple, intuitive, and fast — powered by React and TypeScript for a seamless experience'
    },
    {
      title: 'Full Transparency',
      description: 'Every ticket transfer is logged, timestamped, and irreversible for complete accountability'
    },
    {
      title: 'Powered by AWS Infrastructure',
      description: 'Our backend and frontend rely on AWS for rock-solid scalability, security, and uptime'
    }
  ];

  return (
    <section className={styles.trust}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Why Trust Us?</h2>
        </div>
        <div className="row g-4">
          {pillars.map((pillar, index) => (
            <div key={index} className="col-12 col-md-6 col-xl-3">
              <div className={`${styles.trustCard} h-100`}>
                <h3 className={styles.trustTitle}>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTrust;
