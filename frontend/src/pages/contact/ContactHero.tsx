import styles from './Contact.module.css';

const ContactHero = () => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>We're Here to Help</h1>
          <p className={styles.heroSubtext}>
            Got a question about a ticket, your account, or how ReTicket works?
            Reach out and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
