import { Link } from 'react-router';
import styles from './About.module.css';

const AboutCTA = () => {
	return (
		<section className={styles.cta}>
			<div className="container">
				<div className={styles.ctaContent}>
					<h2 className={styles.ctaTitle}>Join Us</h2>
					<p className={styles.ctaSubtext}>
						Whether you're buying your first ticket or selling a spare, you deserve a platform that has your back.
					</p>
					<p className={styles.ctaTagline}>Buy. Sell. Enter. With confidence.</p>
					<div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-center gap-3 mb-4 mb-md-5">
						<Link to="/browse" className={`${styles.ctaPrimary} w-100 w-md-auto`}>
							Explore Events
						</Link>
						<Link to="/register" className={`${styles.ctaSecondary} w-100 w-md-auto`}>
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
			</div>
		</section>
	);
};

export default AboutCTA;
