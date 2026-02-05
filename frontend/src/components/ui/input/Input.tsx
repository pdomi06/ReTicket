import styles from './Input.module.css';

interface InputProps {
    type?: string;
    label: string;
    name: string;
    value?: string | number;
    step?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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
