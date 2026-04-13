import React from 'react';
import Cards from '../../../components/ui/cards/Cards';
import type { IReview } from '../../../utils/interfaces';
import style from './Reviews.module.css';


const Reviews = () => {
	const [reviews, setReviews] = React.useState<IReview[]>([]);

	React.useEffect(() => {
		fetchReviews().then(setReviews);
	}, []);
	async function fetchReviews() {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reviews/visible`);
			if (!response.ok) {
				throw new Error(`Failed to fetch reviews: ${response.statusText}`);
			}
			const data = await response.json();

			if (Array.isArray(data)) {
				return data as IReview[];
			}

			if (Array.isArray(data?.reviews)) {
				return data.reviews as IReview[];
			}

			return [];
		} catch (error) {
			console.error('Error fetching reviews:', error);
			return [];
		}
	}
	return (
		<section className={`container my-5 ${style['reviews-section']}`}>
			<h2 className={style['events-title']}>Reviews</h2>
			<p className={style['events-subtitle']}>Real feedback from people using ReTicket</p>
			<Cards maximumcols={5}>
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
