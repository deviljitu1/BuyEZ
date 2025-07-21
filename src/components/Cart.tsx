import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '@/types/product';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartProps) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate checkout
    setIsCheckingOut(false);
    // Show success message or redirect
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          style={{ zIndex: 999999 }}
        >
          <div 
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background shadow-lg p-6 border-l"
            style={{ zIndex: 999999 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Shopping Cart</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Cart Items */}
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                  <p className="text-xl font-medium">Your cart is empty</p>
                  <p className="text-muted-foreground">Add some products to get started</p>
                  <Button onClick={() => { onClose(); navigate('/'); }}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4 py-4 border-b">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-muted-foreground">${item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">
                        ${items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        onClose();
                        navigate('/checkout');
                      }}
                    >
                      Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};