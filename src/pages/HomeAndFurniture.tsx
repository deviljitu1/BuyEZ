import { ProductGrid } from '@/components/ProductGrid';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';

const HomeAndFurniture = ({ addToCart }: { addToCart: (product: Product) => void }) => {
  const homeAndFurnitureProducts = mockProducts.filter(p => 
    ['Kitchen', 'Furniture', 'Decor', 'Tools'].includes(p.category)
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Home & Furniture</h1>
      <ProductGrid products={homeAndFurnitureProducts} onAddToCart={addToCart} />
    </div>
  );
};

export default HomeAndFurniture;