import { Children, isValidElement } from 'react';
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
    const childOptions = Children.toArray(children);
    const firstOption = childOptions[0];
    const firstOptionElement = isValidElement<{ children?: React.ReactNode }>(firstOption) && firstOption.type === 'option'
        ? firstOption
        : null;
    const usesFirstOptionAsLabel = !!firstOptionElement;
    const floatingLabel = firstOptionElement && typeof firstOptionElement.props.children === 'string'
        ? firstOptionElement.props.children
        : label;
    const selectOptions = usesFirstOptionAsLabel ? childOptions.slice(1) : childOptions;
    const hasValue = !!value;

    return (
        <div
            className={
                style['select-group'] +
                ` ${style.floating}` +
                (theme && style[theme] ? ` ${style[theme]}` : '') +
                (size && style[`size-${size}`] ? ` ${style[`size-${size}`]}` : '') +
                (hasValue ? ` ${style['has-value']}` : '')
            }
        >
            <select
                id={name}
                className={style['form-select']}
                aria-label={label}
                name={name}
                value={value}
                onChange={onChange}
            >
                {usesFirstOptionAsLabel && <option value="" disabled hidden />}
                {selectOptions}
            </select>
            <label htmlFor={name}>{floatingLabel}</label>
        </div>
    );
}

export default Select;