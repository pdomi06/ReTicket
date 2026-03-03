import Button from '../../components/ui/button/Button';
import styles from './Vendor.module.css';

const VendorCTA = () => {
    return (
        <section className={styles.cta}>
            <div className={styles.ctaContent}>
                <h2>Ready to Start Selling?</h2>
                <p>
                    Join thousands of vendors earning money by reselling tickets on ReTicket.
                    Sign up today and list your first tickets within minutes.
                </p>
                <div className={`${styles.ctaButtons} row`}>
                    <div className="col">
                        <Button text='Create Vendor Account' link='/register'/>
                    </div>
                    <div className="col">
                        <Button text='Contact Sales' variant='outline' link='/contact'/>
                    </div>
                </div>
                <p className={styles.ctaFooter}>
                    No credit card required. 30-minute onboarding. Start selling today.
                </p>
            </div>
        </section>
    );
};

export default VendorCTA;
