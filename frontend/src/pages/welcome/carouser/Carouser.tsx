const mockPicture = '/img/mock/music_genre.png';

import type { IEvent } from '../../../utils/interfaces';
import { Link } from 'react-router-dom';
import style from './Carouser.module.css';

const Carouser = ({ events }: { events: IEvent[] }) => {

    return (
        <header className={`${style.carouser} container-fluid my-2`}>
            <div id="carouselExampleCaptions" className="carousel slide">
                <div className="carousel-indicators">
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <button
                                key={`indicator-${event.id}`}
                                type="button"
                                data-bs-target="#carouselExampleCaptions"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : undefined}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))
                    ) : (
                        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    )}
                </div>
                <div className="carousel-inner">
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <div key={event.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <Link to={`/event?event=${event.id}`} className={style['carousel-link']}>
                                    <img src={event.imageUrl || mockPicture} className={`${style['carousel-img']} d-block w-100`} alt={event.name} />
                                    <div className={`carousel-caption ${style['carousel-caption']}`}>
                                        <h5>{event.name}</h5>
                                        <p>{event.description}</p>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="carousel-item active">
                            <img src={mockPicture} className={`${style['carousel-img']} d-block w-100`} alt="No featured events" />
                            <div className={`carousel-caption ${style['carousel-caption']}`}>
                                <h5>No featured events</h5>
                                <p>Check back later for exciting featured events!</p>
                            </div>
                        </div>
                    )}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </header>
    )
};
export default Carouser;