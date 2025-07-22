import { Order } from '@/types/order';
import { mockProducts } from './mockProducts';

export const mockOrders: Order[] = [
  {
    orderId: 'ORD-1001',
    userEmail: 'john.doe@email.com',
    products: [
      {
        id: mockProducts[0].id,
        name: mockProducts[0].name,
        image: mockProducts[0].image,
        price: mockProducts[0].price,
        quantity: 1,
      },
      {
        id: mockProducts[2].id,
        name: mockProducts[2].name,
        image: mockProducts[2].image,
        price: mockProducts[2].price,
        quantity: 2,
      },
    ],
    status: 'Delivered',
    orderDate: '2024-05-01T10:30:00Z',
    deliveryDate: '2024-05-05T15:00:00Z',
    totalAmount: mockProducts[0].price * 1 + mockProducts[2].price * 2,
    address: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      pincode: '10001',
      mobile: '9876543210',
    },
    payment: {
      method: 'Credit/Debit Card',
      status: 'Paid',
      transactionId: 'TXN123456',
    },
    tracking: [
      { date: '2024-05-01T10:30:00Z', label: 'Ordered' },
      { date: '2024-05-02T09:00:00Z', label: 'Dispatched' },
      { date: '2024-05-05T15:00:00Z', label: 'Delivered' },
    ],
  },
  {
    orderId: 'ORD-1002',
    userEmail: 'jane.smith@email.com',
    products: [
      {
        id: mockProducts[1].id,
        name: mockProducts[1].name,
        image: mockProducts[1].image,
        price: mockProducts[1].price,
        quantity: 1,
      },
    ],
    status: 'Dispatched',
    orderDate: '2024-05-10T14:20:00Z',
    deliveryDate: undefined,
    totalAmount: mockProducts[1].price,
    address: {
      name: 'Jane Smith',
      address: '456 Park Ave',
      city: 'Los Angeles',
      pincode: '90001',
      mobile: '9123456780',
    },
    payment: {
      method: 'UPI',
      status: 'Paid',
      transactionId: 'TXN654321',
    },
    tracking: [
      { date: '2024-05-10T14:20:00Z', label: 'Ordered' },
      { date: '2024-05-11T10:00:00Z', label: 'Dispatched' },
    ],
  },
  {
    orderId: 'ORD-1003',
    userEmail: 'john.doe@email.com',
    products: [
      {
        id: mockProducts[3].id,
        name: mockProducts[3].name,
        image: mockProducts[3].image,
        price: mockProducts[3].price,
        quantity: 1,
      },
    ],
    status: 'In Process',
    orderDate: '2024-05-15T09:00:00Z',
    deliveryDate: undefined,
    totalAmount: mockProducts[3].price,
    address: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      pincode: '10001',
      mobile: '9876543210',
    },
    payment: {
      method: 'Cash on Delivery',
      status: 'Pending',
    },
    tracking: [
      { date: '2024-05-15T09:00:00Z', label: 'Ordered' },
    ],
  },
  {
    orderId: 'ORD-1004',
    userEmail: 'jane.smith@email.com',
    products: [
      {
        id: mockProducts[4].id,
        name: mockProducts[4].name,
        image: mockProducts[4].image,
        price: mockProducts[4].price,
        quantity: 1,
      },
    ],
    status: 'Cancelled',
    orderDate: '2024-05-18T11:45:00Z',
    deliveryDate: undefined,
    totalAmount: mockProducts[4].price,
    address: {
      name: 'Jane Smith',
      address: '456 Park Ave',
      city: 'Los Angeles',
      pincode: '90001',
      mobile: '9123456780',
    },
    payment: {
      method: 'Credit/Debit Card',
      status: 'Failed',
      transactionId: 'TXN000000',
    },
    tracking: [
      { date: '2024-05-18T11:45:00Z', label: 'Ordered' },
      { date: '2024-05-18T12:00:00Z', label: 'Cancelled' },
    ],
  },
]; 