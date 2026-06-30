import React from 'react';
import { Upload, Search, Image as ImageIcon, File, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Media() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">Manage your product images and files.</p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search media..."
              className="w-full pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter by Date
          </Button>
        </div>
        
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="group relative aspect-square bg-muted rounded-xl border overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer">
              <img src={`https://placehold.co/400x400/png?text=Image+${i+1}`} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <div className="text-white text-xs truncate">product-image-{i+1}.jpg</div>
                <div className="text-white/70 text-[10px]">1.2 MB</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
