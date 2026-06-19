// utils/analytics.js
export function trackEvent(eventName, properties = {}) {
    // Check if tracking is enabled
    if (typeof window === 'undefined') return;
    
    // Example: Google Analytics
    if (window.gtag) {
        window.gtag('event', eventName, {
            ...properties,
            timestamp: new Date().toISOString()
        });
    }
    
    // Example: Custom analytics
    console.log(`[Analytics] ${eventName}:`, properties);
}

export function trackPageView(page, properties = {}) {
    if (typeof window === 'undefined') return;
    
    if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
            page_path: page,
            ...properties
        });
    }
}