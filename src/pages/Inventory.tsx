import React from 'react';
import { Package, AlertTriangle, ArrowRightLeft, Plus, Search, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const inventoryData = [
  { id: '1', product: 'Premium Wireless Headphones', sku: 'WH-1000XM5', warehouse: 'Main Hub - NY', stock: 45, reserved: 5, status: 'In Stock' },
  { id: '2', product: 'Ergonomic Office Chair', sku: 'CH-ERGO-01', warehouse: 'East Coast Center', stock: 12, reserved: 2, status: 'Low Stock' },
  { id: '3', product: 'Mechanical Keyboard v2', sku: 'KB-MECH-V2', warehouse: 'Main Hub - NY', stock: 0, reserved: 0, status: 'Out of Stock' },
  { id: '4', product: 'Organic Cotton T-Shirt', sku: 'TS-ORG-M', warehouse: 'West Coast Hub', stock: 150, reserved: 20, status: 'In Stock' },
  { id: '5', product: 'Smart Fitness Watch', sku: 'SW-FIT-02', warehouse: 'Main Hub - NY', stock: 8, reserved: 4, status: 'Low Stock' },
];

export function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage stock levels, warehouses, and adjustments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><ArrowRightLeft className="h-4 w-4" /> Transfer Stock</Button>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Receive Stock</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,592.00</div>
            <p className="text-xs text-muted-foreground mt-1">Across 3 warehouses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">14</div>
            <p className="text-xs text-muted-foreground mt-1">Items below threshold</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search by SKU or Product Name..." className="w-full pl-9" />
          </div>
          <div className="flex gap-2">
             <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none">
              <option>All Warehouses</option>
              <option>Main Hub - NY</option>
              <option>East Coast Center</option>
              <option>West Coast Hub</option>
            </select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product / SKU</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Available Stock</TableHead>
              <TableHead>Reserved</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.product}</div>
                  <div className="text-sm text-muted-foreground">{item.sku}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" /> {item.warehouse}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.stock}</TableCell>
                <TableCell className="text-muted-foreground">{item.reserved}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'In Stock' ? 'success' : item.status === 'Low Stock' ? 'warning' : 'destructive'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Adjust</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
