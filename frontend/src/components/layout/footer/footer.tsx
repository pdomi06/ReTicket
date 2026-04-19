import { Link } from 'react-router';
import { useState } from 'react';
import Input from '../../ui/input/Input';
import Textarea from '../../ui/textarea/Textarea';
import styles from './footer.module.css';
import Button from '../../ui/button/Button';
import Notification from '../../ui/notification/Notification';

const logo = '/img/logo/logo_transparrent_white.svg';
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api').replace(/\/+$/, '');

const Footer = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formState, setFormState] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormState(null);
        setIsSubmitting(true);

        try {
            const response = await fetch(`${apiBaseUrl}/contact/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email,
                    message,
                    source: 'footer',
                }),
            });
            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorMessage = payload?.message ?? 'Failed to send message. Please try again.';
                setFormState({ type: 'error', text: errorMessage });
                return;
            }

            setFormState({
                type: 'success',
                text: payload?.message ?? 'Thanks for reaching out. We will reply soon.',
            });
            setEmail('');
            setMessage('');
        } catch {
            setFormState({ type: 'error', text: 'Network error. Please try again in a moment.' });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/terms">Terms of Service</Link>
                </div>
            </div>
            <div className={styles['footer-right']}>

                <h3>Have questions or feedback?</h3>
                <p>Send us a Message</p>

                <form className={styles['footer-form']} id={styles['footer-contact-form']} onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        name="footer-email"
                        label="Email Address"
                        theme="dark"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Textarea
                        name="footer-message"
                        label="Your Message"
                        rows={4}
                        theme="dark"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <Button type="submit" text={isSubmitting ? 'Sending...' : 'Send Message'} disabled={isSubmitting} />

                    {formState ? (
                        <Notification text={formState.text} variant={formState.type} />
                    ) : null}

                    <div className={styles['form-note']}>
                        <p> We'll respond within 24 hours</p>
                    </div>
                </form>
            </div>

        </footer>

    );
}

export default Footer;