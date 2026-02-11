import type { InputProps } from '../../../utils/interfaces';
import styles from './Input.module.css';

const Input = ({ type = 'text', label, name, value, step, theme = 'light', onChange }: InputProps) => {
    if (theme === 'light') {
        return (
            <div className={`${styles['input-group']} ${styles.floating} ${styles['input-light']}`}>
                <input
                    type={type}
                    name={name}
                    id={name}
                    placeholder=" "
                value={value}
                step={step}
                onChange={onChange}
            />
            <label htmlFor={name}>{label}</label>
        </div>
        );
    }
    return (
        <div className={`${styles['input-group']} ${styles.floating} ${styles['input-dark']}`}>
            <input
                type={type}
                name={name}
                id={name}
                placeholder=" "
                value={value}
                step={step}
                onChange={onChange}
            />
            <label htmlFor={name}>{label}</label>
        </div>
    );
};

export default Input;
