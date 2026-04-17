import styles from './About.module.css';

const AboutMission = () => {
  return (
    <section className={styles.mission}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Our Mission</h2>
        </div>
        <div className={styles.missionContent}>
          <p className={styles.missionStatement}>
            To make ticket resale 100% safe - so you can focus on the experience, not the risk.
          </p>
          <p className={styles.missionBody}>
            We believe that no fan should ever be turned away from a concert, game, or show because of a scam. We're building a future where every resold ticket is guaranteed valid - or it doesn't get sold at all.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
