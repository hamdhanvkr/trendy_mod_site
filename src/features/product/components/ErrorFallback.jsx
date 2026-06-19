import { AlertCircle } from 'lucide-react';

export const ErrorFallback = ({ error, onRetry }) => (
    <div className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full text-center py-12 bg-red-50 rounded-2xl border border-red-200">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-700 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md shadow-red-600/20"
                >
                    Try Again
                </button>
            )}
        </div>
    </div>
);