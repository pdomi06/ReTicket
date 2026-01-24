import { Link } from 'react-router';
import logo from '../../../assets/logo_transparrent_white.svg';
import styles from './navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <Link to="/"><img src={logo} alt="Logo" /></Link>
            <div className={styles['links']}>
            <Link to="/about" className={styles['navbar-about']}>About Us</Link>
            <Link to="/vendor" className={styles['navbar-vendor']}>Start selling</Link>
            </div>
        </nav>
    );
}

export default Navbar;