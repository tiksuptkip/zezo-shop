export type Category = 'MEN' | 'WOMEN' | 'KIDS' | 'SALE';

export type MenSubCategory = 'Shirts' | 'Blouses' | 'T-Shirts' | 'Pants' | 'Shoes' | 'Boots' | 'Jackets';
export type WomenSubCategory = 'Blouses' | 'T-Shirts' | 'Pants' | 'Dresses' | 'Skirts' | 'Shoes' | 'Heels' | 'Bags';
export type KidsSubCategory = 'Boys' | 'Girls' | 'Baby';
export type SubCategory = MenSubCategory | WomenSubCategory | KidsSubCategory;

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  material: string;
  category: Category;
  subCategory: string;
  originalPrice: number; // Regular price CAD
  discountPrice?: number; // Sale price CAD (shown in bold red)
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  stock: number; // Admin adds stock; if <= 5 and > 0 shows "Only X left in stock!" in red. If 0 shows Out of Stock
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface ShippingZone {
  id: string;
  provinceCode: string; // e.g. ON, QC, BC, AB, YT
  provinceName: string; // e.g. Ontario, Quebec
  shippingCost: number; // in CAD
  estimatedDays: string;
  isActive: boolean;
}

export interface CartItem {
  id: string; // unique item cart key (productId + color + size)
  productId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface Address {
  fullName: string;
  street: string;
  apt?: string;
  city: string;
  province: string; // Province code or name
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Returned' | 'Cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  originalPrice?: number;
  colorName: string;
  colorHex: string;
  size: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // e.g. ZEZO-CA-84920
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number; // $0 if subtotal >= freeShippingThreshold
  isFreeShipping: boolean;
  total: number;
  paymentMethod: 'Cash on Delivery';
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  returnPolicyNoticeAcknowledged: boolean;
  returnedDetails?: {
    returnShippingCost: number;
    returnedAt: string;
    calculatedProvince: string;
    note?: string;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: Address[];
  wishlist: string[]; // product ids
  createdAt: string;
  role: 'customer' | 'admin';
}
