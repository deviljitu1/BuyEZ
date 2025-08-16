export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  description?: string;
  specifications?: { [key: string]: string };
}

export interface CartItem extends Product {
  quantity: number;
}