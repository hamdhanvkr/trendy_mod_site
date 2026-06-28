import React from 'react';
import { Truck, ShieldCheck, Clock, RotateCcw } from 'lucide-react';

export const ProductBenefits = React.memo(() => {

    const benefits = [
        {
            icon: Truck,
            label: 'Shipping',
            subLabel: 'On all orders',
            color: 'blue',
            bgClass: 'bg-blue-50/50',
            borderClass: 'border-blue-100/50',
            hoverClass: 'hover:bg-blue-50',
            textClass: 'text-blue-600'
        },
        {
            icon: ShieldCheck,
            label: 'Quality Assured',
            subLabel: 'Premium materials',
            color: 'emerald',
            bgClass: 'bg-emerald-50/50',
            borderClass: 'border-emerald-100/50',
            hoverClass: 'hover:bg-emerald-50',
            textClass: 'text-emerald-600'
        },
        {
            icon: Clock,
            label: 'Fast Delivery',
            subLabel: '2-4 business days',
            color: 'amber',
            bgClass: 'bg-amber-50/50',
            borderClass: 'border-amber-100/50',
            hoverClass: 'hover:bg-amber-50',
            textClass: 'text-amber-600'
        },
        {
            icon: RotateCcw,
            label: 'Free Delivery',
            subLabel: 'Order on above 1000',
            color: 'purple',
            bgClass: 'bg-purple-50/50',
            borderClass: 'border-purple-100/50',
            hoverClass: 'hover:bg-purple-50',
            textClass: 'text-purple-600'
        }
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80">
            {benefits.map(({ icon: Icon, label, subLabel, bgClass, borderClass, hoverClass, textClass }) => (
                <div
                    key={label}
                    className={`text-center p-2.5 ${bgClass} border ${borderClass} rounded-xl ${hoverClass} transition-colors`}
                >
                    <Icon size={16} className={`${textClass} mx-auto mb-1`} />
                    <p className="text-xs font-bold text-slate-800">{label}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{subLabel}</p>
                </div>
            ))}
        </div>
    );
});

ProductBenefits.displayName = 'ProductBenefits';