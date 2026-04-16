import styles from './About.module.css';

interface Step {
  icon: string;
  text: string;
}

const AboutSolution = () => {
  const steps: Step[] = [
    { icon: '🔄', text: 'The old ticket is instantly invalidated' },
    { icon: '✨', text: 'A brand new, unique ticket with a fresh QR code is generated' },
    { icon: '✅', text: 'The new owner receives the only valid ticket in existence' }
  ];

  return (
    <section className={styles.solution}>
      <div className={styles.sectionHeader}>
        <h2>Our Solution - Zero-Risk Resale</h2>
      </div>
      <div className={styles.solutionContent}>
        <p className={styles.solutionIntro}>
          We built a secure, transparent ticket resale platform where fraud simply cannot happen. How? The Regeneration Technology.
        </p>
        <p className={styles.solutionSubheading}>Every time a ticket changes hands on our platform:</p>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepIcon}>{step.icon}</div>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
        <p className={styles.result}>
          The original seller can't reuse it. Can't duplicate it. Can't scam you.
        </p>
        <p className={styles.resultSubtext}>
          Result: You buy with 100% confidence. You enter with zero worry.
        </p>
      </div>
    </section>
  );
};

export default AboutSolution;
