import type { ButtonProps } from "../../../utils/interfaces";
import styles from './Button.module.css';

const Button = ({ type, text }: ButtonProps) => {
    return (
        <button type={type} className={styles.button}>{text}</button>
    )
}
export default Button;