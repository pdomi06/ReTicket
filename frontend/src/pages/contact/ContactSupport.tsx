import styles from './Contact.module.css';

interface SupportCategory {
  icon: string;
  title: string;
  description: string;
  emailSubject: string;
}

const categories: SupportCategory[] = [
  {
    icon: '🎟️',
    title: 'Buying a Ticket',
    description: 'Questions about purchasing, QR codes, or entry issues',
    emailSubject: 'Buying Support'
  },
  {
    icon: '💰',
    title: 'Selling a Ticket',
    description: 'Help with listings, pricing, or payouts',
    emailSubject: 'Selling Support'
  },
  {
    icon: '👤',
    title: 'My Account',
    description: 'Login problems, profile settings, or security concerns',
    emailSubject: 'Account Support'
  },
  {
    icon: '🔧',
    title: 'Technical Issue',
    description: 'Something on the platform not working as expected',
    emailSubject: 'Technical Support'
  }
];

const ContactSupport = () => {
  return (
    <section className={styles.support}>
      <div className="container-xl">
        <div className={styles.sectionHeader}>
          <h2>What Do You Need Help With?</h2>
          <p>Click a category to send us a pre-filled email</p>
        </div>
        <div className="row g-4 g-lg-5 justify-content-center">
          {categories.map((cat, index) => (
            <div key={index} className="col-12 col-md-6">
              <a
                href={`mailto:reticket3@gmail.com?subject=${encodeURIComponent(cat.emailSubject)}`}
                className={`${styles.supportCard} h-100`}
              >
                <div className={styles.supportIcon}>{cat.icon}</div>
                <h3 className={styles.supportTitle}>{cat.title}</h3>
                <p className={styles.supportDesc}>{cat.description}</p>
                <span className={styles.supportArrow}>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;
