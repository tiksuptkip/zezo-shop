import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  ShippingZone,
  CartItem,
  Address,
  Order,
  OrderStatus,
  User,
  Category,
  ProductColor,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { DEFAULT_SHIPPING_ZONES, FREE_SHIPPING_THRESHOLD } from '../data/shippingZones';
import { INITIAL_ORDERS, INITIAL_USERS } from '../data/initialData';
import { getAllUsers, saveUser, autoSaveUserFromOrder, captureReferralFromUrl } from '../utils/users';
import { sendOrderConfirmation, sendShippingEmail } from '../utils/email';

export type ActiveView = 
  | 'home' 
  | 'shop' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'order-success' 
  | 'account' 
  | 'return-policy' 
  | 'admin'
  | 'register'
  | 'login';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Shipping
  shippingZones: ShippingZone[];
  freeShippingThreshold: number;
  setFreeShippingThreshold: (val: number) => void;
  addShippingZone: (zone: Omit<ShippingZone, 'id'>) => void;
  updateShippingZone: (id: string, updates: Partial<ShippingZone>) => void;
  deleteShippingZone: (id: string) => void;
  calculateShippingCost: (province: string, subtotal: number) => {
    cost: number;
    isFree: boolean;
    zoneName: string;
    estimatedDays: string;
  };

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderInfo: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: Address;
    returnAcknowledged: boolean;
    discount?: number;
    referredBy?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  markOrderAsShipped: (orderId: string, trackingNumber: string, shippingCompany?: string) => Promise<boolean>;
  markOrderAsReturned: (orderId: string, reasonNote?: string) => {
    success: boolean;
    calculatedReturnCost: number;
    province: string;
  };
  lastPlacedOrder: Order | null;

  // Users & Auth
  currentUser: User | null;
  users: User[];
  login: (email: string) => boolean;
  register: (data: { fullName: string; email: string; phone: string }) => boolean;
  logout: () => void;
  addUserAddress: (address: Address) => void;
  deleteUserAddress: (index: number) => void;

  // Admin
  isAdminLoggedIn: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;

  // Navigation & Filtering
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategory: Category | null;
  setSelectedCategory: (cat: Category | null) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (sub: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Reset to initial demo state
  resetToDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zezo_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('zezo_products', JSON.stringify(products));
  }, [products]);

  // 2. Shipping Zones state
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(() => {
    const saved = localStorage.getItem('zezo_shipping_zones');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_SHIPPING_ZONES;
  });

  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('zezo_free_shipping_threshold');
    return saved ? Number(saved) : FREE_SHIPPING_THRESHOLD;
  });

  useEffect(() => {
    localStorage.setItem('zezo_shipping_zones', JSON.stringify(shippingZones));
    localStorage.setItem('zezo_free_shipping_threshold', String(freeShippingThreshold));
  }, [shippingZones, freeShippingThreshold]);

  // 3. Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zezo_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('zezo_cart', JSON.stringify(cart));
  }, [cart]);

  // 4. Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('zezo_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['prod-m-01', 'prod-w-05'];
  });

  useEffect(() => {
    localStorage.setItem('zezo_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // 5. Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zezo_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('zezo_orders', JSON.stringify(orders));
  }, [orders]);

  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // 6. Users & Auth state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('zezo_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('zezo_users', JSON.stringify(users));
  }, [users]);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zezo_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default to first user for easy review, or null
    return INITIAL_USERS[0] || null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('zezo_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('zezo_current_user');
    }
  }, [currentUser]);

  // 7. Admin login
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('zezo_admin_logged') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('zezo_admin_logged', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  // 8. Navigation & Filtering state
  const [currentView, setCurrentView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      captureReferralFromUrl();
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase().replace(/\/+$/, '');
      if (pathname === '/admin' || hash === '#/admin' || hash === '#admin') {
        return 'admin';
      }
      if (pathname === '/register' || hash === '#/register' || hash === '#register') {
        return 'register';
      }
      if (pathname === '/login' || hash === '#/login' || hash === '#login') {
        return 'login';
      }
    }
    return 'home';
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync URL changes (browser back/forward or hash change) with currentView
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase().replace(/\/+$/, '');
      if (pathname === '/admin' || hash === '#/admin' || hash === '#admin') {
        setCurrentView('admin');
      } else if (pathname === '/register' || hash === '#/register' || hash === '#register') {
        setCurrentView('register');
      } else if (pathname === '/login' || hash === '#/login' || hash === '#login') {
        setCurrentView('login');
      } else if (pathname === '' || pathname === '/' || hash === '' || hash === '#/' || hash === '#home') {
        setCurrentView((prev) => (prev === 'admin' || prev === 'register' || prev === 'login' ? 'home' : prev));
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Update browser URL when switching between views
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase().replace(/\/+$/, '');
      try {
        if (currentView === 'admin') {
          if (pathname !== '/admin' && hash !== '#/admin' && hash !== '#admin') {
            window.history.pushState({ view: 'admin' }, '', '/admin');
          }
        } else if (currentView === 'register') {
          if (pathname !== '/register' && hash !== '#/register' && hash !== '#register') {
            window.history.pushState({ view: 'register' }, '', '/register');
          }
        } else if (currentView === 'login') {
          if (pathname !== '/login' && hash !== '#/login' && hash !== '#login') {
            window.history.pushState({ view: 'login' }, '', '/login');
          }
        } else {
          if (pathname === '/admin' || pathname === '/register' || pathname === '/login') {
            window.history.pushState({ view: currentView }, '', '/');
          }
        }
      } catch {
        // Fallback for sandboxed iframes where pushState might be restricted
      }
    }
  }, [currentView]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProductId]);

  // --- Product Methods ---
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewCount: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  // --- Shipping Methods ---
  const addShippingZone = (zoneData: Omit<ShippingZone, 'id'>) => {
    const newZone: ShippingZone = {
      ...zoneData,
      id: `zone-${Date.now()}`,
    };
    setShippingZones((prev) => [...prev, newZone]);
  };

  const updateShippingZone = (id: string, updates: Partial<ShippingZone>) => {
    setShippingZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, ...updates } : z))
    );
  };

  const deleteShippingZone = (id: string) => {
    setShippingZones((prev) => prev.filter((z) => z.id !== id));
  };

  const calculateShippingCost = (provinceInput: string, subtotal: number) => {
    // 1. Check FREE SHIPPING rule (>= $1000 CAD)
    const isFree = subtotal >= freeShippingThreshold;

    if (!provinceInput) {
      return {
        cost: isFree ? 0 : 20, // default fallback
        isFree,
        zoneName: 'Canada Standard',
        estimatedDays: '3-5 business days',
      };
    }

    const cleanInput = provinceInput.trim().toLowerCase();
    const matchedZone = shippingZones.find(
      (z) =>
        z.provinceName.toLowerCase() === cleanInput ||
        z.provinceCode.toLowerCase() === cleanInput ||
        cleanInput.includes(z.provinceName.toLowerCase()) ||
        cleanInput.includes(z.provinceCode.toLowerCase())
    );

    if (matchedZone) {
      return {
        cost: isFree ? 0 : matchedZone.shippingCost,
        isFree,
        zoneName: matchedZone.provinceName,
        estimatedDays: matchedZone.estimatedDays,
      };
    }

    // Default rate if not matched
    return {
      cost: isFree ? 0 : 20,
      isFree,
      zoneName: provinceInput,
      estimatedDays: '3-5 business days',
    };
  };

  // --- Cart Methods ---
  const addToCart = (product: Product, color: ProductColor, size: string, quantity: number) => {
    if (product.stock <= 0) return; // Prevent adding out of stock

    const cartItemId = `${product.id}-${color.name}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        // Enforce stock ceiling
        const updatedQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: updatedQty } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity: Math.min(product.stock, quantity),
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxAvailable = item.product.stock;
          return { ...item, quantity: Math.min(maxAvailable, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const unitPrice = item.product.discountPrice ?? item.product.originalPrice;
      return sum + unitPrice * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // --- Wishlist Methods ---
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (currentUser) {
        setCurrentUser({ ...currentUser, wishlist: updated });
      }
      return updated;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // --- Orders Methods ---
  const placeOrder = ({
    customerName,
    customerEmail,
    customerPhone,
    address,
    returnAcknowledged,
    discount = 0,
    referredBy,
  }: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: Address;
    returnAcknowledged: boolean;
    discount?: number;
    referredBy?: string;
  }): Order => {
    const sub = cartSubtotal;
    const { cost: shippingCost, isFree } = calculateShippingCost(address.province, sub);
    const total = sub + shippingCost;
    const discountAmount = Math.max(0, Math.min(discount, total));
    const finalTotal = Math.max(0, total - discountAmount);

    const orderId = `ZEZO-CA-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      title: item.product.title,
      price: item.product.discountPrice ?? item.product.originalPrice,
      originalPrice: item.product.originalPrice,
      colorName: item.selectedColor.name,
      colorHex: item.selectedColor.hex,
      size: item.selectedSize,
      quantity: item.quantity,
      image: item.product.images[0],
    }));

    const activeRef =
      referredBy ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('referred_by') || undefined
        : undefined);

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName,
      customerEmail,
      email: customerEmail,
      customerPhone,
      phone: customerPhone,
      shippingAddress: address,
      address: address,
      items: orderItems,
      subtotal: sub,
      shippingCost,
      isFreeShipping: isFree,
      total,
      discount: discountAmount,
      finalTotal,
      referredBy: activeRef,
      paymentMethod: 'Cash on Delivery',
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          timestamp: new Date().toISOString(),
          note: 'Order placed via Cash on Delivery. Customer acknowledged Canadian Return Policy.',
        },
      ],
      returnPolicyNoticeAcknowledged: returnAcknowledged,
    };

    // Auto-save user to zshop_users list if not exists
    autoSaveUserFromOrder({
      customerName,
      customerEmail,
      customerPhone,
      referredBy: newOrder.referredBy,
    });

    // Send order confirmation email (or simulate via console.log)
    sendOrderConfirmation(newOrder);

    // Decrement stock for ordered items
    setProducts((prev) =>
      prev.map((p) => {
        const matchingCartItems = cart.filter((ci) => ci.productId === p.id);
        if (matchingCartItems.length > 0) {
          const totalBought = matchingCartItems.reduce((acc, curr) => acc + curr.quantity, 0);
          return {
            ...p,
            stock: Math.max(0, p.stock - totalBought),
          };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();
    setCurrentView('order-success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            statusHistory: [
              ...o.statusHistory,
              {
                status,
                timestamp: new Date().toISOString(),
                note: note || `Order marked as ${status}`,
              },
            ],
          };
        }
        return o;
      })
    );
  };

  // Mark order as shipped, generate tracking & send shipping notification email
  const markOrderAsShipped = async (
    orderId: string,
    trackingNumber: string,
    shippingCompany: string = 'Canada Post Courier'
  ): Promise<boolean> => {
    let updatedOrder: Order | undefined;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          updatedOrder = {
            ...o,
            status: 'shipped',
            trackingNumber,
            shippingCompany,
            shippedAt: new Date().toISOString(),
            statusHistory: [
              ...o.statusHistory,
              {
                status: 'shipped',
                timestamp: new Date().toISOString(),
                note: `Order marked as Shipped via ${shippingCompany}. Tracking Number: ${trackingNumber}`,
              },
            ],
          };
          return updatedOrder;
        }
        return o;
      })
    );

    if (updatedOrder) {
      await sendShippingEmail(updatedOrder, trackingNumber, shippingCompany);
      return true;
    }
    return false;
  };

  // In Admin > Orders: "Mark as Returned"
  // When clicked, system calculates return shipping cost based on customer's province
  const markOrderAsReturned = (orderId: string, reasonNote?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, calculatedReturnCost: 0, province: 'Unknown' };

    const customerProvince = order.shippingAddress.province;
    // Calculate standard province return shipping cost
    const matchedZone = shippingZones.find(
      (z) =>
        z.provinceName.toLowerCase() === customerProvince.toLowerCase() ||
        z.provinceCode.toLowerCase() === customerProvince.toLowerCase()
    );

    const calculatedReturnCost = matchedZone ? matchedZone.shippingCost : 20.0;

    const returnDetails = {
      returnShippingCost: calculatedReturnCost,
      returnedAt: new Date().toISOString(),
      calculatedProvince: matchedZone ? matchedZone.provinceName : customerProvince,
      note: reasonNote || `Return processed. Customer pays $${calculatedReturnCost.toFixed(2)} CAD return shipping fee for ${customerProvince}.`,
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Returned',
            returnedDetails: returnDetails,
            statusHistory: [
              ...o.statusHistory,
              {
                status: 'Returned',
                timestamp: new Date().toISOString(),
                note: `Order marked as Returned. Return shipping fee of $${calculatedReturnCost.toFixed(2)} CAD calculated for ${customerProvince} (customer responsibility).`,
              },
            ],
          };
        }
        return o;
      })
    );

    return {
      success: true,
      calculatedReturnCost,
      province: matchedZone ? matchedZone.provinceName : customerProvince,
    };
  };

  // --- User / Auth Methods ---
  const login = (email: string) => {
    const clean = email.trim().toLowerCase();
    const allStored = getAllUsers();
    const stored = allStored.find((u) => u.email.toLowerCase() === clean);
    if (stored) {
      const loadedUser: User = {
        id: stored.id,
        fullName: stored.name,
        name: stored.name,
        email: stored.email,
        phone: stored.phone,
        password: stored.password,
        myReferralCode: stored.myReferralCode,
        referralCodeUsed: stored.referralCodeUsed,
        role: stored.role || 'customer',
        addresses: [],
        wishlist: [],
        createdAt: stored.createdAt,
      };
      setUsers((prev) => {
        const found = prev.find((u) => u.email.toLowerCase() === clean);
        return found ? prev.map((u) => (u.email.toLowerCase() === clean ? loadedUser : u)) : [...prev, loadedUser];
      });
      setCurrentUser(loadedUser);
      return true;
    }

    const existing = users.find((u) => u.email.toLowerCase() === clean);
    if (existing) {
      setCurrentUser(existing);
      saveUser({ name: existing.fullName, email: existing.email, phone: existing.phone });
      return true;
    }

    // Auto-create customer profile
    const saved = saveUser({ email: clean, name: clean.split('@')[0] });
    const newUser: User = {
      id: saved.id,
      fullName: saved.name,
      name: saved.name,
      email: clean,
      phone: saved.phone,
      myReferralCode: saved.myReferralCode,
      referralCodeUsed: saved.referralCodeUsed,
      role: 'customer',
      addresses: [],
      wishlist: [],
      createdAt: saved.createdAt,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const register = (data: { fullName: string; email: string; phone: string; password?: string }) => {
    const clean = data.email.trim().toLowerCase();
    const saved = saveUser({
      name: data.fullName.trim(),
      email: clean,
      phone: data.phone.trim(),
      password: data.password,
    });
    const newUser: User = {
      id: saved.id,
      fullName: saved.name,
      name: saved.name,
      email: clean,
      phone: saved.phone,
      password: saved.password,
      myReferralCode: saved.myReferralCode,
      referralCodeUsed: saved.referralCodeUsed,
      role: 'customer',
      addresses: [],
      wishlist: [],
      createdAt: saved.createdAt,
    };
    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.email.toLowerCase() === clean);
      if (idx >= 0) {
        return prev.map((u, i) => (i === idx ? newUser : u));
      }
      return [...prev, newUser];
    });
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUserAddress = (address: Address) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      addresses: [...currentUser.addresses, address],
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const deleteUserAddress = (index: number) => {
    if (!currentUser) return;
    const updatedAddresses = currentUser.addresses.filter((_, i) => i !== index);
    const updated = { ...currentUser, addresses: updatedAddresses };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  // --- Admin Login ---
  const adminLogin = (pass: string) => {
    const clean = pass.trim();
    if (clean === 'admin' || clean === 'admin123' || clean === 'zezo2026' || clean === 'admin@zezo.ca') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('zezo_admin_logged');
  };

  const resetToDemoData = () => {
    localStorage.removeItem('zezo_products');
    localStorage.removeItem('zezo_shipping_zones');
    localStorage.removeItem('zezo_orders');
    localStorage.removeItem('zezo_cart');
    localStorage.removeItem('zezo_users');
    localStorage.removeItem('zezo_current_user');
    setProducts(INITIAL_PRODUCTS);
    setShippingZones(DEFAULT_SHIPPING_ZONES);
    setFreeShippingThreshold(FREE_SHIPPING_THRESHOLD);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,

        shippingZones,
        freeShippingThreshold,
        setFreeShippingThreshold,
        addShippingZone,
        updateShippingZone,
        deleteShippingZone,
        calculateShippingCost,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,

        wishlist,
        toggleWishlist,
        isInWishlist,

        orders,
        placeOrder,
        updateOrderStatus,
        markOrderAsShipped,
        markOrderAsReturned,
        lastPlacedOrder,

        currentUser,
        users,
        login,
        register,
        logout,
        addUserAddress,
        deleteUserAddress,

        isAdminLoggedIn,
        adminLogin,
        adminLogout,

        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        searchQuery,
        setSearchQuery,

        resetToDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
