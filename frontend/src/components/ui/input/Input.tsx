import type { InputProps } from '../../../utils/interfaces';
import styles from './Input.module.css';

const Input = ({ type = 'text', label, name, value, min, step, theme = "dark", size = "medium", onChange }: InputProps) => {
    if (theme === 'dark') {
    return (
        <div className={`${styles['input-group']} ${styles.floating} ${styles.dark} ${size ? styles["size-"+size] : ''}`}>
            <input
                type={type}
                name={name}
                id={name}
                placeholder=" "
                value={value}
                min={min}
                step={step}
                onChange={onChange}
            />
            <label htmlFor={name}>{label}</label>
        </div>
    );
    }
    return (
        <div className={`${styles['input-group']} ${styles.floating} ${styles.light} ${size ? styles["size-"+size] : ''}`}>
            <input
                type={type}
                name={name}
                id={name}
                placeholder=" "
                value={value}
                min={min}
                step={step}
                onChange={onChange}
            />
            <label htmlFor={name}>{label}</label>
        </div>
    );

};

export default Input;
