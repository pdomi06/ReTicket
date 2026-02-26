import style from './Select.module.css';
import type { SelectProps } from '../../../utils/interfaces';

const Select: React.FC<SelectProps> = ({
    children,
    label = "missing_label",
    name,
    value,
    onChange,
    theme,
    size
}: SelectProps) => {
    return (
        <div>
            <select
                className={
                    style['form-select'] +
                    (theme && style[theme] ? ` ${style[theme]}` : '') +
                    (size && style[`size-${size}`] ? ` ${style[`size-${size}`]}` : '')
                }
                aria-label={label}
                name={name}
                value={value}
                onChange={onChange}
            >
                {children}
            </select>
        </div>
    );
}

export default Select;