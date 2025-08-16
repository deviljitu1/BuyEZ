import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '@/components/ProductGrid';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';

// This mapping defines our main categories and their sub-categories.
const categoryGroups: { [key: string]: string[] } = {
  home: ['Kitchen', 'Furniture', 'Decor', 'Tools'],
  // Note: Using 'Mobile' to match product data, though nav says 'Mobiles'.
  electronics: ['Mobile', 'Laptops', 'Cameras', 'Audio', 'Wearables', 'Gaming', 'Accessories'],
  beauty: ['Beauty', 'Toys', 'Sports', 'Books'],
  'two-wheelers': ['Bikes', 'Scooters', 'Accessories']
};

// All unique categories from products data, as a fallback
const allUniqueCategories = Array.from(new Set(mockProducts.map(p => p.category)));
const Categories = ({ addToCart }: { addToCart: (product: Product) => void; }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat');
  const subParam = searchParams.get('sub');

  // Determine the set of categories and products to work with based on 'cat' param
  const mainCategories = catParam && categoryGroups[catParam] ? categoryGroups[catParam] : allUniqueCategories;
  const productsForCategory = catParam
    ? mockProducts.filter(p => mainCategories.includes(p.category))
    : mockProducts;

  // State for the selected sub-category filter. Initialized from 'sub' param.
  const [selected, setSelected] = useState<string | null>(subParam);

  // If the URL params change, we need to update our state
  useEffect(() => {
    setSelected(subParam);
  }, [subParam]);

  // Handle user clicking a filter button
  const handleSelectCategory = (category: string | null) => {
    setSelected(category);
    // Update URL for consistency, which triggers the useEffect above
    if (category) {
        searchParams.set('sub', category);
    } else {
        searchParams.delete('sub');
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filteredProducts = selected
    ? productsForCategory.filter(p => p.category === selected)
    : productsForCategory;

  // Determine the title of the page
  const pageTitle = Object.keys(categoryGroups).find(key => key === catParam)
    ?.replace('-', ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    || 'All Categories';

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        {mainCategories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded border ${selected === category ? 'bg-primary text-white' : 'bg-muted'}`}
            onClick={() => handleSelectCategory(category)}
          >
            {category}
          </button>
        ))}
        <button
          className={`px-4 py-2 rounded border ${selected === null ? 'bg-primary text-white' : 'bg-muted'}`}
          onClick={() => handleSelectCategory(null)}
        >
          All
        </button>
      </div>
      <ProductGrid
        products={filteredProducts}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default Categories; 