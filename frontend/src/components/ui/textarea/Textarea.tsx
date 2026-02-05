import styles from './Textarea.module.css';

interface TextareaProps {
    label: string;
    name: string;
    value?: string;
    rows?: number;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = ({ label, name, value, rows = 4, onChange }: TextareaProps) => {
    return (
        <div className={`${styles['textarea-group']} ${styles.floating}`}>
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
