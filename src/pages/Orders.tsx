import { useState } from 'react';
import { mockOrders } from '@/data/mockOrders';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock, Download, HelpCircle, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const userEmail = 'john.doe@email.com'; // TODO: Replace with real user context if available
const userOrders = mockOrders.filter(order => order.userEmail === userEmail);

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [reorderModal, setReorderModal] = useState(null); // holds order or null
  const [reorderQuantities, setReorderQuantities] = useState({});
  const navigate = useNavigate();

  // Simple invoice download as text file
  const handleDownloadInvoice = (order) => {
    setDownloading(true);
    const lines = [
      `Invoice for Order: ${order.orderId}`,
      `Date: ${format(new Date(order.orderDate), 'dd MMM yyyy, hh:mm a')}`,
      `Status: ${order.status}`,
      '',
      'Products:',
      ...order.products.map(p => `- ${p.name} x${p.quantity} ($${(p.price * p.quantity).toFixed(2)})`),
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
  const handleSupport = (order) => {
    window.open(`mailto:support@buyez.com?subject=Support%20Request%20for%20Order%20${order.orderId}`);
  };

  // Reorder: open modal for quantity selection
  const handleReorder = (order) => {
    const initialQuantities = {};
    order.products.forEach(p => { initialQuantities[p.id] = p.quantity; });
    setReorderQuantities(initialQuantities);
    setReorderModal(order);
  };

  // On confirm reorder: update cart and go to checkout
  const handleConfirmReorder = () => {
    const order = reorderModal;
    const cartKey = 'shopez-cart';
    let cart = [];
    try {
      const saved = localStorage.getItem(cartKey);
      if (saved) cart = JSON.parse(saved);
    } catch {}
    order.products.forEach(product => {
      const qty = reorderQuantities[product.id] || 1;
      const existing = cart.find(item => item.id === product.id);
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold text-primary mb-8 tracking-tight">My Orders</h1>
        {userOrders.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">No orders found for this account.</div>
        ) : (
          <div className="flex flex-col gap-8">
            {userOrders.map(order => (
              <button
                key={order.orderId}
                className="border rounded-2xl p-6 bg-card/80 shadow-md text-left hover:shadow-lg transition-shadow focus:outline-none"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Order ID:</span>
                    <span className="font-mono font-semibold text-primary">{order.orderId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColor(order.status)}>{order.status}</Badge>
                    <span className="text-xs text-muted-foreground">{format(new Date(order.orderDate), 'dd MMM yyyy, hh:mm a')}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {order.products.map(product => (
                    <div key={product.id} className="flex items-center gap-4 border-b last:border-b-0 py-2">
                      <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover border" />
                      <div className="flex-1">
                        <div className="font-semibold text-base">{product.name}</div>
                        <div className="text-xs text-muted-foreground">Qty: {product.quantity}</div>
                      </div>
                      <div className="font-bold text-primary">${(product.price * product.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="font-medium">Total: <span className="text-lg text-primary font-bold">${order.totalAmount.toFixed(2)}</span></span>
                  {order.deliveryDate && order.status === 'Delivered' && (
                    <span className="text-green-700">Delivered on {format(new Date(order.deliveryDate), 'dd MMM yyyy')}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={open => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg w-full p-4 sm:p-6 rounded-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Order Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                {/* Address Section */}
                <div>
                  <div className="flex items-center gap-2 text-base font-semibold mb-1">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Delivery Address</span>
                  </div>
                  <div className="ml-7 text-sm text-muted-foreground">
                    <div><span className="font-medium text-foreground">{selectedOrder.address.name}</span></div>
                    <div>{selectedOrder.address.address}, {selectedOrder.address.city}, {selectedOrder.address.pincode}</div>
                    <div>Mobile: {selectedOrder.address.mobile}</div>
                  </div>
                </div>

                {/* Payment Section */}
                <div>
                  <div className="flex items-center gap-2 text-base font-semibold mb-1">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span>Payment Details</span>
                  </div>
                  <div className="ml-7 text-sm text-muted-foreground">
                    <div>Method: {paymentIcon(selectedOrder.payment.method)}{selectedOrder.payment.method}</div>
                    <div>Status: {paymentStatusIcon(selectedOrder.payment.status)}{selectedOrder.payment.status}</div>
                    {selectedOrder.payment.transactionId && (
                      <div>Transaction ID: <span className="font-mono text-xs">{selectedOrder.payment.transactionId}</span></div>
                    )}
                  </div>
                </div>

                {/* Tracking Section */}
                <div>
                  <div className="flex items-center gap-2 text-base font-semibold mb-1">
                    <Truck className="w-5 h-5 text-primary" />
                    <span>Tracking</span>
                  </div>
                  <ol className="ml-7 border-l-2 border-primary/30 pl-4 text-sm">
                    {selectedOrder.tracking.map((step, idx) => (
                      <li key={idx} className="mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="font-medium text-foreground">{step.label}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{format(new Date(step.date), 'dd MMM, hh:mm a')}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Products Section */}
                <div>
                  <div className="font-semibold text-base mb-1">Products:</div>
                  <div className="flex flex-col gap-2">
                    {selectedOrder.products.map(product => (
                      <div key={product.id} className="flex items-center gap-3 border-b last:border-b-0 py-2">
                        <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover border" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base truncate">{product.name}</div>
                          <div className="text-xs text-muted-foreground">Qty: {product.quantity}</div>
                        </div>
                        <div className="font-bold text-primary text-base">${(product.price * product.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t text-base font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary text-lg">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>

              {/* Footer */}
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                <Button variant="secondary" className="w-full sm:w-auto" onClick={() => handleDownloadInvoice(selectedOrder)} disabled={downloading}>
                  <Download className="w-4 h-4 mr-1" /> {downloading ? 'Downloading...' : 'Invoice'}
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => handleSupport(selectedOrder)}>
                  <HelpCircle className="w-4 h-4 mr-1" /> Support
                </Button>
                <Button variant="default" className="w-full sm:w-auto" onClick={() => handleReorder(selectedOrder)}>
                  <ShoppingBag className="w-4 h-4 mr-1" /> Reorder
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setSelectedOrder(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Reorder Modal (restoring its simpler responsive design too) */}
      <Dialog open={!!reorderModal} onOpenChange={open => !open && setReorderModal(null)}>
        <DialogContent className="max-w-md w-full p-6 rounded-2xl">
          {reorderModal && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Reorder Items</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
                {reorderModal.products.map(product => (
                  <div key={product.id} className="flex items-center gap-4 border-b last:border-b-0 py-2">
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover border" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base truncate">{product.name}</div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={reorderQuantities[product.id]}
                      onChange={e => setReorderQuantities(q => ({ ...q, [product.id]: Math.max(1, Math.min(99, Number(e.target.value))) }))}
                      className="w-16 border rounded-md px-2 py-1 text-center"
                    />
                  </div>
                ))}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                <Button variant="default" className="w-full sm:w-auto" onClick={handleConfirmReorder}>
                  <ShoppingBag className="w-4 h-4 mr-1" /> Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setReorderModal(null)}>Cancel</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders; 