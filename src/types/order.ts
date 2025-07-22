export type OrderStatus = 'Cancelled' | 'In Process' | 'Dispatched' | 'Delivered';

export interface OrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderAddress {
  name: string;
  address: string;
  city: string;
  pincode: string;
  mobile: string;
}

export interface OrderPayment {
  method: 'Credit/Debit Card' | 'UPI' | 'Cash on Delivery';
  status: 'Paid' | 'Pending' | 'Failed';
  transactionId?: string;
}

export interface OrderTracking {
  date: string; // ISO string
  label: string;
}

export interface Order {
  orderId: string;
  userEmail: string;
  products: OrderProduct[];
  status: OrderStatus;
  orderDate: string; // ISO string
  deliveryDate?: string; // ISO string, optional
  totalAmount: number;
  address: OrderAddress;
  payment: OrderPayment;
  tracking: OrderTracking[];
} 