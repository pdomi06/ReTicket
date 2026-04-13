import Cards from '../../../components/ui/cards/Cards';
import type { IReview } from '../../../utils/interfaces';
import style from './Reviews.module.css';


const Reviews = ({ reviews }: { reviews: IReview[] }) => {
	return (
		<section className={`container my-5 ${style['reviews-section']}`}>
			<h2 className={style['events-title']}>Reviews</h2>
			<p className={style['events-subtitle']}>Real feedback from people using ReTicket</p>
			<Cards maximumcols={3}>
				{reviews.map((review: IReview) => (
					<div key={review.id} className={`col ${style['review-col']}`}>
						<article className={style['review-card']}>
							<div className={style['review-stars']} aria-label={`${review.rating} out of 5 stars`}>
								{[...Array(5)].map((_, index) => (
									<span key={`${review.id}-star-${index}`} className={index < Math.round(review.rating) ? style['star-active'] : style['star-inactive']}>
										★
									</span>
								))}
							</div>
							<p className={style['review-comment']}>"{review.comment}"</p>
							<div className={style['review-footer']}>
								<div className={style['review-avatar']}>
									{review.reviewerName.charAt(0).toUpperCase()}
								</div>
								<div>
									<h5 className={style['review-name']}>{review.reviewerName}</h5>
									<p className={style['review-meta']}>{review.title}</p>
								</div>
							</div>
						</article>
					</div>
				))}
			</Cards>
		</section>
	);
};

export default Reviews;
