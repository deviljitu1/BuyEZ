import { useState } from 'react';
import { mockOrders } from '@/data/mockOrders';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock, Download, HelpCircle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types ---
type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type Address = {
  name: string;
  address: string;
  city: string;
  pincode: string;
  mobile: string;
};

type Payment = {
  method: string;
  status: string;
  transactionId?: string;
};

type TrackingStep = {
  label: string;
  date: string;
};

type Order = {
  orderId: string;
  userEmail: string;
  orderDate: string;
  deliveryDate?: string;
  status: string;
  products: Product[];
  totalAmount: number;
  address: Address;
  payment: Payment;
  tracking: TrackingStep[];
};

const userEmail = 'john.doe@email.com'; // TODO: Replace with real user context if available
const userOrders: Order[] = mockOrders.filter((order: Order) => order.userEmail === userEmail);

const statusColor = (status: string) => {
  switch (status) {
    case 'Delivered': return 'bg-green-100 text-green-700';
    case 'Dispatched': return 'bg-blue-100 text-blue-700';
    case 'In Process': return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-muted text-muted-foreground';
  }
};

const paymentIcon = (method: string) => {
  switch (method) {
    case 'Credit/Debit Card': return <CreditCard className="w-4 h-4 inline mr-1" />;
    case 'UPI': return <CreditCard className="w-4 h-4 inline mr-1" />;
    case 'Cash on Delivery': return <Truck className="w-4 h-4 inline mr-1" />;
    default: return <CreditCard className="w-4 h-4 inline mr-1" />;
  }
};

const paymentStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return <CheckCircle className="w-4 h-4 text-green-600 inline mr-1" />;
    case 'Pending': return <Clock className="w-4 h-4 text-yellow-600 inline mr-1" />;
    case 'Failed': return <XCircle className="w-4 h-4 text-red-600 inline mr-1" />;
    default: return null;
  }
};

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [reorderModal, setReorderModal] = useState<Order | null>(null); // holds order or null
  const [reorderQuantities, setReorderQuantities] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  // Simple invoice download as text file
  const handleDownloadInvoice = (order: Order) => {
    setDownloading(true);
    const lines = [
      `Invoice for Order: ${order.orderId}`,
      `Date: ${format(new Date(order.orderDate), 'dd MMM yyyy, hh:mm a')}`,
      `Status: ${order.status}`,
      '',
      'Products:',
      ...order.products.map((p: Product) => `- ${p.name} x${p.quantity} ($${(p.price * p.quantity).toFixed(2)})`),
      '',
      `Total: $${order.totalAmount.toFixed(2)}`,
      '',
      'Delivery Address:',
      `${order.address.name}, ${order.address.address}, ${order.address.city}, ${order.address.pincode}`,
      `Mobile: ${order.address.mobile}`,
      '',
      'Payment:',
      `Method: ${order.payment.method}`,
      `Status: ${order.payment.status}`,
      order.payment.transactionId ? `Transaction ID: ${order.payment.transactionId}` : '',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 100);
  };

  // Support: open mailto
  const handleSupport = (order: Order) => {
    window.open(`mailto:support@buyez.com?subject=Support%20Request%20for%20Order%20${order.orderId}`);
  };

  // Reorder: open modal for quantity selection
  const handleReorder = (order: Order) => {
    const initialQuantities: Record<string, number> = {};
    order.products.forEach((p: Product) => { initialQuantities[p.id] = p.quantity; });
    setReorderQuantities(initialQuantities);
    setSelectedOrder(null); // Close product details modal
    setReorderModal(order); // Open reorder modal
  };

  // On confirm reorder: update cart and go to checkout
  const handleConfirmReorder = () => {
    const order = reorderModal;
    if (!order) return;
    const cartKey = 'shopez-cart';
    let cart: Product[] = [];
    try {
      const saved = localStorage.getItem(cartKey);
      if (saved) cart = JSON.parse(saved);
    } catch {}
    order.products.forEach((product: Product) => {
      const qty = reorderQuantities[product.id] || 1;
      const existing = cart.find((item: Product) => item.id === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({ ...product, quantity: qty });
      }
    });
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    setReorderModal(null);
    setSelectedOrder(null);
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-primary/10 to-background px-2 sm:px-4 py-2 sm:py-4 pb-8 sm:pb-12 min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary mb-4 sm:mb-6 tracking-tight">My Orders</h1>
        {userOrders.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 sm:py-16">No orders found for this account.</div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {userOrders.map((order: Order) => (
              <button
                key={order.orderId}
                className="border rounded-lg sm:rounded-xl p-3 sm:p-4 bg-card/80 shadow-sm hover:shadow-md transition-shadow focus:outline-none w-full text-left"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Order ID:</span>
                    <span className="font-mono font-semibold text-primary break-all">{order.orderId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColor(order.status)}>{order.status}</Badge>
                    <span className="text-xs text-muted-foreground">{format(new Date(order.orderDate), 'dd MMM yyyy, hh:mm a')}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 sm:gap-2">
                  {order.products.map((product: Product) => (
                    <div key={product.id} className="flex items-center gap-2 sm:gap-3 border-b last:border-b-0 py-1.5 sm:py-2">
                      <img src={product.image} alt={product.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{product.name}</div>
                        <div className="text-xs text-muted-foreground">Qty: {product.quantity}</div>
                      </div>
                      <div className="font-bold text-primary text-sm">${(product.price * product.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 text-sm">
                  <span className="font-medium">Total: <span className="text-primary font-bold">${order.totalAmount.toFixed(2)}</span></span>
                  {order.deliveryDate && order.status === 'Delivered' && (
                    <span className="text-green-700 mt-1 sm:mt-0 text-xs">Delivered on {format(new Date(order.deliveryDate), 'dd MMM yyyy')}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
        {/* Order Details Modal */}
        <Dialog open={!!selectedOrder} onOpenChange={open => !open && setSelectedOrder(null)}>
          <DialogContent className="max-w-[95vw] w-full sm:max-w-3xl p-2 sm:p-3 md:p-6 rounded-xl sm:rounded-2xl mx-auto mt-16 sm:mt-20 mb-2 sm:mb-4 max-h-[90vh] sm:max-h-[80vh] md:max-h-[70vh] h-auto flex flex-col overflow-hidden z-[999999]">
            {selectedOrder && (
              <>
                <DialogHeader className="px-1 sticky top-0 bg-background z-10 pb-2 border-b">
                  <DialogTitle className="text-base sm:text-lg md:text-xl">Order Details</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2 py-2">
                  {/* Address Section */}
                  <div className="bg-muted/10 rounded-lg p-2 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-semibold mb-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span>Delivery Address</span>
                    </div>
                    <div className="ml-5 sm:ml-6 md:ml-7 text-xs sm:text-sm text-muted-foreground space-y-0.5">
                      <div><span className="font-medium text-foreground">{selectedOrder.address.name}</span></div>
                      <div>{selectedOrder.address.address}, {selectedOrder.address.city}, {selectedOrder.address.pincode}</div>
                      <div>Mobile: {selectedOrder.address.mobile}</div>
                    </div>
                  </div>
                  {/* Payment Section */}
                  <div className="bg-muted/10 rounded-lg p-2 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-semibold mb-1">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span>Payment Details</span>
                    </div>
                    <div className="ml-5 sm:ml-6 md:ml-7 text-xs sm:text-sm text-muted-foreground">
                      <div>Method: {paymentIcon(selectedOrder.payment.method)}{selectedOrder.payment.method}</div>
                      <div>Status: {paymentStatusIcon(selectedOrder.payment.status)}{selectedOrder.payment.status}</div>
                      {selectedOrder.payment.transactionId && (
                        <div>Transaction ID: <span className="font-mono text-xs">{selectedOrder.payment.transactionId}</span></div>
                      )}
                    </div>
                  </div>
                  {/* Tracking Section */}
                  <div className="bg-muted/10 rounded-lg p-2 sm:p-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-semibold mb-1">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span>Tracking</span>
                    </div>
                    <ol className="ml-5 sm:ml-6 md:ml-7 border-l-2 border-primary/30 pl-2 sm:pl-3 md:pl-4 text-xs sm:text-sm">
                      {selectedOrder.tracking.map((step: TrackingStep, idx: number) => (
                        <li key={idx} className="mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                          <span className="font-medium text-foreground">{step.label}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground ml-auto">{format(new Date(step.date), 'dd MMM, hh:mm a')}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {/* Products Section */}
                  <div className="bg-muted/10 rounded-lg p-2 sm:p-3">
                    <div className="font-semibold text-sm sm:text-base mb-1">Products:</div>
                    <div className="flex flex-col gap-2">
                      {selectedOrder.products.map((product: Product) => (
                        <div key={product.id} className="flex items-center gap-2 sm:gap-3 border-b last:border-b-0 py-2 bg-background rounded-lg px-2">
                          <img src={product.image} alt={product.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border" />
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <div className="font-semibold text-sm sm:text-base truncate">{product.name}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">Qty: {product.quantity}</div>
                          </div>
                          <div className="font-bold text-primary text-sm sm:text-base">${(product.price * product.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Total */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 pt-2 border-t text-sm sm:text-base font-semibold gap-1 px-1 sticky bottom-0 bg-background z-10">
                  <span>Total Amount:</span>
                  <span className="text-primary text-base sm:text-lg">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                {/* Footer */}
                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2 w-full px-1 sticky bottom-0 bg-background z-10 pt-2 border-t">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => handleDownloadInvoice(selectedOrder)} disabled={downloading}>
                    <Download className="w-4 h-4 mr-2" /> {downloading ? 'Downloading...' : 'Invoice'}
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => handleSupport(selectedOrder)}>
                    <HelpCircle className="w-4 h-4 mr-2" /> Support
                  </Button>
                  <Button variant="default" size="lg" className="w-full sm:w-auto" onClick={() => handleReorder(selectedOrder)}>
                    <ShoppingBag className="w-4 h-4 mr-2" /> Reorder
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => setSelectedOrder(null)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        {/* Reorder Modal */}
        <Dialog open={!!reorderModal} onOpenChange={open => !open && setReorderModal(null)}>
          <DialogContent className="max-w-[95vw] w-full sm:max-w-2xl p-2 sm:p-3 md:p-6 rounded-xl sm:rounded-2xl mx-auto my-2 sm:my-4 max-h-[90vh] sm:max-h-[80vh] md:max-h-[70vh] h-auto flex flex-col overflow-hidden z-50">
            {reorderModal && (
              <>
                <DialogHeader className="px-1 sticky top-0 bg-background z-10 pb-2 border-b">
                  <DialogTitle className="text-base sm:text-lg md:text-xl">Reorder Items</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 sm:gap-3 pr-1 sm:pr-2 py-2">
                  {reorderModal.products.map((product: Product) => (
                    <div key={product.id} className="flex items-center gap-2 sm:gap-3 md:gap-4 border-b last:border-b-0 py-2 px-2 bg-muted/10 rounded-lg">
                      <img src={product.image} alt={product.name} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg object-cover border" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="font-semibold text-sm sm:text-base truncate">{product.name}</div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs sm:text-sm text-muted-foreground">Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={reorderQuantities[product.id]}
                            onChange={e => setReorderQuantities(q => ({ ...q, [product.id]: Math.max(1, Math.min(99, Number(e.target.value))) }))}
                            className="w-16 sm:w-20 h-8 sm:h-10 border rounded-md px-2 py-1 text-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 w-full px-1 sticky bottom-0 bg-background z-10 pt-2 border-t">
                  <Button variant="default" size="lg" className="w-full sm:w-auto" onClick={handleConfirmReorder}>
                    <ShoppingBag className="w-4 h-4 mr-2" /> Proceed to Checkout
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => setReorderModal(null)}>Cancel</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Orders;