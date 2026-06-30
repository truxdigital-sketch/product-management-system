import { useState } from 'react';
import { 
  Plus, Search, Filter, Download, MoreHorizontal, Edit, Copy, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/useProductStore';
import { useDiscountStore } from '@/store/useDiscountStore';
import { ConfirmModal } from '@/components/ui/modal';

export function ProductList() {
  const navigate = useNavigate();
  const { products, deleteProduct, duplicateProduct } = useProductStore();
  const { offers } = useDiscountStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Action menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filtering
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setProductToDelete(null);
      setOpenMenuId(null);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateProduct(id);
    setOpenMenuId(null);
  };

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
              placeholder="Search by name or SKU..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
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
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input type="checkbox" className="rounded border-input bg-background" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3 cursor-pointer hover:underline" onClick={() => navigate(`/products/${product.id}`)}>
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0 border overflow-hidden relative">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-muted-foreground text-xs">{product.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-2">
                          {product.name}
                          {(() => {
                            let showBadge = false;
                            if (product.sale_price) showBadge = true;
                            if (product.active_offer_id) {
                              const offer = offers.find(o => o.id === product.active_offer_id);
                              if (offer && offer.display_show_badge) showBadge = true;
                            }
                            if (showBadge) {
                              return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-1 py-0 h-4">Sale</Badge>;
                            }
                            return null;
                          })()}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>
                    {(() => {
                      let finalPrice = product.sale_price || product.price;
                      if (product.active_offer_id) {
                        const offer = offers.find(o => o.id === product.active_offer_id);
                        if (offer) {
                          if (offer.type === 'percentage') {
                            finalPrice = finalPrice * (1 - (offer.discount_value / 100));
                          } else if (offer.type === 'fixed') {
                            finalPrice = Math.max(0, finalPrice - offer.discount_value);
                          }
                        }
                      }
                      
                      const isDiscounted = finalPrice < product.price;
                      
                      return (
                        <div className="flex flex-col">
                          <span className={isDiscounted ? "text-primary font-medium" : ""}>
                            ${finalPrice.toFixed(2)}
                          </span>
                          {isDiscounted && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        product.status === 'published' ? 'success' : 
                        product.status === 'archived' ? 'destructive' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    
                    {openMenuId === product.id && (
                      <>
                        {/* Invisible backdrop to close menu */}
                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                        
                        <div className="absolute right-8 top-10 z-50 w-48 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in zoom-in-95">
                          <div className="p-1">
                            <button className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground" onClick={() => navigate(`/products/${product.id}`)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Product
                            </button>
                            <button className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground" onClick={() => handleDuplicate(product.id)}>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </button>
                            <button className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-destructive hover:bg-destructive/10" onClick={() => { setProductToDelete(product.id); setOpenMenuId(null); }}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {Math.min((page - 1) * itemsPerPage + 1, filteredProducts.length)} to {Math.min(page * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
