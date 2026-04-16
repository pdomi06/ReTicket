import styles from './About.module.css';

interface Problem {
  text: string;
}

const AboutProblem = () => {
  const problems: Problem[] = [
    { text: "There's no guarantee it hasn't been sold multiple times" },
    { text: 'The same ticket can be shared with 10 different people' },
    { text: 'You can show up, pay, and still be turned away at the door' }
  ];

  return (
    <section className={styles.problem}>
      <div className={styles.sectionHeader}>
        <h2>The Problem We Saw</h2>
      </div>
      <div className={styles.problemContent}>
        <p className={styles.problemIntro}>The secondary ticket market is broken. When you buy a resold ticket:</p>
        <div className={styles.problemList}>
          {problems.map((problem, index) => (
            <div key={index} className={styles.problemItem}>
              <span className={styles.problemNumber}>{`${index + 1}`}</span>
              <p>{problem.text}</p>
            </div>
          ))}
        </div>
        <p className={styles.problemFooter}>That's not just frustrating. It's unfair.</p>
      </div>
    </section>
  );
};

export default AboutProblem;
