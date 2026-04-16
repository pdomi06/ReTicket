import styles from './About.module.css';

const AboutTeam = () => {
  return (
    <section className={styles.team}>
      <div className={styles.sectionHeader}>
        <h2>The Team Behind It</h2>
      </div>
      <div className={styles.teamContent}>
        <p className={styles.teamBody}>
          We're developers and event-goers who got tired of seeing friends get scammed. So we built the fix – not as a feature, but as the foundation. No patches. No workarounds. Just a system where fraud is structurally impossible.
        </p>
      </div>
    </section>
  );
};

export default AboutTeam;
