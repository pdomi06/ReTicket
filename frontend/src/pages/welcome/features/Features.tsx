import style from './Features.module.css';
import ShieldIcon from '@mui/icons-material/Shield';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import BoltIcon from '@mui/icons-material/Bolt';

const Features = () => {
    return (
        <section className={`${style['features']} container-fluid mt-5 mx-0`}>
            <h2 className="text-center mb-5">Why Choose ReTicket?</h2>
            <div className="container">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    <div className={style['feature-item']}>
                        <div className={style['feature-icon']}>
                            <ShieldIcon style={{ fontSize: '2.2rem' }} />
                        </div>
                        <h4 className={style['feature-title']}>Safe & Secure</h4>
                        <p>Protect yourself from scams with our verified marketplace and secure payment system.</p>
                    </div>
                    <div className={style['feature-item']}>
                        <div className={style['feature-icon']}>
                            <ModeCommentIcon style={{ fontSize: '2.2rem' }} />
                        </div>
                        <h4 className={style['feature-title']}>Easy Communication</h4>
                        <p>Connect directly with sellers and buyers with our integrated messaging system.</p>
                    </div>
                    <div className={style['feature-item']}>
                        <div className={style['feature-icon']}>
                            <EmojiEmotionsIcon style={{ fontSize: '2.2rem' }} />
                        </div>
                        <h4 className={style['feature-title']}>Community Verified</h4>
                        <p>Browse ratings and reviews from real users to make confident decisions.</p>
                    </div>
                    <div className={style['feature-item']}>
                        <div className={style['feature-icon']}>
                            <BoltIcon style={{ fontSize: '2.2rem' }} />
                        </div>
                        <h4 className={style['feature-title']}>Simple & Fast</h4>
                        <p>List your tickets in minutes and start selling. No hidden fees or complications.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;