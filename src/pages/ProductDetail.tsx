import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '@/data/mockProducts';
import { Star, ShoppingCart, ArrowLeft, X } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { useEffect, useState } from 'react';

type ProductDetailProps = {
  addToCart: (product: Product) => void;
};

const ProductDetail = ({ addToCart }: ProductDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, updateQuantity } = useCart();
  const [zoomed, setZoomed] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [pincode, setPincode] = useState('');
  const [enteredPincode, setEnteredPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [pincodeError, setPincodeError] = useState('');
  const product = mockProducts.find(p => p.id === id);
  const otherProducts = mockProducts.filter(p => p.id !== id);
  const cartItem = items.find(item => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button className="text-primary underline" onClick={() => navigate(-1)}>
          <ArrowLeft className="inline w-4 h-4 mr-1" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      {/* Zoom Modal */}
      {zoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setZoomed(false)}>
          <div className="relative max-w-3xl w-full flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-h-[80vh] max-w-full rounded-lg shadow-2xl object-contain" />
            <button
              className="absolute top-4 right-4 bg-background rounded-full p-2 shadow hover:bg-muted"
              onClick={e => { e.stopPropagation(); setZoomed(false); }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Product Image */}
        <div className="flex-1 flex items-center justify-center bg-muted rounded-xl p-6 cursor-zoom-in" onClick={() => setZoomed(true)}>
          <img src={product.image} alt={product.name} className="max-h-96 object-contain rounded-lg shadow-lg transition-transform duration-200 hover:scale-105" />
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary font-semibold uppercase text-xs tracking-wider bg-primary/10 px-2 py-1 rounded">{product.category}</span>
              <span className="flex items-center text-yellow-500 ml-2">
                <Star className="w-4 h-4 mr-1" />
                {product.rating} <span className="text-xs text-muted-foreground ml-1">({product.reviews} reviews)</span>
              </span>
            </div>
            <div className="flex items-center flex-wrap gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="text-success font-semibold ml-2">
                  {Math.round(100 - (product.price / product.originalPrice) * 100)}% off
                </span>
              )}
              {/* Quantity Selector */}
              {quantity > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    className="h-8 w-8 rounded-full border flex items-center justify-center text-lg font-bold bg-background hover:bg-muted transition"
                    onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="text-base font-medium w-8 text-center">{quantity}</span>
                  <button
                    className="h-8 w-8 rounded-full border flex items-center justify-center text-lg font-bold bg-background hover:bg-muted transition"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            {/* Pincode & Delivery Date */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32"
                />
                <button
                  className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary-glow text-sm font-semibold shadow"
                  onClick={() => {
                    if (!/^\d{6}$/.test(pincode)) {
                      setPincodeError('Enter a valid 6-digit pincode');
                      return;
                    }
                    setEnteredPincode(pincode);
                    setPincodeError('');
                    // Random delivery date 3-7 days from now
                    const days = Math.floor(Math.random() * 5) + 3;
                    const date = new Date();
                    date.setDate(date.getDate() + days);
                    setDeliveryDate(date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }));
                  }}
                >
                  {enteredPincode ? 'Change' : 'Check'}
                </button>
              </div>
              {pincodeError && <div className="text-red-500 text-xs mt-1">{pincodeError}</div>}
              {enteredPincode && deliveryDate && (
                <div className="text-success text-sm mt-1 sm:mt-0">
                  Delivery to <span className="font-semibold">{enteredPincode}</span> by <span className="font-semibold">{deliveryDate}</span>
                </div>
              )}
            </div>
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">Stock: </span>
              <span className={product.stock > 0 ? 'text-success' : 'text-destructive'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            <p className="text-base text-foreground mb-6">{product.description}</p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <button
                className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-glow transition-colors font-semibold flex items-center justify-center gap-2 text-lg shadow-lg"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                className="w-full sm:w-auto px-8 py-3 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-semibold flex items-center justify-center gap-2 text-lg shadow-lg"
                onClick={() => navigate('/checkout')}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Specifications Section */}
      <div className="mt-12 bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold mb-2">Specifications</h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">General</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <div className="text-muted-foreground">Model ID</div><div>Neo</div>
              <div className="text-muted-foreground">Color</div><div>Soft Lilac</div>
              <div className="text-muted-foreground">Headphone Type</div><div>True Wireless</div>
              <div className="text-muted-foreground">Inline Remote</div><div>No</div>
              <div className="text-muted-foreground">Sales Package</div><div>1 Pair of Earbuds, Charging Case, Charging Cable, User Manual, Warranty Card</div>
              <div className="text-muted-foreground">Connectivity</div><div>Bluetooth</div>
              <div className="text-muted-foreground">Headphone Design</div><div>Earbud</div>
              <div className="text-muted-foreground">Compatible Devices</div><div>Laptop, Mobile, Tablet</div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <div className="text-muted-foreground">Sweat Proof</div><div>Yes</div>
              <div className="text-muted-foreground">Deep Bass</div><div>No</div>
              <div className="text-muted-foreground">Water Resistant</div><div>Yes</div>
              <div className="text-muted-foreground">With Microphone</div><div>Yes</div>
            </div>
          </div>
          {showSpecs && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Connectivity Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="text-muted-foreground">Wireless Range</div><div>10 m</div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Warranty</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="text-muted-foreground">Domestic Warranty</div><div>1 Year</div>
                  <div className="text-muted-foreground">Warranty Summary</div><div>1 Year Warranty</div>
                  <div className="text-muted-foreground">Warranty Service Type</div><div>If Any Query Customer Need to Contact Us at help@nexxbase.com or Call on 8882132132</div>
                  <div className="text-muted-foreground">Covered in Warranty</div><div>Manufacturing Defects</div>
                  <div className="text-muted-foreground">Not Covered in Warranty</div><div>Physical and Water Damages</div>
                </div>
              </div>
            </>
          )}
          <button
            className="mt-4 text-primary font-semibold hover:underline"
            onClick={() => setShowSpecs(s => !s)}
          >
            {showSpecs ? 'Read Less' : 'Read More'}
          </button>
        </div>
      </div>
      {/* Always show other products below, as before */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Explore More Products</h2>
        <ProductGrid products={otherProducts} onAddToCart={addToCart} />
      </div>
    </div>
  );
};

export default ProductDetail; 