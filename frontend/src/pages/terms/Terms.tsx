import styles from './terms.module.css';

interface TermsSection {
  title: string;
  content: string;
}

const sections: TermsSection[] = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using ReTicket, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.'
  },
  {
    title: '2. What ReTicket Does',
    content:
      'ReTicket is a secure ticket resale platform. When a ticket is resold, the original ticket is invalidated and a new one with a unique QR code is issued to the buyer. This makes fraud structurally impossible on our platform.'
  },
  {
    title: '3. User Accounts',
    content:
      'You must create an account to buy or sell tickets. You are responsible for keeping your login credentials secure. You must provide accurate information when registering.'
  },
  {
    title: '4. Buying Tickets',
    content:
      'All ticket purchases are final. Because every ticket is guaranteed valid through our regeneration system, we do not offer refunds. If a technical issue occurs on our end, contact support@reticket.com.'
  },
  {
    title: '5. Selling Tickets',
    content:
      'By listing a ticket, you confirm you are the legitimate owner. Once a ticket is sold, your copy is permanently invalidated. Attempting to reuse or duplicate a sold ticket is a violation of these terms.'
  },
  {
    title: '6. Payments',
    content:
      'All payments are processed securely through Stripe. ReTicket does not store your card details. Seller payouts are issued on a 7-day cycle after a confirmed sale.'
  },
  {
    title: '7. Prohibited Behaviour',
    content:
      'You may not use ReTicket to commit fraud, list fake tickets, abuse the platform, or attempt to bypass our security systems. Violations will result in immediate account termination.'
  },
  {
    title: '8. Limitation of Liability',
    content:
      'ReTicket is provided as-is for educational purposes. We are not liable for losses arising from misuse of the platform or third-party service outages.'
  },
  {
    title: '9. Changes to These Terms',
    content:
      'We may update these terms at any time. Continued use of ReTicket after changes are posted means you accept the updated terms.'
  },
  {
    title: '10. Contact',
    content:
      'For questions about these terms, contact us at support@reticket.com.'
  }
];

const Terms = () => {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleString('default', { month: 'long' })} 2026</p>
          <p className={styles.intro}>
            Please read these terms carefully before using ReTicket. By using
            our platform you agree to the following.
          </p>
        </div>
        <div className={styles.sections}>
          {sections.map((section, index) => (
            <div key={index} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.sectionContent}>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Terms;
