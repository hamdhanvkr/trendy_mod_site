import { VIEW_MODES } from '../constants';

export const ProductSkeleton = ({ viewMode }) => {

    const isListMode = viewMode === VIEW_MODES.LIST;

    return (
        <div className={`bg-white rounded-md md:rounded-xl border border-slate-200 overflow-hidden ${isListMode ? 'flex flex-row h-40 sm:h-44 lg:h-48' : ''
            }`}>
            <div className={`bg-slate-200 animate-pulse ${isListMode ? 'w-32 sm:w-40 lg:w-48 h-full' : 'aspect-square'
                }`} />
            <div className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-slate-200 rounded animate-pulse" />
                        ))}
                    </div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                    {isListMode && (
                        <div className="mt-2 space-y-1">
                            <div className="h-3 bg-slate-200 rounded w-full animate-pulse" />
                            <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" />
                        </div>
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-5 bg-slate-200 rounded w-16 animate-pulse" />
                        <div className="h-4 bg-slate-200 rounded w-12 animate-pulse" />
                    </div>
                    <div className="w-full mt-2 h-8 bg-slate-200 rounded-md animate-pulse" />
                </div>
            </div>
        </div>
    );
};