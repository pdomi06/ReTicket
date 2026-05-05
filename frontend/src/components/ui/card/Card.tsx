import type { CardProps } from '../../../utils/interfaces';
import Button from '../button/Button';
import style from './Card.module.css';
import Badge from "../badge/Badge.tsx";

const Card = ({ category, price, title, description, imageUrl, buttonText, link, onClick }: CardProps) => {
    return (
        <div className="col">
            <div className={`card ${style['card']}`} onClick={onClick}>
                {imageUrl && <img src={imageUrl} className={style['card-image']} alt={title} />}
                {category && (
                    <div className={`container-fluid`}>
                        <div className="row mt-2">
                        <div className="col-6">
                            <Badge text={category}/>
                        </div>
                        <div className="col-6">
                            {price && <span className={`${style['card-price']} float-end align-middle`}>From {price} Ft</span>}
                        </div>
                        </div>
                    </div>
                )}
                <div className="card-body mx-2">
                    <h5 className="card-title">{title}</h5>
                    <p className={style['card-description']}>{description}</p>
                    <div className={`${style['card-footer']} m-0`}>
                        <Button text={buttonText || "missing_button_text_variable"} link={link} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;