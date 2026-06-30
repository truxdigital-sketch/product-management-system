import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Image as ImageIcon, 
  Settings,
  Star,
  Layers,
  ArrowRightLeft,
  BarChart3
} from 'lucide-react';
import { cn } from '@/utils/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: Layers, label: 'Categories', href: '/categories' },
  { icon: Tags, label: 'Brands', href: '/brands' },
  { icon: ArrowRightLeft, label: 'Inventory', href: '/inventory' },
  { icon: ImageIcon, label: 'Media', href: '/media' },
  { icon: Star, label: 'Reviews', href: '/reviews' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          System.
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
