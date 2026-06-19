import React from 'react';
import { Award, ShieldCheck, ThumbsUp, Gift } from 'lucide-react';

export const ProductHighlights = React.memo(() => {

    const highlights = [
        { icon: Award, label: 'Premium Quality', color: 'emerald' },
        { icon: ShieldCheck, label: 'Certified Safe', color: 'blue' },
        { icon: ThumbsUp, label: 'Top Rated', color: 'amber' },
        { icon: Gift, label: 'Gift Ready', color: 'purple' }
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {highlights.map(({ icon: Icon, label, color }) => (
                <div
                    key={label}
                    className={`flex items-center gap-2 text-xs sm:text-sm bg-${color}-50/60 border border-${color}-100/50 p-2 rounded-lg transition-all hover:bg-${color}-50`}
                >
                    <Icon size={15} className={`text-${color}-600 shrink-0`} />
                    <span className={`text-${color}-800 font-semibold`}>{label}</span>
                </div>
            ))}
        </div>
    );
});

ProductHighlights.displayName = 'ProductHighlights';