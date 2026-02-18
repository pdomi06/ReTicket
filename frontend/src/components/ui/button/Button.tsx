import { Link } from "react-router";
import type { ButtonProps } from "../../../utils/interfaces";
import styles from './Button.module.css';

const Button = ({ type = "button", text, link }: ButtonProps) => {
    if (link) {
        return (
            <div className={styles['button-link']}>
            <Link to={link} className={styles.button}>{text}</Link>
            </div>
        );
    }
    return (
        <button type={type} className={styles.button}>{text}</button>
    )
}
export default Button;