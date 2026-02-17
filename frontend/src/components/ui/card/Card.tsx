import type { CardProps } from '../../../utils/interfaces';
import Button from '../button/Button';
import style from './Card.module.css';

const Card = ({ title, description, imageUrl, onClick }: CardProps) => {
    return (
        <div className="col">
            <div className={`card ${style['card']}`} onClick={onClick}>
                {imageUrl && <img src={imageUrl} className={style['card-image']} alt={title} />}
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className={style['card-description']}>{description}</p>
                    <div className={`${style['card-footer']} m-0`}>
                        <Button text="View Details" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;