
import Button from '../../components/ui/button/Button';
import styles from './Vendor.module.css';

const VendorHero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                    Become a ReTicket Vendor
                </h1>
                <p className={styles.heroSubtitle}>
                    Join thousands of vendors selling tickets on the fastest-growing resale platform
                </p>
                <div className={`${styles.heroButtons} row`}>
                    <div className="col">
                        <Button text="Start Selling Today" variant="primary" />
                    </div>
                    <div className="col">
                        <Button text="Learn More" variant="outline" />
                    </div>
                </div>
            </div>
            <div className={styles.heroImage}>
                <img src="https://i.imgur.com/KORoZZF.png" alt="Vendor selling tickets" />
            </div>
        </section>
    );
};

export default VendorHero;
