import { useState, useEffect } from 'react';
import { useUnifiedCart } from '@/hooks/useUnifiedCart';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Login',
  'Delivery Address',
  'Order Summary',
  'Payment Option',
];

const Checkout = () => {
  const [step, setStep] = useState(0);
  const { items, getCartTotal } = useUnifiedCart();
  const navigate = useNavigate();
  // Coupon state
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);

  // Address state
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('shopez-addresses');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [showAddForm, setShowAddForm] = useState(addresses.length === 0);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    mobile: '',
  });

  useEffect(() => {
    localStorage.setItem('shopez-addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Placeholder forms for each step
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Login</h2>
            <input className="w-full border rounded px-4 py-2" placeholder="Email or Mobile Number" />
            <button className="w-full bg-primary text-primary-foreground rounded px-4 py-2 font-semibold" onClick={() => setStep(1)}>
              Continue
            </button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Delivery Address</h2>
            {addresses.length > 0 && !showAddForm && (
              <>
                <label className="block mb-2 font-semibold">Select Address</label>
                <div className="space-y-3 mb-2">
                  {addresses.map((addr, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-all ${selectedAddress === idx ? 'border-primary ring-2 ring-primary' : 'border-muted'}`}
                      onClick={() => setSelectedAddress(idx)}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === idx}
                        onChange={() => setSelectedAddress(idx)}
                        className="mt-1 accent-primary"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{addr.name}</div>
                        <div className="text-sm text-muted-foreground">{addr.address}, {addr.city}, {addr.pincode}</div>
                        <div className="text-sm text-muted-foreground">Mobile: {addr.mobile}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <button
                  className="w-full bg-primary text-primary-foreground rounded px-4 py-2 font-semibold mb-2"
                  onClick={() => setStep(2)}
                >
                  Deliver Here
                </button>
                <button
                  className="w-full border border-primary text-primary rounded px-4 py-2 font-semibold"
                  onClick={() => setShowAddForm(true)}
                >
                  + Add New Address
                </button>
              </>
            )}
            {(showAddForm || addresses.length === 0) && (
              <form
                className="space-y-2"
                onSubmit={e => {
                  e.preventDefault();
                  setAddresses([...addresses, newAddress]);
                  setSelectedAddress(addresses.length);
                  setNewAddress({ name: '', address: '', city: '', pincode: '', mobile: '' });
                  setShowAddForm(false);
                }}
              >
                <input className="w-full border rounded px-4 py-2" placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} required />
                <input className="w-full border rounded px-4 py-2" placeholder="Address" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} required />
                <input className="w-full border rounded px-4 py-2" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} required />
                <input className="w-full border rounded px-4 py-2" placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} required />
                <input className="w-full border rounded px-4 py-2" placeholder="Mobile Number" value={newAddress.mobile} onChange={e => setNewAddress({ ...newAddress, mobile: e.target.value })} required />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-primary text-primary-foreground rounded px-4 py-2 font-semibold">
                    Save & Deliver Here
                  </button>
                  {addresses.length > 0 && (
                    <button type="button" className="flex-1 border border-primary text-primary rounded px-4 py-2 font-semibold" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Order Summary</h2>
            <ul className="divide-y">
              {items.map(item => (
                <li key={item.id} className="py-2 flex justify-between items-center">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-primary text-primary-foreground rounded px-4 py-2 font-semibold" onClick={() => setStep(3)}>
              Continue to Payment
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Payment Option</h2>
            {/* Coupon Code */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={coupon}
                onChange={e => setCoupon(e.target.value.toUpperCase())}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-48"
                disabled={!!appliedCoupon}
              />
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary-glow text-sm font-semibold shadow w-full sm:w-auto"
                onClick={() => {
                  if (appliedCoupon) {
                    setCoupon('');
                    setAppliedCoupon('');
                    setDiscount(0);
                    setCouponError('');
                    return;
                  }
                  if (coupon === 'SAVE10') {
                    setAppliedCoupon('SAVE10');
                    setDiscount(0.1);
                    setCouponError('');
                  } else {
                    setCouponError('Invalid coupon code');
                  }
                }}
                type="button"
              >
                {appliedCoupon ? 'Remove' : 'Apply'}
              </button>
            </div>
            {appliedCoupon && (
              <div className="text-success text-sm mb-2">Coupon <span className="font-semibold">{appliedCoupon}</span> applied! 10% off</div>
            )}
            {couponError && <div className="text-red-500 text-xs mb-2">{couponError}</div>}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" defaultChecked /> Credit/Debit Card
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" /> UPI
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" /> Cash on Delivery
              </label>
            </div>
            <button className="w-full bg-success text-white rounded px-4 py-2 font-semibold" onClick={() => navigate('/order-confirm')}>
              Place Order
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl flex flex-col md:flex-row gap-8">
      {/* Stepper and Forms */}
      <div className="flex-1 bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-8">
          {steps.map((label, idx) => (
            <div key={label} className="flex items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${step === idx ? 'bg-primary' : 'bg-muted text-muted-foreground'}`}>{idx + 1}</div>
              {idx < steps.length - 1 && <div className="w-8 h-1 bg-muted mx-2" />}
            </div>
          ))}
        </div>
        <div className="mb-6">
          <div className="flex justify-between">
            {steps.map((label, idx) => (
              <span key={label} className={`text-xs font-semibold ${step === idx ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            ))}
          </div>
        </div>
        {renderStep()}
      </div>
      {/* Price Details */}
      <div className="w-full md:w-80 bg-white rounded-lg shadow p-6 h-fit">
        <h2 className="text-lg font-bold mb-4">Price Details</h2>
        <div className="flex justify-between mb-2">
          <span>Price ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Charges</span>
          <span className="text-success">FREE</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between mb-2 text-success">
            <span>Coupon Discount</span>
            <span>- ${(getCartTotal() * discount).toFixed(2)}</span>
          </div>
        )}
        <div className="border-t my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total Amount</span>
          <span>${(getCartTotal() * (1 - discount)).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 