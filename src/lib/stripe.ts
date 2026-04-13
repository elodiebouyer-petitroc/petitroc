/// <reference types="vite/client" />

/**
 * Stripe Configuration for NGT Academy
 */

export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  price: number;
  oldPrice?: number;
  mode: 'payment' | 'subscription';
}

export const STRIPE_PRODUCTS: Record<string, StripeProduct> = {
  CAMELEON: {
    id: 'cameleon',
    priceId: import.meta.env.VITE_STRIPE_PRICE_CAMELEON || 'price_1TICyiATTFnnuv02XSjh6',
    name: 'Plan Caméléon - Formation',
    price: 500,
    mode: 'payment'
  },
  ALGO_LIFETIME: {
    id: 'algo_lifetime',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ALGO_LIFETIME || 'price_1TInapATTFnnuv02Zfdal',
    name: 'Algorithme Caméléon - À vie',
    price: 1997,
    mode: 'payment'
  },
  ALGO_MONTHLY: {
    id: 'algo_monthly',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ALGO_MONTH || import.meta.env.VITE_STRIPE_PRICE_ALGO_MONTHLY || 'price_1TinZgATTFnnuv02fazV4',
    name: 'Algorithme Caméléon - Mensuel',
    price: 149,
    mode: 'subscription'
  },
  ALGO_ANNUAL: {
    id: 'algo_annual',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ALGO_ANNUAL || 'price_1TKhTWATTFnnuv023CS3j8aj',
    name: 'Algorithme Caméléon - Annuel (engagement 1 an)',
    price: 124,
    mode: 'subscription'
  },
  FULL_PACK: {
    id: 'full_pack',
    priceId: import.meta.env.VITE_STRIPE_PRICE_FULL_PACK || 'price_1TInbwATTFnnuv02hblU',
    name: 'Pack Complet (Formation + Algo à vie)',
    price: 2197,
    oldPrice: 2497,
    mode: 'payment'
  },
  PSYCHOLOGY: {
    id: 'psychology',
    priceId: import.meta.env.VITE_STRIPE_PRICE_PSYCHOLOGY || 'price_1TICx8ATTFnnuv02mS5l',
    name: 'Formation Psychologie du trading',
    price: 70,
    mode: 'payment'
  },
  // UPSELLS
  ALGO_LIFETIME_UPSELL: {
    id: 'algo_lifetime_upsell',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ALGO_LIFETIME_UPSELL || 'price_1R07AQATTFnnuv02KotWBqrS',
    name: 'Algorithme Caméléon - À vie (Upsell)',
    price: 1497,
    oldPrice: 1997,
    mode: 'payment'
  },
  ALGO_MONTHLY_UPSELL: {
    id: 'algo_monthly_upsell',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ALGO_MONTHLY_UPSELL || 'price_1R079UATTFnnuv02Gj4WqPsm',
    name: 'Algorithme Caméléon - 1 mois d\'essai (Upsell)',
    price: 99,
    oldPrice: 149,
    mode: 'subscription'
  }
};

export type ProductId = keyof typeof STRIPE_PRODUCTS;
