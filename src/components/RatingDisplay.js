// frontend/src/components/RatingDisplay.js
import React from 'react';

// Make sure this component is actually used in App.js or ResultsDisplay.js
// If it's inside ResultsDisplay, these styles might need to be adjusted
// based on where it's placed.

function RatingDisplay({ rating }) {
  // Handle edge case where rating might be null/undefined during loading/error states
  if (rating === null || rating === undefined) {
      // Optionally return a placeholder or null
      // return <div className="rating-display-wrapper"><h3>Score</h3><p>-</p></div>;
      return null;
  }


  const getColor = (r) => {
    if (r < 40) return '#e74c3c'; // Red
    if (r < 75) return '#f39c12'; // Orange
    return '#2ecc71'; // Green
  };

  // Add className="rating-display-wrapper" to the outer div
  return (
    <div className="rating-display-wrapper">
      {/* You can add a title here if needed, or style it via the parent component */}
       <h3>Resume Score</h3>
      {/* Add className="rating-value" to the score paragraph */}
      <p className="rating-value" style={{ color: getColor(rating) }}>
        {rating}%
      </p>
      {/* Add className="rating-ready" to the status paragraph */}
      {rating >= 75 && <p className="rating-ready" style={{ color: getColor(rating) }}>Ready to apply!</p>}
    </div>
  );
}

export default RatingDisplay;