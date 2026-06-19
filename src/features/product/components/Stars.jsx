import React from 'react';
import { Star } from 'lucide-react';

export const Stars = React.memo(({ rating }) => {
    return (
        <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={14}
                    className={`${star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200'
                        } transition-colors duration-200`}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
});

Stars.displayName = 'Stars';