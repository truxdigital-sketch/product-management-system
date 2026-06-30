import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StoreSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CurrencySettings {
  currency: string;
  symbol: string;
  position: 'left' | 'right';
  decimalPlaces: number;
  thousandsSeparator: string;
}

export interface TaxSettings {
  enabled: boolean;
  percentage: number;
  inclusive: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  deliveryTime: string;
}

export interface ShippingSettings {
  zones: string[];
  methods: ShippingMethod[];
  weightBased: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface NotificationSettings {
  emailNewProduct: boolean;
  emailLowStock: boolean;
  emailOutStock: boolean;
  emailOrders: boolean;
  emailRegistration: boolean;
  systemBrowser: boolean;
  systemAlerts: boolean;
  systemFeed: boolean;
}

interface SettingsState {
  store: StoreSettings;
  currency: CurrencySettings;
  tax: TaxSettings;
  shipping: ShippingSettings;
  roles: Role[];
  notifications: NotificationSettings;
  
  updateStore: (data: Partial<StoreSettings>) => void;
  updateCurrency: (data: Partial<CurrencySettings>) => void;
  updateTax: (data: Partial<TaxSettings>) => void;
  updateShipping: (data: Partial<ShippingSettings>) => void;
  
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  
  updateNotifications: (data: Partial<NotificationSettings>) => void;
}

const defaultSettings = {
  store: {
    name: 'Premium Tech Store',
    email: 'support@premiumtech.com',
    phone: '+1 (555) 000-0000',
    address: '123 Tech Avenue\nSuite 400\nSan Francisco, CA 94105'
  },
  currency: {
    currency: 'USD',
    symbol: '$',
    position: 'left' as const,
    decimalPlaces: 2,
    thousandsSeparator: ','
  },
  tax: {
    enabled: true,
    percentage: 10,
    inclusive: false
  },
  shipping: {
    zones: ['Domestic', 'International'],
    methods: [
      { id: '1', name: 'Flat Rate', cost: 10, deliveryTime: '3-5 business days' },
      { id: '2', name: 'Free Shipping', cost: 0, deliveryTime: '5-7 business days' },
      { id: '3', name: 'Local Pickup', cost: 0, deliveryTime: 'Available immediately' }
    ],
    weightBased: false
  },
  roles: [
    { id: 'admin', name: 'Administrator', permissions: ['dashboard', 'products', 'categories', 'brands', 'inventory', 'reviews', 'orders', 'customers', 'analytics', 'settings'] },
    { id: 'manager', name: 'Manager', permissions: ['dashboard', 'products', 'categories', 'inventory', 'reviews', 'orders'] },
    { id: 'staff', name: 'Staff', permissions: ['dashboard', 'orders', 'customers'] }
  ],
  notifications: {
    emailNewProduct: true,
    emailLowStock: true,
    emailOutStock: true,
    emailOrders: true,
    emailRegistration: false,
    systemBrowser: true,
    systemAlerts: true,
    systemFeed: true
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      updateStore: (data) => set((state) => ({ store: { ...state.store, ...data } })),
      updateCurrency: (data) => set((state) => ({ currency: { ...state.currency, ...data } })),
      updateTax: (data) => set((state) => ({ tax: { ...state.tax, ...data } })),
      updateShipping: (data) => set((state) => ({ shipping: { ...state.shipping, ...data } })),
      
      addRole: (role) => set((state) => ({ roles: [...state.roles, { ...role, id: crypto.randomUUID() }] })),
      updateRole: (id, data) => set((state) => ({
        roles: state.roles.map(r => r.id === id ? { ...r, ...data } : r)
      })),
      deleteRole: (id) => set((state) => ({
        roles: state.roles.filter(r => r.id !== id)
      })),
      
      updateNotifications: (data) => set((state) => ({ notifications: { ...state.notifications, ...data } })),
    }),
    {
      name: 'settings-store',
    }
  )
);
