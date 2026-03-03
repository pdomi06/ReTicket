import { Link } from "react-router";
import type { ButtonProps } from "../../../utils/interfaces";
import styles from './Button.module.css';

const Button = ({ type = "button", text, link, variant = "primary" }: ButtonProps) => {
    const buttonClass = `${styles.button} ${styles[variant]}`;
    if (link) {
        return (
            <div className={styles['button-link']}>
            <Link to={link} className={buttonClass}>{text}</Link>
            </div>
        );
    }
    return (
        <button type={type} className={buttonClass}>{text}</button>
    )
}
export default Button;