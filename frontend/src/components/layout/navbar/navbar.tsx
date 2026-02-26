import { Link } from 'react-router';
import styles from './navbar.module.css';

const logo = '/img/logo/logo_transparrent_white.svg';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.brand}>
                <img src={logo} alt="Logo" />
                <span>ReTicket</span>
            </Link>
            <div className={styles['links']}>
            <Link to="/about" className={styles['navbar-about']}>About Us</Link>
            <Link to="/vendor" className={styles['navbar-vendor']}>Start selling</Link>
            </div>
        </nav>
    );
}

export default Navbar;