import { useState, useRef } from 'react';
import { Search, Edit, Trash2, Tag, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useBrandStore } from '@/store/useBrandStore';
import { ConfirmModal } from '@/components/ui/modal';

export function Brands() {
  const { brands, addBrand, updateBrand, deleteBrand } = useBrandStore();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  // Modals state
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = () => {
    if (!name) return;
    
    if (editingId) {
      updateBrand(editingId, { name, description, logo_url: logoUrl });
    } else {
      addBrand({ name, description, logo_url: logoUrl });
    }
    
    // Reset form
    setName('');
    setDescription('');
    setLogoUrl(undefined);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const brand = brands.find(b => b.id === id);
    if (brand) {
      setEditingId(brand.id);
      setName(brand.name);
      setDescription(brand.description);
      setLogoUrl(brand.logo_url);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Brands</h2>
          <p className="text-muted-foreground">Manage product brands and their details.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="font-semibold text-lg">{editingId ? 'Edit Brand' : 'Add New Brand'}</div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Logo</label>
                <div 
                  className="border-2 border-dashed rounded-xl p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center relative overflow-hidden h-32"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoUrl ? (
                    <>
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        Change Logo
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Click to upload</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleLogoUpload} 
                  />
                </div>
                {logoUrl && (
                  <Button variant="ghost" size="sm" className="w-full text-destructive text-xs h-8" onClick={() => setLogoUrl(undefined)}>
                    Remove Logo
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  placeholder="e.g. Apple" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                  placeholder="Short description of the brand..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="w-full" onClick={handleSave} disabled={!name}>
                  {editingId ? 'Update Brand' : 'Create Brand'}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={() => { setEditingId(null); setName(''); setDescription(''); setLogoUrl(undefined); }}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search brands..."
              className="w-full pl-9 bg-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="bg-card border rounded-xl divide-y">
            {filteredBrands.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No brands found.</div>
            ) : (
              filteredBrands.map(brand => (
                <div key={brand.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border overflow-hidden shrink-0">
                      {brand.logo_url ? (
                        <img src={brand.logo_url} className="w-full h-full object-cover" alt={brand.name} />
                      ) : (
                        <Tag className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{brand.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{brand.description || 'No description provided.'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(brand.id)}>
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setBrandToDelete(brand.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!brandToDelete}
        onClose={() => setBrandToDelete(null)}
        onConfirm={() => {
          if (brandToDelete) deleteBrand(brandToDelete);
          setBrandToDelete(null);
        }}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? This action cannot be undone."
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
