import type { CardProps } from '../../../utils/interfaces';
import Button from '../button/Button';
import Badge from '../badge/Badge';
import style from './Card.module.css';
import { toDateFromUnix } from '../../../utils/dateTime';
import { LuCalendar, LuMapPin } from 'react-icons/lu';

const formatCardDate = (value?: number) => {
    if (typeof value !== 'number') {
        return '';
    }

    const date = toDateFromUnix(value);
    if (!date) {
        return '';
    }

    const datePart = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
    const timePart = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });

    return `${datePart} · ${timePart}`;
};

const formatCardPrice = (value?: number) => {
    if (typeof value !== 'number') {
        return '';
    }

    return value === 0 ? 'Free' : `From ${value.toFixed(0)} Ft`;
};

const Card = ({category, basePrice, title, description, imageUrl, buttonText, link, onClick, eventDate, city, country, isFeatured}: CardProps) => {
    const formattedPrice = formatCardPrice(basePrice);
    const formattedDate = formatCardDate(eventDate);
    const formattedLocation = [city, country].filter(Boolean).join(', ');

    return (
        <div className="col">
            <div className={`card ${style['card']}`} onClick={onClick}>
                {imageUrl && (
                    <div className={style['card-image-wrapper']}>
                        <img src={imageUrl} className={style['card-image']} alt={title} />
                        {isFeatured && (
                            <div className={style['featured-badge']}>
                                <Badge text="Featured" />
                            </div>
                        )}
                    </div>
                )}
                <div className="card-body mx-2">
                    <div className={`${style['card-meta-row']} d-flex justify-content-between align-items-center gap-2`}>
                        {category ? <Badge text={category} /> : <span />}
                        {formattedPrice ? <span className={style['card-price']}>{formattedPrice}</span> : <span />}
                    </div>
                    <h5 className={`card-title ${style['card-title']}`}>{title}</h5>
                    <p className={style['card-description']}>{description}</p>
                    {formattedDate && (
                        <div className={style['card-row']}>
                            <LuCalendar className={style['card-icon']} />
                            <span>{formattedDate}</span>
                        </div>
                    )}
                    {formattedLocation && (
                        <div className={style['card-row']}>
                            <LuMapPin className={style['card-icon']} />
                            <span>{formattedLocation}</span>
                        </div>
                    )}
                    <div className={`${style['card-footer']} m-0`}>
                        <Button text={buttonText || "missing_button_text_variable"} link={link} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;