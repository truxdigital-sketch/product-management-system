import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InventoryItem, Warehouse } from '@/types';

interface InventoryState {
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  addWarehouse: (w: Omit<Warehouse, 'id'>) => void;
  adjustStock: (productId: string, warehouseId: string, change: number) => void;
  setInitialStock: (productId: string, warehouseId: string, quantity: number) => void;
}

const defaultWarehouses: Warehouse[] = [
  { id: 'w1', name: 'Main Hub - NY', location: 'New York, NY' },
  { id: 'w2', name: 'West Coast Hub', location: 'Los Angeles, CA' },
];

const defaultInventory: InventoryItem[] = [
  { id: 'inv1', product_id: '1', warehouse_id: 'w1', quantity: 45, reserved_quantity: 5, status: 'in_stock', updated_at: new Date().toISOString() },
  { id: 'inv2', product_id: '2', warehouse_id: 'w1', quantity: 12, reserved_quantity: 2, status: 'low_stock', updated_at: new Date().toISOString() },
];

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      warehouses: defaultWarehouses,
      inventory: defaultInventory,
      addWarehouse: (w) => set((state) => ({
        warehouses: [...state.warehouses, { ...w, id: crypto.randomUUID() }]
      })),
      adjustStock: (productId, warehouseId, change) => set((state) => {
        const itemIndex = state.inventory.findIndex(i => i.product_id === productId && i.warehouse_id === warehouseId);
        if (itemIndex > -1) {
          const newInv = [...state.inventory];
          const current = newInv[itemIndex];
          const newQty = Math.max(0, current.quantity + change);
          
          newInv[itemIndex] = {
            ...current,
            quantity: newQty,
            status: newQty === 0 ? 'out_of_stock' : newQty < 10 ? 'low_stock' : 'in_stock',
            updated_at: new Date().toISOString()
          };
          return { inventory: newInv };
        }
        return state;
      }),
      setInitialStock: (productId, warehouseId, quantity) => set((state) => {
        const newInvItem: InventoryItem = {
          id: crypto.randomUUID(),
          product_id: productId,
          warehouse_id: warehouseId,
          quantity,
          reserved_quantity: 0,
          status: quantity === 0 ? 'out_of_stock' : quantity < 10 ? 'low_stock' : 'in_stock',
          updated_at: new Date().toISOString()
        };
        return { inventory: [...state.inventory, newInvItem] };
      })
    }),
    {
      name: 'inventory-store',
    }
  )
);
