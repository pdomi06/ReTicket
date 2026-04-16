import styles from './privacy.module.css';

interface PrivacySection {
  title: string;
  content: string;
}

const sections: PrivacySection[] = [
  {
    title: '1. Introduction',
    content:
      'ReTicket respects your privacy. This policy explains what data we collect, how we use it, and how we keep it safe.'
  },
  {
    title: '2. Data We Collect',
    content:
      'We collect your name, email address, and payment information when you register or make a transaction. We also collect basic usage data such as pages visited and actions taken on the platform.'
  },
  {
    title: '3. How We Use Your Data',
    content:
      'Your data is used to operate your account, process transactions, send ticket confirmations, and provide customer support. We do not sell your data to third parties.'
  },
  {
    title: '4. Payments & Stripe',
    content:
      "Payment processing is handled by Stripe. ReTicket never stores your card number or banking details. Stripe's own privacy policy applies to payment data."
  },
  {
    title: '5. Ticket Data',
    content:
      'Every ticket transfer is logged to ensure validity and prevent fraud. This includes the ticket ID, transfer timestamp, and the accounts involved. This data cannot be deleted as it is part of our fraud-prevention system.'
  },
  {
    title: '6. Cookies',
    content:
      'We use essential cookies to keep you logged in and maintain your session. We do not use tracking or advertising cookies.'
  },
  {
    title: '7. Data Storage & Security',
    content:
      'Your data is stored securely on AWS infrastructure. Access is restricted and all connections are encrypted. We take reasonable measures to protect your information from unauthorized access.'
  },
  {
    title: '8. Your Rights',
    content:
      'You can request to view, correct, or delete your personal data at any time by contacting us at support@reticket.com. Note that ticket transfer logs cannot be deleted for security reasons.'
  },
  {
    title: '9. Changes to This Policy',
    content:
      'We may update this policy occasionally. We will notify you of significant changes via email or a notice on the platform.'
  },
  {
    title: '10. Contact',
    content:
      'For any privacy-related questions, reach us at support@reticket.com.'
  }
];

const lastUpdated = 'April 16, 2026';

const Privacy = () => {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
          <p className={styles.intro}>
            Your privacy matters to us. Here's a straightforward explanation
            of how ReTicket handles your data.
          </p>
        </div>
        <div className={styles.sections}>
          {sections.map((section) => (
            <div key={section.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.sectionContent}>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Privacy;
