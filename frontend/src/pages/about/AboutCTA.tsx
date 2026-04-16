import { Link } from 'react-router';
import styles from './About.module.css';

const AboutCTA = () => {
	return (
		<section className={styles.cta}>
			<div className={styles.ctaContent}>
				<h2 className={styles.ctaTitle}>Join Us</h2>
				<p className={styles.ctaSubtext}>
					Whether you're buying your first ticket or selling a spare, you deserve a platform that has your back.
				</p>
				<p className={styles.ctaTagline}>Buy. Sell. Enter. With confidence.</p>
				<div className={styles.ctaButtons}>
					<Link to="/browse" className={styles.ctaPrimary}>
						Explore Events
					</Link>
					<Link to="/register" className={styles.ctaSecondary}>
						Get Started
					</Link>
				</div>
				<p className={styles.ctaContact}>
					Have questions? We're here to help.{' '}
					<Link to="/contact" className={styles.contactLink}>
						Contact us
					</Link>
				</p>
			</div>
		</section>
	);
};

export default AboutCTA;
