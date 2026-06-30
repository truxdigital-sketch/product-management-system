import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  created_at: string;
}

interface BrandState {
  brands: Brand[];
  addBrand: (brand: Omit<Brand, 'id' | 'created_at'>) => void;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
}

const defaultBrands: Brand[] = [
  { id: '1', name: 'Apple', description: 'Tech giant', created_at: new Date().toISOString() },
  { id: '2', name: 'Samsung', description: 'Electronics', created_at: new Date().toISOString() },
];

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      brands: defaultBrands,
      addBrand: (brand) => set((state) => ({
        brands: [...state.brands, { ...brand, id: crypto.randomUUID(), created_at: new Date().toISOString() }]
      })),
      updateBrand: (id, updated) => set((state) => ({
        brands: state.brands.map(b => b.id === id ? { ...b, ...updated } : b)
      })),
      deleteBrand: (id) => set((state) => ({
        brands: state.brands.filter(b => b.id !== id)
      }))
    }),
    {
      name: 'brand-store',
    }
  )
);
