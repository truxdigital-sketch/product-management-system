import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OfferType = 
  | 'percentage' 
  | 'fixed' 
  | 'bogo' 
  | 'buy_x_get_y' 
  | 'free_shipping' 
  | 'bundle'
  | 'first_order';

export type OfferStatus = 'draft' | 'active' | 'scheduled' | 'expired';
export type OfferApplicableTo = 'all' | 'products' | 'categories' | 'brands' | 'customers';

export interface Offer {
  id: string;
  name: string;
  description: string;
  type: OfferType;
  status: OfferStatus;
  
  // Discount Configuration
  discount_value: number; // Could be percentage (20) or fixed amount (500)
  max_discount_limit: number | null; // e.g. 20% off up to $50
  min_purchase_amount: number | null; // e.g. off on orders over $100
  max_uses: number | null; // Total times this offer can be used globally
  uses_per_customer: number | null; // Times a single customer can use it
  usage_count: number; // Current number of times it has been used
  
  // Targeting
  applicable_to: OfferApplicableTo;
  applicable_ids: string[]; // List of product IDs, category IDs, etc.
  
  // Coupon
  has_coupon: boolean;
  coupon_code: string | null;
  
  // Date & Time
  start_date: string | null;
  end_date: string | null;
  
  // Display Options
  display_show_badge: boolean;
  display_show_timer: boolean;
  display_highlight_percentage: boolean;
  
  created_at: string;
  updated_at: string;
}

interface DiscountState {
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => void;
  updateOffer: (id: string, offer: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  duplicateOffer: (id: string) => void;
}

const defaultOffers: Offer[] = [
  {
    id: '1',
    name: 'Summer Sale 2026',
    description: 'Get 20% off on all audio products.',
    type: 'percentage',
    status: 'active',
    discount_value: 20,
    max_discount_limit: null,
    min_purchase_amount: 50,
    max_uses: 1000,
    uses_per_customer: 1,
    usage_count: 145,
    applicable_to: 'all',
    applicable_ids: [],
    has_coupon: false,
    coupon_code: null,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    display_show_badge: true,
    display_show_timer: false,
    display_highlight_percentage: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useDiscountStore = create<DiscountState>()(
  persist(
    (set) => ({
      offers: defaultOffers,
      
      addOffer: (offer) => set((state) => {
        const newOffer: Offer = {
          ...offer,
          id: crypto.randomUUID(),
          usage_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return { offers: [newOffer, ...state.offers] };
      }),
      
      updateOffer: (id, updatedFields) => set((state) => ({
        offers: state.offers.map(o => 
          o.id === id ? { ...o, ...updatedFields, updated_at: new Date().toISOString() } : o
        )
      }), false), // Ensure strict evaluation
      
      deleteOffer: (id) => set((state) => ({
        offers: state.offers.filter(o => o.id !== id)
      })),
      
      duplicateOffer: (id) => set((state) => {
        const existing = state.offers.find(o => o.id === id);
        if (!existing) return state;
        const copy: Offer = {
          ...existing,
          id: crypto.randomUUID(),
          name: `${existing.name} (Copy)`,
          status: 'draft',
          usage_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return { offers: [copy, ...state.offers] };
      })
    }),
    {
      name: 'discount-store',
    }
  )
);
