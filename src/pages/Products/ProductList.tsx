
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

const products = [
  { id: '1', name: 'Premium Wireless Headphones', sku: 'WH-1000XM5', category: 'Electronics', price: 299.00, stock: 45, status: 'Published' },
  { id: '2', name: 'Ergonomic Office Chair', sku: 'CH-ERGO-01', category: 'Furniture', price: 499.00, stock: 12, status: 'Low Stock' },
  { id: '3', name: 'Mechanical Keyboard v2', sku: 'KB-MECH-V2', category: 'Electronics', price: 159.00, stock: 0, status: 'Out of Stock' },
  { id: '4', name: 'Organic Cotton T-Shirt', sku: 'TS-ORG-M', category: 'Apparel', price: 29.00, stock: 150, status: 'Draft' },
  { id: '5', name: 'Smart Fitness Watch', sku: 'SW-FIT-02', category: 'Electronics', price: 199.00, stock: 8, status: 'Low Stock' },
];

export function ProductList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog and inventory.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={() => navigate('/products/new')}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-9"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input type="checkbox" className="rounded border-input bg-background" />
              </TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <input type="checkbox" className="rounded border-input bg-background" />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 border">
                      <img src={`https://placehold.co/40x40/png?text=${product.name.charAt(0)}`} className="rounded-md" alt="" />
                    </div>
                    {product.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      product.status === 'Published' ? 'success' : 
                      product.status === 'Low Stock' ? 'warning' : 
                      product.status === 'Out of Stock' ? 'destructive' : 'secondary'
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <div>Showing 1 to 5 of 120 results</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
