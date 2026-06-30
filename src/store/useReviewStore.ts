import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface ReviewState {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'created_at' | 'status'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;
}

const defaultReviews: Review[] = [
  { id: '1', product_id: '1', customer_name: 'John Doe', rating: 5, comment: 'Great product!', status: 'approved', created_at: new Date().toISOString() },
  { id: '2', product_id: '2', customer_name: 'Jane Smith', rating: 3, comment: 'It is okay.', status: 'pending', created_at: new Date().toISOString() },
];

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: defaultReviews,
      addReview: (review) => set((state) => ({
        reviews: [...state.reviews, { ...review, id: crypto.randomUUID(), status: 'pending', created_at: new Date().toISOString() }]
      })),
      updateReviewStatus: (id, status) => set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, status } : r)
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter(r => r.id !== id)
      }))
    }),
    {
      name: 'review-store',
    }
  )
);
