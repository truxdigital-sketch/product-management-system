import React from 'react';
import { Plus, Search, Folder, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { id: 1, name: 'Electronics', count: 423, status: 'Active' },
  { id: 2, name: 'Furniture', count: 142, status: 'Active' },
  { id: 3, name: 'Apparel', count: 856, status: 'Active' },
  { id: 4, name: 'Accessories', count: 124, status: 'Active' },
];

export function Categories() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage your product categories and hierarchy.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="font-semibold text-lg">Add New Category</div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="e.g. Shoes" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Category</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option>None</option>
                  <option>Apparel</option>
                  <option>Electronics</option>
                </select>
              </div>
              <Button className="w-full">Create Category</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="w-full pl-9 bg-card"
            />
          </div>
          
          <div className="bg-card border rounded-xl divide-y">
            {categories.map(category => (
              <div key={category.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Folder className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-muted-foreground">{category.count} Products</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon"><Edit className="h-4 w-4 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
