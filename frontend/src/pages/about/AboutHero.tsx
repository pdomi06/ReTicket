import styles from './About.module.css';

const AboutHero = () => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={`${styles.heroContent} mx-auto`}>
          <h1 className={styles.heroTitle}>No Fakes. No Fear. No Excuses.</h1>
          <p className={styles.heroSubtext}>
            Every day, thousands of fans miss out on incredible experiences - not because they didn't buy a ticket, but because the ticket they bought was fake or sold to someone else. We decided to fix that.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
