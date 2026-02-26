import style from './Select.module.css';
import type { SelectProps } from '../../../utils/interfaces';

const Select: React.FC<SelectProps> = ({ child, label = "missing_label", theme, size }: SelectProps) => {
    return (
        <div>
            <select className={style['form-select'] + (theme ? ` ${theme}` : '') + (size ? ` size-${size}` : '')} aria-label={label}>
                {child}
            </select>
        </div>
    );
}

export default Select;