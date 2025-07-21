import { ProductGrid } from '@/components/ProductGrid';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';

type ProductsProps = {
  addToCart: (product: Product) => void;
};

const Products = ({ addToCart }: ProductsProps) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <ProductGrid products={mockProducts} onAddToCart={addToCart} />
    </div>
  );
};

export default Products; 