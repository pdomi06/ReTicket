import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import type { IReview } from "../../../utils/interfaces";
import styles from "./Reviews.module.css";
import { apiFetch } from "../../../lib/apiFetch";
import { usePageLoading } from "../../../contexts/loading/LoadingContext";
import Modal from "../../../components/ui/modal/Modal";
import Select from "../../../components/ui/select/Select";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/ui/input/Input";
import { toDateFromUnix } from "../../../utils/dateTime";

const formatDateTime = (value: string | number | null | undefined) => {
    const date = toDateFromUnix(value);
    if (!date || date.getTime() <= 0) return "-";
    return date.toLocaleString();
};

const Reviews = () => {
    const trackPageLoading = usePageLoading();
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [filters, setFilters] = useState({
        query: "",
        visibility: "",
        rating: "",
    });

    useEffect(() => {
        const loadReviewsPromise = (async () => {
            try {
                const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/reviews`);
                if (!response.ok) throw new Error("Failed to fetch reviews");

                const payload = await response.json();
                const parsedReviews = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.data)
                        ? payload.data
                        : [];

                setReviews(parsedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        })();

        void trackPageLoading(loadReviewsPromise);
    }, [trackPageLoading]);

    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => {
            const query = filters.query.trim().toLowerCase();
            const queryMatches =
                !query ||
                review.reviewerName.toLowerCase().includes(query) ||
                review.title.toLowerCase().includes(query) ||
                review.comment.toLowerCase().includes(query);

            const visibilityMatches =
                !filters.visibility ||
                (filters.visibility === "visible" && review.isVisible) ||
                (filters.visibility === "hidden" && !review.isVisible);

            const ratingMatches = !filters.rating || String(review.rating) === filters.rating;

            return queryMatches && visibilityMatches && ratingMatches;
        });
    }, [reviews, filters]);

    const isFiltered = filters.query || filters.visibility || filters.rating;

    const handleClearFilters = () => {
        setFilters({ query: "", visibility: "", rating: "" });
    };

    const handleVisibilityUpdate = useCallback(async (reviewId: number, isVisible: boolean) => {
        setUpdatingId(reviewId);
        try {
            const response = await apiFetch(`${import.meta.env.VITE_API_BASE_URL}/reviews/${reviewId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVisible }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to update visibility");
            }

            setReviews((prev) => prev.map((review) => (
                review.id === reviewId
                    ? { ...review, isVisible }
                    : review
            )));
        } catch (error) {
            console.error("Error updating review visibility:", error);
            alert(error instanceof Error ? error.message : "Failed to update review visibility");
        } finally {
            setUpdatingId(null);
        }
    }, []);

    const reviewsById = useMemo(() => {
        const reviewsMap = new Map<number, IReview>();
        filteredReviews.forEach((review) => {
            reviewsMap.set(review.id, review);
        });
        return reviewsMap;
    }, [filteredReviews]);

    const handleVisibilityToggleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const reviewId = Number(event.currentTarget.dataset.reviewId);
        if (!Number.isFinite(reviewId)) {
            return;
        }

        void handleVisibilityUpdate(reviewId, event.currentTarget.checked);
    }, [handleVisibilityUpdate]);

    const handleViewReviewClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const reviewId = Number(event.currentTarget.dataset.reviewId);
        if (!Number.isFinite(reviewId)) {
            return;
        }

        setSelectedReview(reviewsById.get(reviewId) ?? null);
    }, [reviewsById]);

    return (
        <div className={styles.reviewsContainer}>
            <div className={styles.headerSection}>
                <h1>Reviews</h1>
            </div>

            <div className={styles.filtersSection}>
                <div className={styles.filterGroup}>
                    <div className={styles.searchField}>
                        <Input
                            type="text"
                            label="Search reviews"
                            name="query"
                            value={filters.query}
                            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                            theme="dark"
                            size="medium"
                        />
                    </div>

                    <div className={styles.visibilityField}>
                        <Select
                            label="All Visibility"
                            name="visibility"
                            value={filters.visibility}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters((prev) => ({ ...prev, visibility: e.target.value }))}
                            theme="dark"
                            size="medium"
                        >
                            <option value="">All Visibility</option>
                            <option value="visible">Visible</option>
                            <option value="hidden">Hidden</option>
                        </Select>
                    </div>

                    <div className={styles.ratingField}>
                        <Select
                            label="All Ratings"
                            name="rating"
                            value={filters.rating}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters((prev) => ({ ...prev, rating: e.target.value }))}
                            theme="dark"
                            size="medium"
                        >
                            <option value="">All Ratings</option>
                            <option value="5">5</option>
                            <option value="4">4</option>
                            <option value="3">3</option>
                            <option value="2">2</option>
                            <option value="1">1</option>
                        </Select>
                    </div>

                    {isFiltered && (
                        <div>
                            <Button text="Clear" variant="outline" onClick={handleClearFilters} />
                        </div>
                    )}
                </div>
                <p className={styles.resultCount}>
                    Showing {filteredReviews.length} of {reviews.length} reviews
                </p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Reviewer</th>
                            <th>Rating</th>
                            <th>Title</th>
                            <th>Visibility</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReviews.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    {reviews.length === 0 ? "No reviews found" : "No reviews match your filters"}
                                </td>
                            </tr>
                        ) : (
                            filteredReviews.map((review) => (
                                <tr key={review.id}>
                                    <td>{review.reviewerName}</td>
                                    <td>{review.rating}/5</td>
                                    <td>{review.title}</td>
                                    <td>
                                        <div className={styles.visibilityToggleWrap}>
                                            <input
                                                type="checkbox"
                                                className={styles.toggle}
                                                data-review-id={review.id}
                                                checked={review.isVisible}
                                                onChange={handleVisibilityToggleChange}
                                                aria-label={`Set visibility for review ${review.id}`}
                                                disabled={updatingId === review.id}
                                            />
                                            <span className={styles.toggleLabel}>
                                                {review.isVisible ? "Visible" : "Hidden"}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{formatDateTime(review.created_at)}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button
                                                className={styles.iconButton}
                                                data-review-id={review.id}
                                                onClick={handleViewReviewClick}
                                                title="View message"
                                            >
                                                👁
                                            </button>
                                            {updatingId === review.id && <span className={styles.updatingText}>Saving...</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={!!selectedReview}
                onClose={() => setSelectedReview(null)}
                title={selectedReview ? `Review by ${selectedReview.reviewerName}` : "Review"}
                size="md"
            >
                {selectedReview && (
                    <div className={styles.messageModal}>
                        <div><strong>Title:</strong> {selectedReview.title}</div>
                        <div><strong>Rating:</strong> {selectedReview.rating}/5</div>
                        <div><strong>Visibility:</strong> {selectedReview.isVisible ? "Visible" : "Hidden"}</div>
                        <div><strong>Message:</strong></div>
                        <p className={styles.commentText}>{selectedReview.comment}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Reviews;