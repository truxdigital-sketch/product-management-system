import { useState, useMemo } from 'react';
import { Package, AlertTriangle, ArrowRightLeft, Plus, Search, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useProductStore } from '@/store/useProductStore';
import { Modal } from '@/components/ui/modal';

export function Inventory() {
  const { inventory, warehouses, adjustStock } = useInventoryStore();
  const { products } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');

  // Adjustment Modal State
  const [adjustingItem, setAdjustingItem] = useState<{ productId: string, warehouseId: string } | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);

  const combinedData = useMemo(() => {
    let data = inventory.map(inv => {
      const product = products.find(p => p.id === inv.product_id);
      const warehouse = warehouses.find(w => w.id === inv.warehouse_id);
      return {
        ...inv,
        productName: product?.name || 'Unknown Product',
        productSku: product?.sku || 'Unknown SKU',
        warehouseName: warehouse?.name || 'Unknown Warehouse',
        price: product?.price || 0,
      };
    });

    if (selectedWarehouse) {
      data = data.filter(d => d.warehouse_id === selectedWarehouse);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(d => d.productName.toLowerCase().includes(lower) || d.productSku.toLowerCase().includes(lower));
    }

    return data;
  }, [inventory, products, warehouses, selectedWarehouse, searchTerm]);

  const totalValue = combinedData.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
  const lowStockCount = combinedData.filter(d => d.status === 'low_stock' || d.status === 'out_of_stock').length;

  const handleAdjustSubmit = () => {
    if (adjustingItem && adjustAmount !== 0) {
      adjustStock(adjustingItem.productId, adjustingItem.warehouseId, adjustAmount);
      setAdjustingItem(null);
      setAdjustAmount(0);
    }
  };

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
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on current stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Items below threshold</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search by SKU or Product Name..." 
              className="w-full pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <select 
               className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none"
               value={selectedWarehouse}
               onChange={(e) => setSelectedWarehouse(e.target.value)}
             >
              <option value="">All Warehouses</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
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
            {combinedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No inventory records found.
                </TableCell>
              </TableRow>
            ) : (
              combinedData.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">{item.productSku}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" /> {item.warehouseName}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{item.reserved_quantity}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'in_stock' ? 'success' : item.status === 'low_stock' ? 'warning' : 'destructive'}>
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setAdjustingItem({ productId: item.product_id, warehouseId: item.warehouse_id })}>
                      Adjust
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Modal
        isOpen={!!adjustingItem}
        onClose={() => { setAdjustingItem(null); setAdjustAmount(0); }}
        title="Adjust Stock"
        description="Add or subtract from the current inventory quantity."
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Adjustment Amount (+ or -)</label>
            <Input 
              type="number" 
              placeholder="e.g. 5 or -2" 
              value={adjustAmount || ''} 
              onChange={(e) => setAdjustAmount(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setAdjustingItem(null); setAdjustAmount(0); }}>Cancel</Button>
            <Button onClick={handleAdjustSubmit}>Confirm Adjustment</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
