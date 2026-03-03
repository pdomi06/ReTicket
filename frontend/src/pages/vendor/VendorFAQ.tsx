import { useState } from 'react';
import styles from './Vendor.module.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const VendorFAQ = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'How do I get started as a vendor?',
      answer: 'Simply sign up for a vendor account, complete your profile, and you\'re ready to start listing tickets. Our onboarding process takes just a few minutes.'
    },
    {
      id: 2,
      question: 'What are the commission fees?',
      answer: 'We charge a transparent 8-15% commission depending on your sales volume and ticket category. Higher volume sellers get better rates.'
    },
    {
      id: 3,
      question: 'How quickly can I get paid?',
      answer: 'We process payouts every 7 days to your preferred payment method. You can track payment status in your dashboard.'
    },
    {
      id: 4,
      question: 'What tickets can I sell?',
      answer: 'You can sell tickets for concerts, sports, theater, festivals, and other live events. All tickets must be legitimate and legally obtained.'
    },
    {
      id: 5,
      question: 'How do you handle buyer protection?',
      answer: 'Every ticket sold on ReTicket is protected by our buyer guarantee. If any issue arises, we work with both parties to ensure satisfaction.'
    },
    {
      id: 6,
      question: 'Can I set my own prices?',
      answer: 'Yes, you have complete control over pricing. We provide market insights to help you price competitively.'
    },
    {
      id: 7,
      question: 'What if a ticket doesn\'t sell?',
      answer: 'Tickets don\'t expire on ReTicket. You can adjust prices anytime, relist, or remove them at your discretion.'
    },
    {
      id: 8,
      question: 'Is there a monthly fee?',
      answer: 'No monthly fees. You only pay our commission on successful sales. List as many tickets as you want for free.'
    }
  ];

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className={styles.faq}>
      <div className={styles.sectionHeader}>
        <h2>Frequently Asked Questions</h2>
        <p>Got questions? We\'ve got answers</p>
      </div>
      <div className={styles.faqContainer}>
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className={`${styles.faqItem} ${activeId === faq.id ? styles.active : ''}`}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => toggleFAQ(faq.id)}
            >
              <span>{faq.question}</span>
              <span className={styles.faqIcon}>
                {activeId === faq.id ? '−' : '+'}
              </span>
            </button>
            {activeId === faq.id && (
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default VendorFAQ;
