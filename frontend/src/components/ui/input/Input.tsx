import type { InputProps } from '../../../utils/interfaces';
import styles from './Input.module.css';

const Input = ({ type = 'text', label, name, value, step, onChange }: InputProps) => {
    return (
        <div className={`${styles['input-group']} ${styles.floating}`}>
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
