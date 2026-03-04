import { Link } from "react-router";
import type { ButtonProps } from "../../../utils/interfaces";
import styles from './Button.module.css';

const Button = ({ type = "button", text, link, variant = "primary", onClick }: ButtonProps) => {
    if (link) {
        return (
            <div className={styles['button-link']}>
            <Link to={link} className={`${styles.button} ${styles[variant]}`}>{text}</Link>
            </div>
        );
    }
    return (
        <button type={type} onClick={onClick} className={`${styles.button} ${styles[variant]}`}>{text}</button>
    )
}
export default Button;