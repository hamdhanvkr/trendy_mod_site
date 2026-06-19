import React from 'react';
import { Truck, ShieldCheck, Clock, RotateCcw } from 'lucide-react';

export const ProductBenefits = React.memo(() => {

    const benefits = [
        { icon: Truck, label: 'Free Shipping', subLabel: 'On all orders', color: 'blue' },
        { icon: ShieldCheck, label: 'Quality Assured', subLabel: 'Premium materials', color: 'emerald' },
        { icon: Clock, label: 'Fast Delivery', subLabel: '2-4 business days', color: 'amber' },
        { icon: RotateCcw, label: 'Easy Returns', subLabel: '7-day policy', color: 'purple' }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80">
            {benefits.map(({ icon: Icon, label, subLabel, color }) => (
                <div
                    key={label}
                    className={`text-center p-2.5 bg-${color}-50/50 border border-${color}-100/50 rounded-xl hover:bg-${color}-50 transition-colors`}
                >
                    <Icon size={16} className={`text-${color}-600 mx-auto mb-1`} />
                    <p className="text-xs font-bold text-slate-800">{label}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{subLabel}</p>
                </div>
            ))}
        </div>
    );
});

ProductBenefits.displayName = 'ProductBenefits';