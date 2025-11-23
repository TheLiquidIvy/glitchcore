import React from 'react';
import '../styles/ProductReviews.css';

const ProductReviews = ({ productId }) => {
  const reviews = [
    { id: 1, author: 'CyberUser42', rating: 5, text: 'ABSOLUTELY GLITCHY! Best purchase ever! 🔥', date: '2024-11-18' },
    { id: 2, author: 'NeonVibe', rating: 5, text: 'The quality is insane. Exceeded expectations!', date: '2024-11-16' },
    { id: 3, author: 'TechNinja', rating: 4, text: 'Great product, delivery was super fast.', date: '2024-11-14' },
  ];

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="product-reviews">
      <h3 className="reviews-title">CUSTOMER REVIEWS</h3>
      
      <div className="rating-summary">
        <div className="rating-display">
          <div className="stars">
            {'★'.repeat(Math.floor(avgRating))}
            <span className="empty-stars">{'☆'.repeat(5 - Math.floor(avgRating))}</span>
          </div>
          <p className="rating-text">{avgRating} out of 5 ({reviews.length} reviews)</p>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <span className="reviewer-name">{review.author}</span>
              <span className="review-date">{review.date}</span>
            </div>
            <div className="review-stars">
              {'★'.repeat(review.rating)}<span className="empty-stars">{'☆'.repeat(5 - review.rating)}</span>
            </div>
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductReviews;
