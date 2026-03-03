import styles from './Vendor.module.css';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

const VendorProcess = () => {
  const steps: ProcessStep[] = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up and verify your email. Complete your vendor profile with basic information.'
    },
    {
      number: 2,
      title: 'List Tickets',
      description: 'Add your ticket inventory with details, pricing, and delivery method.'
    },
    {
      number: 3,
      title: 'Get Discovered',
      description: 'Your listings appear in search results and are promoted to interested buyers.'
    },
    {
      number: 4,
      title: 'Make Sales',
      description: 'Buyers purchase tickets from you. You receive notifications for each sale.'
    },
    {
      number: 5,
      title: 'Deliver Tickets',
      description: 'Transfer tickets to buyer using our secure digital platform or physical delivery.'
    },
    {
      number: 6,
      title: 'Get Paid',
      description: 'Receive payouts every 7 days to your bank account or digital wallet.'
    }
  ];

  return (
    <section className={styles.process}>
      <div className={styles.sectionHeader}>
        <h2>How It Works</h2>
        <p>Six simple steps to start selling</p>
      </div>
      <div className={styles.processSteps}>
        {steps.map((step) => (
          <div key={step.number} className={styles.processStep}>
            <div className={styles.stepNumber}>{step.number}</div>
            <div className={styles.stepContent}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            {step.number < steps.length && (
              <div className={styles.stepConnector}></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default VendorProcess;
