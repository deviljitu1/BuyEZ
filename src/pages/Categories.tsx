import { useState } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';

const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category)));

type CategoriesProps = {
  addToCart: (product: Product) => void;
};

const Categories = ({ addToCart }: CategoriesProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        {uniqueCategories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded border ${selected === category ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => setSelected(category)}
          >
            {category}
          </button>
        ))}
        <button
          className={`px-4 py-2 rounded border ${selected === null ? 'bg-primary text-white' : 'bg-muted'}`}
          onClick={() => setSelected(null)}
        >
          All
        </button>
      </div>
      <ProductGrid
        products={selected ? mockProducts.filter(p => p.category === selected) : mockProducts}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default Categories; 