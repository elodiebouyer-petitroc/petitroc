/**
 * GA4 Analytics Utility for NGT Academy
 */

export const trackEvent = (eventName: string, properties?: any) => {
  console.log(`[Analytics] Event: ${eventName}`, properties);
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
};

export const trackLeadCapture = (email: string, name: string) => {
  trackEvent('lead_capture', { email, name });
};

export const trackPurchase = (productId: string, value: number, currency: string = 'EUR') => {
  trackEvent('purchase_success', {
    transaction_id: `T_${Date.now()}`,
    value,
    currency,
    items: [{ item_id: productId }]
  });
};
