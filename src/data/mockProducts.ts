import { Product } from '@/types/product';
import headphonesImg from '@/assets/product-headphones.jpg';
import phoneImg from '@/assets/product-phone.jpg';
import watchImg from '@/assets/product-watch.jpg';
import laptopImg from '@/assets/product-laptop.jpg';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    category: 'Audio',
    price: 199,
    originalPrice: 249,
    image: headphonesImg,
    rating: 4.8,
    reviews: 324,
    stock: 8,
    isNew: true,
    description: 'Experience premium sound quality with our latest wireless headphones featuring active noise cancellation and 30-hour battery life.'
  },
  {
    id: '2',
    name: 'Smartphone Pro Max',
    category: 'Mobile',
    price: 999,
    originalPrice: 1199,
    image: phoneImg,
    rating: 4.9,
    reviews: 856,
    stock: 12,
    description: 'The most advanced smartphone with cutting-edge camera technology and lightning-fast performance.'
  },
  {
    id: '3',
    name: 'Smart Watch Series X',
    category: 'Wearables',
    price: 399,
    image: watchImg,
    rating: 4.7,
    reviews: 234,
    stock: 3,
    isNew: true,
    description: 'Stay connected and track your fitness with our most advanced smartwatch featuring health monitoring and GPS.'
  },
  {
    id: '4',
    name: 'MacBook Pro 16"',
    category: 'Laptops',
    price: 2499,
    originalPrice: 2799,
    image: laptopImg,
    rating: 4.9,
    reviews: 567,
    stock: 15,
    description: 'Professional laptop with M2 Pro chip, stunning Liquid Retina XDR display, and all-day battery life.'
  },
  {
    id: '5',
    name: 'Gaming Headset RGB',
    category: 'Gaming',
    price: 149,
    image: headphonesImg,
    rating: 4.6,
    reviews: 189,
    stock: 22,
    description: 'Immersive gaming experience with 7.1 surround sound and customizable RGB lighting.'
  },
  {
    id: '6',
    name: 'Wireless Charging Pad',
    category: 'Accessories',
    price: 49,
    originalPrice: 69,
    image: phoneImg,
    rating: 4.4,
    reviews: 145,
    stock: 1,
    description: 'Fast wireless charging for all your devices with sleek design and LED indicators.'
  },
  {
    id: '7',
    name: 'Fitness Tracker Band',
    category: 'Wearables',
    price: 129,
    image: watchImg,
    rating: 4.5,
    reviews: 298,
    stock: 18,
    isNew: true,
    description: 'Track your workouts, monitor health metrics, and stay motivated with our fitness tracker.'
  },
  {
    id: '8',
    name: 'Ultrabook Slim 14"',
    category: 'Laptops',
    price: 899,
    originalPrice: 1099,
    image: laptopImg,
    rating: 4.3,
    reviews: 167,
    stock: 9,
    description: 'Lightweight and powerful ultrabook perfect for work and creativity on the go.'
  },
  {
    id: '9',
    name: 'Bluetooth Speaker Mini',
    category: 'Audio',
    price: 59,
    image: headphonesImg,
    rating: 4.2,
    reviews: 88,
    stock: 20,
    isNew: false,
    description: 'Portable Bluetooth speaker with deep bass and 12-hour battery life.'
  },
  {
    id: '10',
    name: 'Noise Cancelling Earbuds',
    category: 'Audio',
    price: 129,
    originalPrice: 159,
    image: headphonesImg,
    rating: 4.5,
    reviews: 210,
    stock: 14,
    isNew: true,
    description: 'Compact earbuds with active noise cancellation and wireless charging.'
  },
  {
    id: '11',
    name: 'Smartphone Lite',
    category: 'Mobile',
    price: 499,
    image: phoneImg,
    rating: 4.1,
    reviews: 95,
    stock: 30,
    isNew: false,
    description: 'Affordable smartphone with all-day battery and dual cameras.'
  },
  {
    id: '12',
    name: 'Classic Analog Watch',
    category: 'Wearables',
    price: 79,
    image: watchImg,
    rating: 4.0,
    reviews: 54,
    stock: 25,
    isNew: false,
    description: 'Elegant analog watch with leather strap and water resistance.'
  },
  {
    id: '13',
    name: 'Gaming Laptop 17"',
    category: 'Laptops',
    price: 1799,
    originalPrice: 1999,
    image: laptopImg,
    rating: 4.7,
    reviews: 312,
    stock: 7,
    isNew: true,
    description: 'High-performance gaming laptop with RTX graphics and 144Hz display.'
  },
  {
    id: '14',
    name: 'Wireless Mouse Pro',
    category: 'Accessories',
    price: 39,
    image: phoneImg,
    rating: 4.3,
    reviews: 120,
    stock: 40,
    isNew: false,
    description: 'Ergonomic wireless mouse with adjustable DPI and silent clicks.'
  },
  {
    id: '15',
    name: 'VR Headset',
    category: 'Gaming',
    price: 299,
    image: headphonesImg,
    rating: 4.6,
    reviews: 178,
    stock: 10,
    isNew: true,
    description: 'Immersive VR headset compatible with PC and mobile devices.'
  },
  {
    id: '16',
    name: 'Convertible Laptop 2-in-1',
    category: 'Laptops',
    price: 1099,
    originalPrice: 1299,
    image: laptopImg,
    rating: 4.4,
    reviews: 143,
    stock: 11,
    isNew: false,
    description: 'Versatile 2-in-1 laptop with touchscreen and stylus support.'
  }
];