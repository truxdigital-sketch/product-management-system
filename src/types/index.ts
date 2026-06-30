export type ProductStatus = 'draft' | 'published' | 'archived';
export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  barcode: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  status: ProductStatus;
  category_id: string | null; // simplified for now
  brand_id: string | null;
  created_at: string;
  updated_at: string;
  images: string[]; // base64 strings or URLs
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface InventoryItem {
  id: string;
  product_id: string;
  warehouse_id: string;
  quantity: number;
  reserved_quantity: number;
  status: InventoryStatus;
  updated_at: string;
}
