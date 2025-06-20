// components/StarRating.tsx
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-500 inline" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500 inline" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-500 inline" />);
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

export default StarRating;
