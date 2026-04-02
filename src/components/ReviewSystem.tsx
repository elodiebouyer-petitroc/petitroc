import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquare, User, Calendar } from 'lucide-react';
import { Review } from '../types';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  size = 16, 
  interactive = false,
  onRatingChange 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isActive = (hoverRating || rating) >= starValue;
        
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRatingChange?.(starValue)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-transform active:scale-90`}
          >
            <Star 
              size={size} 
              className={`${isActive ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} 
            />
          </button>
        );
      })}
    </div>
  );
};

interface ReviewFormProps {
  adId: string;
  targetUserId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ adId, targetUserId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-black text-gray-900 mb-4">Laisser un avis</h3>
      
      <div className="mb-4">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Note</label>
        <StarRating 
          rating={rating} 
          interactive 
          size={24} 
          onRatingChange={setRating} 
        />
      </div>

      <div className="mb-6">
        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Commentaire</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment s'est passé l'échange ?"
          className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 min-h-[100px] text-sm"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-6 rounded-xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Envoi...' : 'Publier'}
        </button>
      </div>
    </form>
  );
};

interface ReviewListProps {
  reviews: Review[];
  title?: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, title = "Avis récents" }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
        <MessageSquare className="mx-auto text-gray-300 mb-3" size={32} />
        <p className="text-gray-500 font-medium">Aucun avis pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
        {title}
        <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {reviews.length}
        </span>
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        {reviews.map((review) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{review.reviewerName}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                    <Calendar size={10} />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} size={14} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {review.comment}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
