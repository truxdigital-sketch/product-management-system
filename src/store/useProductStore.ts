import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
}

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'High-quality noise-canceling headphones.',
    short_description: 'High-quality noise-canceling headphones.',
    sku: 'WH-1000XM5',
    barcode: '1234567890123',
    price: 299.00,
    compare_at_price: 349.00,
    cost_price: 150.00,
    status: 'published',
    category_id: '1',
    brand_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: []
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Comfortable chair for long working hours.',
    short_description: 'Comfortable chair for long working hours.',
    sku: 'CH-ERGO-01',
    barcode: '1234567890124',
    price: 499.00,
    compare_at_price: 599.00,
    cost_price: 200.00,
    status: 'published',
    category_id: '2',
    brand_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: []
  }
];

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: defaultProducts,
      addProduct: (prod) => set((state) => {
        const newProduct: Product = {
          ...prod,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return { products: [newProduct, ...state.products] };
      }),
      updateProduct: (id, updatedFields) => set((state) => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, ...updatedFields, updated_at: new Date().toISOString() } : p
        )
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      duplicateProduct: (id) => set((state) => {
        const existing = state.products.find(p => p.id === id);
        if (!existing) return state;
        const copy: Product = {
          ...existing,
          id: crypto.randomUUID(),
          name: `${existing.name} (Copy)`,
          slug: `${existing.slug}-copy`,
          sku: `${existing.sku}-COPY`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'draft'
        };
        return { products: [copy, ...state.products] };
      })
    }),
    {
      name: 'product-store',
    }
  )
);
