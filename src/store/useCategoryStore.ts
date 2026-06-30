import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category } from '@/types';

interface CategoryState {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', parent_id: null, created_at: new Date().toISOString() },
  { id: '2', name: 'Furniture', slug: 'furniture', parent_id: null, created_at: new Date().toISOString() },
  { id: '3', name: 'Apparel', slug: 'apparel', parent_id: null, created_at: new Date().toISOString() },
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      addCategory: (cat) => set((state) => ({
        categories: [...state.categories, { ...cat, id: crypto.randomUUID(), created_at: new Date().toISOString() }]
      })),
      updateCategory: (id, updated) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...updated } : c)
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      }))
    }),
    {
      name: 'category-store',
    }
  )
);
