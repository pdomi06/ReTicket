import styles from './Contact.module.css';

interface Channel {
  icon: string;
  label: string;
  value: string;
  href: string;
  note: string;
}

const channels: Channel[] = [
  {
    icon: '✉️',
    label: 'Email',
    value: 'support@reticket.com',
    href: 'mailto:support@reticket.com',
    note: 'We typically respond within 24 hours'
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+36 1 234 5678',
    href: 'tel:+3612345678',
    note: 'Available Monday - Friday, 9:00 - 17:00 CET'
  }
];

const ContactChannels = () => {
  return (
    <section className={styles.channels}>
      <div className={styles.sectionHeader}>
        <h2>Contact Us Directly</h2>
        <p>Choose the channel that works best for you</p>
      </div>
      <div className={styles.channelsGrid}>
        {channels.map((channel) => (
          <div key={channel.label} className={styles.channelCard}>
            <div className={styles.channelIcon}>{channel.icon}</div>
            <h3 className={styles.channelLabel}>{channel.label}</h3>
            <a href={channel.href} className={styles.channelValue}>
              {channel.value}
            </a>
            <p className={styles.channelNote}>{channel.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactChannels;
