import { Link } from 'react-router';
import Input from '../../ui/input/Input';
import Textarea from '../../ui/textarea/Textarea';
import styles from './footer.module.css';
import Button from '../../ui/button/Button';

const logo = '/img/logo/logo_transparrent_white.svg';

const Footer = () => {

  return (
    <footer className={styles.footer}>
        <div className={styles['footer-left']}>
            
            <div className={styles['footer-logo']}>
                <img src={logo} width="150" />
                <h2>ReTicket</h2>
            </div>
            
            <p>Copyright &copy;{" "}
                <span className={styles['year']}>
                    {new Date().getFullYear()}
                </span>{" "}
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
                <Input type="email" name="footer-email" label="Email Address" theme="dark"/>

                <Textarea name="footer-message" label="Your Message" rows={4} theme="dark" />

                <Button type="submit" text="Send Message"/>

                <div className={styles['form-note']}>
                    <p> We'll respond within 24 hours</p>
                </div>
            </form>
        </div>

    </footer>

  );
}

export default Footer;