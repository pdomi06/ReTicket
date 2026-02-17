import type { TextareaProps } from '../../../utils/interfaces';
import styles from './Textarea.module.css';

const Textarea = ({ label, name, value, rows = 4, theme = "dark", onChange }: TextareaProps) => {
    if (theme === 'dark') {
        return (
            <div className={`${styles['textarea-group']} ${styles.floating} ${styles.dark}`}>
                <textarea
                    name={name}
                    id={name}
                    placeholder=" "
                    value={value}
                    rows={rows}
                    onChange={onChange}
                />
                <label htmlFor={name}>{label}</label>
            </div>
        );
    }
    return (
        <div className={`${styles['textarea-group']} ${styles.floating} ${styles.light}`}>
            <textarea
                name={name}
                id={name}
                placeholder=" "
                value={value}
                rows={rows}
                onChange={onChange}
            />
            <label htmlFor={name}>{label}</label>
        </div>
    );
};

export default Textarea;
