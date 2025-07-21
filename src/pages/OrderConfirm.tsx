import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';

const OrderConfirm = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Optionally clear cart on mount
  // useEffect(() => { clearCart(); }, []);

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl text-center">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-success mb-4">Thank You for Your Purchase!</h1>
        <p className="text-lg mb-6">Congratulations, your order has been successfully placed.</p>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <ul className="divide-y mb-4">
            {items.map(item => (
              <li key={item.id} className="py-2 flex justify-between items-center">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-lg">
            <span>Total Paid</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
        </div>
        <button
          className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow hover:bg-primary-glow"
          onClick={() => { clearCart(); navigate('/'); }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirm; 