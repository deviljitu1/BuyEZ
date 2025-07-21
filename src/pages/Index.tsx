import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';

type IndexProps = {
  addToCart: (product: Product) => void;
};

const Index = ({ addToCart }: IndexProps) => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <ProductGrid 
          products={mockProducts} 
          onAddToCart={addToCart} 
        />
      </main>
    </div>
  );
};

export default Index;
