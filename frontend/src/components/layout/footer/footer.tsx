import { Link } from 'react-router';
import logo from '../../../assets/logo_transparrent_white.svg';
import styles from './footer.module.css';

const Footer = () => {

  return (
    <footer className={styles.footer}>
        <div className={styles['footer-left']}>
            
            <div className={styles['footer-logo']}>
                <img src={logo} width="150" />
                <h2>ReTicket</h2>
            </div>
            
            <p>Copyright &copy;
                <span id={styles['year']}>
                    <script>
                        document.getElementById('year').textContent = new Date().getFullYear();
                    </script>
                </span>
                ReTicket. All rights reserved.
            </p>

            <div className={styles['footer-links']}>
                <Link to="/privacy">Privacy Policy</Link> |
                <Link to="/about">About Us</Link> |
                <Link to="/contact">Contact</Link> |
                <Link to="/terms">Terms of Service</Link>
            </div>
        </div>
        <div className={styles['footer-right']}>

            <h3>Have questions or feedback?</h3>
            <p>Send us a Message</p>

            <form className={styles['footer-form']} id={styles['footer-contact-form']}>
                <div className={styles['form-group']}>
                    <label htmlFor="footer-email">Email Address</label>
                    <input type="email" id={styles['footer-email']} name="email" placeholder="Email" required />
                </div>

                <div className={styles['form-group']}>
                    <label htmlFor="footer-message">Your Message</label>
                    <textarea id={styles['footer-message']} name="message" rows={4} placeholder="How can we help?"
                        required></textarea>
                </div>

                <button type="submit" className={styles['submit-btn']}>
                    Send Message
                </button>

                <div className={styles['form-note']}>
                    <p> We'll respond within 24 hours</p>
                </div>
            </form>
        </div>

    </footer>

  );
}

export default Footer;