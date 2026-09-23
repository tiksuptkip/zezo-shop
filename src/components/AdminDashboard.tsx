import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ShippingZone, Order, OrderStatus, Category } from '../types';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Package, 
  Truck, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles, 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Search,
  Mail,
  Share2,
  Send,
  ExternalLink,
  UserCheck,
  Eye,
  Gift
} from 'lucide-react';
import { getAllUsers } from '../utils/users';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    shippingZones,
    addShippingZone,
    updateShippingZone,
    deleteShippingZone,
    freeShippingThreshold,
    setFreeShippingThreshold,
    orders,
    updateOrderStatus,
    markOrderAsShipped,
    markOrderAsReturned,
    users: contextUsers,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    setCurrentView,
    resetToDemoData,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'shipping' | 'orders' | 'users' | 'referrals' | 'lowstock'
  >('overview');

  // Admin login states
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [loginError, setLoginError] = useState<string>('');

  // Shipping Modal states
  const [shippingModalOrder, setShippingModalOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('');
  const [shippingCompanyInput, setShippingCompanyInput] = useState<string>('Canada Post');
  const [isShippingSubmitting, setIsShippingSubmitting] = useState<boolean>(false);
  const [shippingSuccessAlert, setShippingSuccessAlert] = useState<{
    orderId: string;
    email: string;
    tracking: string;
    company: string;
  } | null>(null);

  // User details modal state
  const [selectedUserForOrders, setSelectedUserForOrders] = useState<any | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [referralSearchQuery, setReferralSearchQuery] = useState<string>('');

  // Product Modals
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product form fields
  const [pTitle, setPTitle] = useState<string>('');
  const [pDesc, setPDesc] = useState<string>('');
  const [pMaterial, setPMaterial] = useState<string>('');
  const [pCategory, setPCategory] = useState<Category>('MEN');
  const [pSubCategory, setPSubCategory] = useState<string>('Jackets');
  const [pOriginalPrice, setPOriginalPrice] = useState<number>(120);
  const [pDiscountPrice, setPDiscountPrice] = useState<string>('79.99');
  const [pStock, setPStock] = useState<number>(10);
  const [pImages, setPImages] = useState<string>(
    'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1000&q=80'
  );
  const [pColors, setPColors] = useState<string>('Black (#1A1A1A), Navy (#1C2541)');
  const [pSizes, setPSizes] = useState<string>('S, M, L, XL');

  // Shipping Zone Modal
  const [showShippingModal, setShowShippingModal] = useState<boolean>(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [zoneName, setZoneName] = useState<string>('');
  const [zoneCode, setZoneCode] = useState<string>('');
  const [zoneCost, setZoneCost] = useState<number>(20);
  const [zoneDays, setZoneDays] = useState<string>('3-5 business days');

  // Order Return feedback
  const [returnSuccessAlert, setReturnSuccessAlert] = useState<{
    orderId: string;
    cost: number;
    province: string;
  } | null>(null);

  // Threshold edit state
  const [thresholdInput, setThresholdInput] = useState<number>(freeShippingThreshold);

  // Search in products
  const [productSearch, setProductSearch] = useState<string>('');

  // Stats calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const lowStockItems = products.filter((p) => p.stock <= 5);
  const freeShippingOrdersCount = orders.filter((o) => o.isFreeShipping).length;

  // Merge users from storage, store context, and guest orders
  const storedUsersList = getAllUsers();
  const allKnownUsersMap = new Map<string, any>();

  // Add stored users (from localStorage zshop_users)
  storedUsersList.forEach((u) => {
    const key = (u.email || u.id).toLowerCase().trim();
    allKnownUsersMap.set(key, {
      id: u.id,
      name: u.name || (u as any).fullName || 'Shopper',
      email: u.email || '',
      phone: u.phone || '',
      myReferralCode: u.myReferralCode || '',
      referralCodeUsed: u.referralCodeUsed || '',
      createdAt: u.createdAt || '',
      role: (u as any).role || 'customer',
    });
  });

  // Add context users
  contextUsers.forEach((u) => {
    const key = (u.email || u.id).toLowerCase().trim();
    if (!allKnownUsersMap.has(key)) {
      allKnownUsersMap.set(key, {
        id: u.id,
        name: u.fullName,
        email: u.email,
        phone: u.phone,
        myReferralCode: (u as any).myReferralCode || '',
        referralCodeUsed: (u as any).referralCodeUsed || '',
        createdAt: new Date().toISOString(),
        role: u.role,
      });
    }
  });

  // Also include any guest customers from orders if not already in list
  orders.forEach((o) => {
    const email = (o.customerEmail || o.email || '').toLowerCase().trim();
    if (email && !allKnownUsersMap.has(email)) {
      allKnownUsersMap.set(email, {
        id: `guest-${o.id}`,
        name: o.customerName || 'Guest Customer',
        email,
        phone: o.customerPhone || o.phone || '',
        myReferralCode: `ZEZO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        referralCodeUsed: o.referredBy || '',
        createdAt: o.createdAt || new Date().toISOString(),
        role: 'guest',
      });
    }
  });

  const combinedUsers = Array.from(allKnownUsersMap.values()).map((u) => {
    const uEmail = u.email.toLowerCase().trim();
    const uPhone = u.phone.trim();
    const userOrders = orders.filter((o) => {
      const oEmail = (o.customerEmail || o.email || '').toLowerCase().trim();
      const oPhone = (o.customerPhone || o.phone || '').trim();
      return (uEmail && oEmail === uEmail) || (uPhone && oPhone === uPhone);
    });
    const ordersCount = userOrders.length;
    const totalSpent = userOrders.reduce(
      (sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0),
      0
    );
    return {
      ...u,
      orders: userOrders,
      ordersCount,
      totalSpent,
    };
  });

  const filteredUsers = combinedUsers.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.myReferralCode && u.myReferralCode.toLowerCase().includes(q)) ||
      (u.referralCodeUsed && u.referralCodeUsed.toLowerCase().includes(q))
    );
  });

  // Referrals Program analytics
  const referredOrders = orders.filter((o) => Boolean(o.referredBy));
  const totalReferredOrders = referredOrders.length;
  const totalDiscountsGiven = referredOrders.reduce((sum, o) => sum + (o.discount || 10), 0);
  const totalReferredSales = referredOrders.reduce(
    (sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0),
    0
  );

  const referrersMap = new Map<
    string,
    {
      code: string;
      userName: string;
      userEmail: string;
      ordersCount: number;
      totalSales: number;
      totalReward: number;
    }
  >();

  // Populate map with known user codes
  combinedUsers.forEach((u) => {
    if (u.myReferralCode) {
      const code = u.myReferralCode.toUpperCase();
      if (!referrersMap.has(code)) {
        referrersMap.set(code, {
          code,
          userName: u.name,
          userEmail: u.email,
          ordersCount: 0,
          totalSales: 0,
          totalReward: 0,
        });
      }
    }
  });

  // Count usage in orders
  referredOrders.forEach((o) => {
    const code = (o.referredBy || '').toUpperCase();
    const existing = referrersMap.get(code) || {
      code,
      userName: 'Special Partner',
      userEmail: '-',
      ordersCount: 0,
      totalSales: 0,
      totalReward: 0,
    };
    existing.ordersCount += 1;
    existing.totalSales += o.status !== 'Cancelled' ? o.total : 0;
    existing.totalReward += 10; // $10 CAD bonus
    referrersMap.set(code, existing);
  });

  const allReferrersList = Array.from(referrersMap.values())
    .filter((r) => {
      if (!referralSearchQuery.trim()) return true;
      const q = referralSearchQuery.toLowerCase();
      return (
        r.code.toLowerCase().includes(q) ||
        r.userName.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.ordersCount - a.ordersCount || b.totalSales - a.totalSales);

  const handleConfirmShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingModalOrder) return;
    if (!trackingNumberInput.trim()) {
      alert('Please enter a valid tracking number');
      return;
    }

    setIsShippingSubmitting(true);
    const orderId = shippingModalOrder.id;
    const recipientEmail = shippingModalOrder.customerEmail || shippingModalOrder.email || '';
    const tracking = trackingNumberInput.trim();
    const carrier = shippingCompanyInput;

    await markOrderAsShipped(orderId, tracking, carrier);

    setIsShippingSubmitting(false);
    setShippingModalOrder(null);
    setShippingSuccessAlert({
      orderId,
      email: recipientEmail,
      tracking,
      company: carrier,
    });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(adminPassword)) {
      setLoginError('');
    } else {
      setLoginError('Invalid password. Use "admin123"');
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPTitle('');
    setPDesc('');
    setPMaterial('');
    setPCategory('MEN');
    setPSubCategory('Shirts');
    setPOriginalPrice(120);
    setPDiscountPrice('79.99');
    setPStock(10);
    setPImages('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80');
    setPColors('Classic White (#FFFFFF), Ice Blue (#B0C4DE)');
    setPSizes('S, M, L, XL');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPTitle(prod.title || '');
    setPDesc(prod.description || '');
    setPMaterial(prod.material || '');
    setPCategory(prod.category || 'MEN');
    setPSubCategory(prod.subCategory || '');
    setPOriginalPrice(prod.originalPrice ?? 0);
    setPDiscountPrice(prod.discountPrice ? String(prod.discountPrice) : '');
    setPStock(prod.stock ?? 0);
    setPImages(prod.images ? prod.images.join('\n') : '');
    setPColors(prod.colors ? prod.colors.map((c) => `${c.name} (${c.hex})`).join(', ') : '');
    setPSizes(prod.sizes ? prod.sizes.join(', ') : '');
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedImages = pImages
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    // Parse colors
    const parsedColors = pColors
      .split(',')
      .map((cStr) => {
        const match = cStr.match(/(.+)\((#[a-fA-F0-9]{3,6})\)/);
        if (match) {
          return { name: match[1].trim(), hex: match[2].trim() };
        }
        return { name: cStr.trim(), hex: '#111111' };
      })
      .filter((c) => c.name);

    // Parse sizes
    const parsedSizes = pSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload = {
      title: pTitle.trim(),
      description: pDesc.trim(),
      material: pMaterial.trim() || 'Premium Cotton Blend',
      category: pCategory,
      subCategory: pSubCategory.trim() || 'General',
      originalPrice: Number(pOriginalPrice),
      discountPrice: pDiscountPrice ? Number(pDiscountPrice) : undefined,
      stock: Number(pStock),
      images: parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1000&q=80'],
      colors: parsedColors.length > 0 ? parsedColors : [{ name: 'Standard', hex: '#000000' }],
      sizes: parsedSizes.length > 0 ? parsedSizes : ['S', 'M', 'L', 'XL'],
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setShowProductModal(false);
  };

  // Shipping modal handlers
  const handleOpenAddShipping = () => {
    setEditingZone(null);
    setZoneName('');
    setZoneCode('');
    setZoneCost(20);
    setZoneDays('3-5 business days');
    setShowShippingModal(true);
  };

  const handleOpenEditShipping = (zone: ShippingZone) => {
    setEditingZone(zone);
    setZoneName(zone.provinceName);
    setZoneCode(zone.provinceCode);
    setZoneCost(zone.shippingCost);
    setZoneDays(zone.estimatedDays);
    setShowShippingModal(true);
  };

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName || !zoneCost) return;

    if (editingZone) {
      updateShippingZone(editingZone.id, {
        provinceName: zoneName.trim(),
        provinceCode: zoneCode.trim().toUpperCase(),
        shippingCost: Number(zoneCost),
        estimatedDays: zoneDays.trim(),
      });
    } else {
      addShippingZone({
        provinceName: zoneName.trim(),
        provinceCode: zoneCode.trim().toUpperCase() || zoneName.slice(0, 2).toUpperCase(),
        shippingCost: Number(zoneCost),
        estimatedDays: zoneDays.trim() || '3-5 business days',
        isActive: true,
      });
    }
    setShowShippingModal(false);
  };

  const handleMarkReturned = (orderId: string) => {
    const res = markOrderAsReturned(orderId, 'Order marked returned by administrator.');
    if (res.success) {
      setReturnSuccessAlert({
        orderId,
        cost: res.calculatedReturnCost,
        province: res.province,
      });
      setTimeout(() => setReturnSuccessAlert(null), 6000);
    }
  };

  // IF NOT LOGGED IN: Admin Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-md text-center space-y-6">
          <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-neutral-950 tracking-tight">
              Zezo Admin Portal
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Secure store administration for products, Canadian shipping zones, orders, and returns.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg font-bold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Admin Email
              </label>
              <input
                id="admin-email-input"
                type="email"
                disabled
                readOnly
                value="admin@zezo.ca"
                className="w-full text-sm bg-neutral-100 border border-neutral-300 rounded-lg p-2.5 text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Admin Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                value={adminPassword ?? ''}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:bg-white focus:outline-none"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Pre-filled demo password: <strong>admin123</strong>
              </span>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full py-3 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-md"
            >
              Sign In to Admin Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-neutral-100">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-bold text-neutral-500 hover:text-neutral-950"
            >
              ← Return to Zezo Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter products by search
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Return Success Alert Banner */}
      {returnSuccessAlert && (
        <div className="bg-red-50 border border-red-300 text-red-950 p-4 rounded-xl shadow-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs">
            <RotateCcw className="w-4 h-4 text-red-600" />
            <span>
              <strong>Order #{returnSuccessAlert.orderId}</strong> marked as Returned! 
              Calculated return shipping cost: <strong>${returnSuccessAlert.cost.toFixed(2)} CAD</strong> for {returnSuccessAlert.province} (customer pays per Return Policy).
            </span>
          </div>
          <button
            onClick={() => setReturnSuccessAlert(null)}
            className="text-red-700 hover:text-red-950 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-neutral-400">Zezo Shop Canada</span>
          </div>
          <h1 className="text-2xl font-black text-neutral-950 tracking-tight mt-1">
            Store Management Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToDemoData}
            className="px-3.5 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            title="Reset to default seed products, shipping zones and orders"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
            Reset Demo Data
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            View Live Store
          </button>

          <button
            onClick={adminLogout}
            className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Total CAD Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-neutral-950">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-400">Across all COD orders</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-neutral-950">
            {orders.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            {freeShippingOrdersCount} with FREE Shipping
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">
            {lowStockItems.length}
          </div>
          <div className="text-[11px] text-neutral-400">Stock ≤ 5 units</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-1">
          <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Shipping Zones</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-neutral-950">
            {shippingZones.length}
          </div>
          <div className="text-[11px] text-neutral-400">Canadian Provinces/Territories</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto gap-2">
        <button
          id="admin-tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-neutral-950 text-neutral-950 font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          id="admin-tab-products"
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-neutral-950 text-neutral-950 font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        {/* NEW FEATURE: SHIPPING MANAGEMENT PAGE */}
        <button
          id="admin-tab-shipping"
          onClick={() => setActiveTab('shipping')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'shipping'
              ? 'border-neutral-950 text-neutral-950 font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Shipping Zones ({shippingZones.length})</span>
        </button>

        <button
          id="admin-tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-neutral-950 text-neutral-950 font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          id="admin-tab-lowstock"
          onClick={() => setActiveTab('lowstock')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'lowstock'
              ? 'border-neutral-950 text-neutral-950 font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Low Stock Alerts ({lowStockItems.length})</span>
        </button>

        <button
          id="admin-tab-users"
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-neutral-950 text-neutral-950 font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users / Subscribers</span>
        </button>

        <button
          id="admin-tab-referrals"
          onClick={() => setActiveTab('referrals')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'referrals'
              ? 'border-neutral-950 text-neutral-950 font-black'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Gift className="w-4 h-4 text-rose-600" />
          <span>Referral Program</span>
        </button>
      </div>

      {/* ================= TAB: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders Overview */}
            <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-sm font-extrabold text-neutral-950 uppercase tracking-wide">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-neutral-700 hover:text-neutral-950 underline"
                >
                  View All Orders
                </button>
              </div>

              <div className="divide-y divide-neutral-100">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-mono font-bold text-neutral-950">{order.id}</div>
                      <div className="text-neutral-500">
                        {order.customerName} • {order.shippingAddress.province}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                        {order.status}
                      </span>
                      <div className="font-extrabold text-neutral-950">
                        ${order.total.toFixed(2)} CAD
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-neutral-950 uppercase tracking-wide border-b border-neutral-100 pb-3">
                Quick Shortcuts
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={handleOpenAddProduct}
                  className="w-full py-2.5 px-4 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center justify-between"
                >
                  <span>+ Add New Product</span>
                  <Package className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className="w-full py-2.5 px-4 bg-neutral-100 text-neutral-900 rounded-xl text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center justify-between"
                >
                  <span>Configure Canadian Shipping</span>
                  <Truck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('lowstock')}
                  className="w-full py-2.5 px-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-between"
                >
                  <span>Replenish Low Stock ({lowStockItems.length})</span>
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: PRODUCTS ================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                id="admin-product-search-input"
                type="text"
                value={productSearch ?? ''}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search catalog by title or category..."
                className="w-full text-xs bg-white border border-neutral-300 rounded-xl pl-9 pr-4 py-2 focus:outline-none"
              />
            </div>

            <button
              id="admin-add-product-btn"
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-700 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Regular Price</th>
                    <th className="py-3 px-4">Discount Price</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {filteredProducts.map((p) => {
                    const isLow = p.stock > 0 && p.stock <= 5;
                    const isOut = p.stock <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-10 h-12 object-cover rounded-md border border-neutral-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-neutral-950 line-clamp-1">
                                {p.title}
                              </div>
                              <div className="text-neutral-400 text-[11px] line-clamp-1">
                                {p.material}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-neutral-800">
                            {p.category}
                          </span>{' '}
                          <span className="text-neutral-400 text-[11px]">
                            ({p.subCategory})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-600 font-semibold">
                          ${p.originalPrice.toFixed(2)} CAD
                        </td>
                        <td className="py-3 px-4 font-black text-red-600">
                          {p.discountPrice ? `$${p.discountPrice.toFixed(2)} CAD` : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <input
                              id={`product-stock-${p.id}`}
                              type="number"
                              min="0"
                              value={p.stock ?? 0}
                              onChange={(e) => updateProductStock(p.id, Number(e.target.value))}
                              className="w-14 text-center p-1 border border-neutral-300 rounded font-bold"
                            />
                            {isOut ? (
                              <span className="text-[10px] bg-neutral-200 text-neutral-700 font-bold px-1.5 py-0.5 rounded">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                                Only {p.stock} left!
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded">
                                In Stock
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: SHIPPING ZONES (NEW FEATURE) ================= */}
      {activeTab === 'shipping' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-neutral-950 flex items-center gap-2">
                <Truck className="w-5 h-5 text-neutral-800" />
                Canada Shipping Management
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Configure live provincial shipping rates and the nationwide Free Shipping threshold.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="admin-add-shipping-zone-btn"
                onClick={handleOpenAddShipping}
                className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Shipping Zone
              </button>
            </div>
          </div>

          {/* FREE SHIPPING RULE CONFIG CARD */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Free Shipping Threshold (CAD)
              </div>
              <p className="text-xs text-emerald-800">
                Any Canadian customer whose subtotal is ≥ this threshold automatically receives $0 FREE Shipping.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-emerald-950">$</span>
              <input
                id="admin-threshold-input"
                type="number"
                value={thresholdInput ?? 0}
                onChange={(e) => setThresholdInput(Number(e.target.value))}
                className="w-24 text-sm font-bold bg-white border border-emerald-300 rounded-lg p-2 text-neutral-900"
              />
              <button
                onClick={() => setFreeShippingThreshold(thresholdInput)}
                className="px-3 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
              >
                Update
              </button>
            </div>
          </div>

          {/* Shipping Zones Table */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Configured Canadian Provinces / Territories
              </span>
              <span className="text-xs text-neutral-500">
                Example rates: Ontario = $15 CAD, Quebec = $20 CAD, BC = $25 CAD, Alberta = $20 CAD, Far areas = $35 CAD
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/50 text-neutral-700 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Province / Region</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Shipping Cost (CAD)</th>
                    <th className="py-3 px-4">Transit Estimate</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {shippingZones.map((zone) => (
                    <tr key={zone.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-neutral-950">
                        {zone.provinceName}
                      </td>
                      <td className="py-3 px-4 text-neutral-500 font-mono">
                        {zone.provinceCode}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-black text-neutral-950">
                          ${zone.shippingCost.toFixed(2)} CAD
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {zone.estimatedDays}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditShipping(zone)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg"
                            title="Edit Rate"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteShippingZone(zone.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Zone"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: ORDERS ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-neutral-950">
              Customer Order Management ({orders.length} total)
            </h2>
          </div>

          {/* SHIPPING SUCCESS ALERT BANNER */}
          {shippingSuccessAlert && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">Shipping email sent to customer!</span> Order <strong>{shippingSuccessAlert.orderId}</strong> marked as shipped via <strong>{shippingSuccessAlert.company}</strong> (Tracking #{shippingSuccessAlert.tracking}) to <strong>{shippingSuccessAlert.email}</strong>.
                </div>
              </div>
              <button
                onClick={() => setShippingSuccessAlert(null)}
                className="text-emerald-700 hover:text-emerald-950 font-bold p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-4">
            {orders.map((order) => {
              const statusColors: Record<string, string> = {
                Processing: 'bg-blue-50 text-blue-800 border-blue-200',
                Shipped: 'bg-amber-50 text-amber-800 border-amber-200',
                shipped: 'bg-amber-50 text-amber-800 border-amber-200',
                received: 'bg-blue-50 text-blue-800 border-blue-200',
                Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                Returned: 'bg-red-50 text-red-800 border-red-200',
                Cancelled: 'bg-neutral-100 text-neutral-700 border-neutral-300',
              };

              return (
                <div
                  key={order.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-100 gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-base text-neutral-950">
                          {order.id}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${statusColors[order.status]}`}>
                          ● {order.status}
                        </span>
                        {order.isFreeShipping && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            FREE SHIPPING APPLIED
                          </span>
                        )}
                        {order.referredBy && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                            <Gift className="w-3 h-3 text-rose-600" />
                            Referred by: {order.referredBy}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Customer: <strong>{order.customerName}</strong> ({order.customerEmail}) • Phone: {order.customerPhone}
                      </div>
                      <div className="text-xs text-neutral-500">
                        Destination: {order.shippingAddress.street}, {order.shippingAddress.city}, <strong>{order.shippingAddress.province}</strong> ({order.shippingAddress.postalCode})
                      </div>

                      {/* Carrier & Tracking Info Badge */}
                      {order.trackingNumber && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-50/80 text-amber-900 border border-amber-200 rounded-lg text-xs font-medium">
                          <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>Carrier: <strong>{order.shippingCompany || 'Canada Post'}</strong></span>
                          <span className="text-neutral-300">•</span>
                          <span>Tracking: <strong className="font-mono">{order.trackingNumber}</strong></span>
                          {order.shippedAt && (
                            <>
                              <span className="text-neutral-300">•</span>
                              <span className="text-neutral-500">{new Date(order.shippedAt).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Status changer */}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-bold bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Returned">Returned</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {/* MARK AS SHIPPED BUTTON */}
                      <button
                        onClick={() => {
                          setShippingModalOrder(order);
                          setTrackingNumberInput(
                            order.trackingNumber ||
                              `CP-CA-${Math.floor(10000000 + Math.random() * 90000000)}`
                          );
                          setShippingCompanyInput(order.shippingCompany || 'Canada Post');
                        }}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                        title="Add tracking and send shipping confirmation email"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        {order.status === 'Shipped' || order.status === 'shipped'
                          ? 'Update Shipping'
                          : 'Mark as Shipped'}
                      </button>

                      {/* MARK AS RETURNED BUTTON (CRITICAL REQUIREMENT) */}
                      {order.status !== 'Returned' && (
                        <button
                          onClick={() => handleMarkReturned(order.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                          title="Calculate return shipping fee based on customer province"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Mark as Returned
                        </button>
                      )}
                    </div>
                  </div>

                  {/* RETURNED RECEIPT NOTIFICATION */}
                  {order.status === 'Returned' && order.returnedDetails && (
                    <div className="p-3.5 bg-red-50/80 border border-red-200 rounded-xl text-xs space-y-1 text-red-950">
                      <div className="font-bold flex items-center gap-1.5">
                        <RotateCcw className="w-4 h-4 text-red-600" />
                        Returned Order Financial Assessment
                      </div>
                      <p>
                        Calculated Return Courier Fee: <strong className="text-red-700">${order.returnedDetails.returnShippingCost.toFixed(2)} CAD</strong> for {order.returnedDetails.calculatedProvince}.
                      </p>
                      <p className="text-[11px] text-red-800">
                        {order.returnedDetails.note}
                      </p>
                    </div>
                  )}

                  {/* Items summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2 bg-neutral-50 rounded-lg border border-neutral-100 text-xs">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-9 h-11 object-cover rounded"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-neutral-900 truncate">{item.title}</div>
                          <div className="text-[10px] text-neutral-500">
                            Qty: {item.quantity} • {item.colorName} • {item.size}
                          </div>
                          <div className="font-bold text-neutral-900 text-[11px]">
                            ${(item.price * item.quantity).toFixed(2)} CAD
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Financials */}
                  <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between text-xs text-neutral-600 gap-2">
                    <div>
                      Payment Method: <strong>{order.paymentMethod} (COD)</strong>
                    </div>
                    <div className="flex items-center gap-4 text-neutral-800">
                      <span>Subtotal: <strong>${order.subtotal.toFixed(2)} CAD</strong></span>
                      <span>Shipping Paid: <strong>${order.shippingCost.toFixed(2)} CAD</strong> {order.isFreeShipping && '(Free)'}</span>
                      <span className="text-sm font-black text-neutral-950">
                        Total Due: ${order.total.toFixed(2)} CAD
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB: LOW STOCK ALERTS ================= */}
      {activeTab === 'lowstock' && (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-base font-extrabold text-red-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Low Stock & Out of Stock Urgent Inventory
            </h2>
            <p className="text-xs text-red-800 mt-1">
              Products with stock ≤ 5 units automatically trigger customer warnings on the storefront ("Only X left in stock!"). When stock reaches 0, the item shows as "Out of Stock".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((prod) => (
              <div
                key={prod.id}
                className="bg-white border-2 border-red-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-14 h-18 object-cover rounded-lg border border-neutral-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-neutral-950 line-clamp-2">
                      {prod.title}
                    </h4>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {prod.category} • {prod.subCategory}
                    </div>
                    <div className="mt-1 font-black text-red-600 text-xs">
                      {prod.stock === 0 ? 'OUT OF STOCK' : `Only ${prod.stock} unit(s) left!`}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700">Quick Restock:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateProductStock(prod.id, prod.stock + 5)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded font-bold text-xs"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => updateProductStock(prod.id, prod.stock + 10)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded font-bold text-xs"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => updateProductStock(prod.id, prod.stock + 20)}
                      className="px-2.5 py-1 bg-neutral-950 text-white hover:bg-neutral-800 rounded font-bold text-xs"
                    >
                      +20
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: USERS / SUBSCRIBERS ================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-neutral-950 flex items-center gap-2">
                <Users className="w-5 h-5 text-neutral-900" />
                Customer & Subscriber Directory
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                All registered accounts and guest shoppers. Total: <strong>{combinedUsers.length} shoppers</strong> ({filteredUsers.length} shown).
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone, or code..."
                className="w-full pl-9 pr-8 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
              {userSearchQuery && (
                <button
                  onClick={() => setUserSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider bg-neutral-50/80">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">My Referral Code</th>
                    <th className="py-3 px-4">Referred By</th>
                    <th className="py-3 px-4">Orders</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-400">
                        No customers found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-neutral-950">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {(u.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div>{u.name}</div>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                  u.role === 'admin'
                                    ? 'bg-amber-100 text-amber-800'
                                    : u.role === 'guest'
                                    ? 'bg-neutral-100 text-neutral-600'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {u.role || 'customer'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-700 font-mono text-[11px]">
                          {u.email || '—'}
                        </td>
                        <td className="py-3 px-4 text-neutral-700">
                          {u.phone || '—'}
                        </td>
                        <td className="py-3 px-4">
                          {u.myReferralCode ? (
                            <span className="font-mono font-bold text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                              {u.myReferralCode}
                            </span>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {u.referralCodeUsed ? (
                            <span className="font-mono text-xs bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-semibold">
                              {u.referralCodeUsed}
                            </span>
                          ) : (
                            <span className="text-neutral-400">None</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800">
                            {u.ordersCount} {u.ordersCount === 1 ? 'order' : 'orders'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-neutral-950">
                          ${u.totalSpent.toFixed(2)} CAD
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedUserForOrders(u)}
                            className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Orders ({u.ordersCount})
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: REFERRALS ================= */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          {/* Header & Description */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-neutral-950 flex items-center gap-2">
                <Gift className="w-5 h-5 text-rose-600" />
                Referral & Affiliate Program Analytics
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every customer has a personal referral code. When shared, the invitee gets $10 CAD off, and the referrer accumulates credits.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={referralSearchQuery}
                onChange={(e) => setReferralSearchQuery(e.target.value)}
                placeholder="Search referral code or user..."
                className="w-full pl-9 pr-8 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
              {referralSearchQuery && (
                <button
                  onClick={() => setReferralSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Referral KPI metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-1">
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Total Referrers</span>
                <Share2 className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-neutral-950">
                {referrersMap.size}
              </div>
              <div className="text-[11px] text-neutral-400">Registered partner codes</div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-1">
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Referred Orders</span>
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-neutral-950">
                {totalReferredOrders}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                Placed using a referral link
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-1">
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Discounts Given</span>
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-600">
                ${totalDiscountsGiven.toFixed(2)} CAD
              </div>
              <div className="text-[11px] text-neutral-400">Customer savings</div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-1">
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Referred Sales (CAD)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">
                ${totalReferredSales.toFixed(2)} CAD
              </div>
              <div className="text-[11px] text-neutral-400">Gross revenue generated</div>
            </div>
          </div>

          {/* Top Referrers Table */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600" />
                Referrers Leaderboard & Rewards
              </h3>
              <span className="text-[11px] text-neutral-500 font-semibold">
                Sorted by most orders referred
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider bg-neutral-50/50">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Referral Code</th>
                    <th className="py-3 px-4">Referrer Customer</th>
                    <th className="py-3 px-4">Referred Orders</th>
                    <th className="py-3 px-4">Sales Generated</th>
                    <th className="py-3 px-4">Rewards / Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {allReferrersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-400">
                        No referral activity yet. Codes are automatically assigned to all registered and checkout customers.
                      </td>
                    </tr>
                  ) : (
                    allReferrersList.map((ref, idx) => (
                      <tr key={ref.code} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-neutral-400">
                          #{idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-black text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                            {ref.code}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-neutral-950">{ref.userName}</div>
                          <div className="text-[11px] text-neutral-500">{ref.userEmail}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                              ref.ordersCount > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {ref.ordersCount} {ref.ordersCount === 1 ? 'order' : 'orders'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-neutral-950">
                          ${ref.totalSales.toFixed(2)} CAD
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                            ${ref.totalReward.toFixed(2)} CAD Credits
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Referred Orders Activity Feed */}
          {referredOrders.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800">
                Recent Orders Using Referral Codes ({referredOrders.length})
              </h3>
              <div className="divide-y divide-neutral-100 text-xs">
                {referredOrders.map((ro) => (
                  <div key={ro.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-mono font-bold text-neutral-950">{ro.id}</div>
                      <div className="text-neutral-500">
                        Buyer: <strong>{ro.customerName}</strong> • Code used:{' '}
                        <span className="font-mono font-bold text-rose-700">{ro.referredBy}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-neutral-950">${ro.total.toFixed(2)} CAD</div>
                      <span className="text-[10px] font-bold text-emerald-700">
                        -${(ro.discount || 10).toFixed(2)} CAD Referral Discount
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-extrabold text-lg text-neutral-950">
                {editingProduct ? 'Edit Product' : 'Add New Canadian Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Product Title
                </label>
                <input
                  id="admin-product-title-input"
                  type="text"
                  required
                  value={pTitle ?? ''}
                  onChange={(e) => setPTitle(e.target.value)}
                  placeholder="e.g. Laurentian Heritage Wool Overcoat"
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Description
                </label>
                <textarea
                  id="admin-product-desc-input"
                  required
                  rows={3}
                  value={pDesc ?? ''}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Detailed garment story, features, and fit..."
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Category
                  </label>
                  <select
                    id="admin-product-category-select"
                    value={pCategory ?? 'MEN'}
                    onChange={(e) => setPCategory(e.target.value as Category)}
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 font-bold"
                  >
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                    <option value="KIDS">KIDS</option>
                    <option value="SALE">SALE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    SubCategory
                  </label>
                  <input
                    id="admin-product-subcategory-input"
                    type="text"
                    required
                    value={pSubCategory ?? ''}
                    onChange={(e) => setPSubCategory(e.target.value)}
                    placeholder="Shirts, Pants, Boots..."
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Material
                  </label>
                  <input
                    id="admin-product-material-input"
                    type="text"
                    required
                    value={pMaterial ?? ''}
                    onChange={(e) => setPMaterial(e.target.value)}
                    placeholder="100% Supima Cotton"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Regular Price (CAD)
                  </label>
                  <input
                    id="admin-product-origprice-input"
                    type="number"
                    step="0.01"
                    required
                    value={pOriginalPrice ?? 0}
                    onChange={(e) => setPOriginalPrice(Number(e.target.value))}
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-red-600 mb-1">
                    Discount Price (CAD) *Bold Red
                  </label>
                  <input
                    id="admin-product-discprice-input"
                    type="number"
                    step="0.01"
                    value={pDiscountPrice ?? ''}
                    onChange={(e) => setPDiscountPrice(e.target.value)}
                    placeholder="Leave empty if regular"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 font-bold text-red-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Inventory Stock Count
                  </label>
                  <input
                    id="admin-product-stock-input"
                    type="number"
                    min="0"
                    required
                    value={pStock ?? 0}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Image URLs (One per line)
                </label>
                <textarea
                  id="admin-product-images-input"
                  rows={2}
                  required
                  value={pImages ?? ''}
                  onChange={(e) => setPImages(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Color Variants (Format: Name (#HEX))
                  </label>
                  <input
                    id="admin-product-colors-input"
                    type="text"
                    value={pColors ?? ''}
                    onChange={(e) => setPColors(e.target.value)}
                    placeholder="Charcoal Camel (#8C7456), Midnight (#1C2541)"
                    className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Sizes Available (Comma separated)
                  </label>
                  <input
                    id="admin-product-sizes-input"
                    type="text"
                    value={pSizes ?? ''}
                    onChange={(e) => setPSizes(e.target.value)}
                    placeholder="S, M, L, XL or 28, 30, 32 or 38, 39, 40"
                    className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-xl font-bold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-neutral-950 text-white rounded-xl font-bold hover:bg-neutral-800"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SHIPPING ZONE ================= */}
      {showShippingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-extrabold text-base text-neutral-950">
                {editingZone ? 'Edit Canadian Shipping Zone' : 'Add Canadian Shipping Zone'}
              </h3>
              <button
                onClick={() => setShowShippingModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShipping} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Province / Territory Name
                </label>
                <input
                  id="admin-zone-name-input"
                  type="text"
                  required
                  value={zoneName ?? ''}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="e.g. Ontario or Yukon"
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Province Code
                  </label>
                  <input
                    id="admin-zone-code-input"
                    type="text"
                    required
                    value={zoneCode ?? ''}
                    onChange={(e) => setZoneCode(e.target.value)}
                    placeholder="ON"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">
                    Shipping Cost (CAD $)
                  </label>
                  <input
                    id="admin-zone-cost-input"
                    type="number"
                    step="0.01"
                    required
                    value={zoneCost ?? 0}
                    onChange={(e) => setZoneCost(Number(e.target.value))}
                    placeholder="15.00"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Transit Estimate
                </label>
                <input
                  id="admin-zone-days-input"
                  type="text"
                  required
                  value={zoneDays ?? ''}
                  onChange={(e) => setZoneDays(e.target.value)}
                  placeholder="2-3 business days"
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowShippingModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg font-bold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 text-white rounded-lg font-bold hover:bg-neutral-800"
                >
                  Save Shipping Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MARK ORDER AS SHIPPED ================= */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-neutral-900" />
                <h3 className="font-extrabold text-base text-neutral-950">
                  Mark Order as Shipped
                </h3>
              </div>
              <button
                onClick={() => setShippingModalOrder(null)}
                className="text-neutral-400 hover:text-neutral-700 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs space-y-1">
              <div>Order ID: <strong className="font-mono">{shippingModalOrder.id}</strong></div>
              <div>Customer: <strong>{shippingModalOrder.customerName}</strong> ({shippingModalOrder.customerEmail})</div>
              <div>Destination: {shippingModalOrder.shippingAddress.city}, <strong>{shippingModalOrder.shippingAddress.province}</strong> ({shippingModalOrder.shippingAddress.postalCode})</div>
            </div>

            <form onSubmit={handleConfirmShipping} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Shipping Courier / Company <span className="text-red-500">*</span>
                </label>
                <select
                  value={shippingCompanyInput}
                  onChange={(e) => setShippingCompanyInput(e.target.value)}
                  className="w-full text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 focus:bg-white focus:outline-none"
                >
                  <option value="Canada Post">Canada Post (Expedited Parcel)</option>
                  <option value="UPS Canada">UPS Canada (Standard / Express)</option>
                  <option value="FedEx Express">FedEx Express Canada</option>
                  <option value="DHL Express">DHL Express</option>
                  <option value="Purolator">Purolator Canada</option>
                  <option value="Canpar Express">Canpar Express</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">
                  Tracking Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="e.g. CP-CA-98765432"
                  className="w-full text-xs font-mono font-bold bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 uppercase focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Confirming this will mark the order as <strong>Shipped</strong> and dispatch an automatic Canadian tracking update email to <strong>{shippingModalOrder.customerEmail}</strong>.
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isShippingSubmitting}
                  onClick={() => setShippingModalOrder(null)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg font-bold text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isShippingSubmitting}
                  className="px-5 py-2 bg-neutral-950 text-white rounded-lg font-bold hover:bg-neutral-800 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isShippingSubmitting ? 'Sending Email...' : 'Ship & Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW USER ORDERS ================= */}
      {selectedUserForOrders && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl space-y-4 my-8 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs">
                  {selectedUserForOrders.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-neutral-950">
                    {selectedUserForOrders.name}'s Orders
                  </h3>
                  <div className="text-xs text-neutral-500">
                    {selectedUserForOrders.email} • {selectedUserForOrders.phone || 'No phone'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForOrders(null)}
                className="text-neutral-400 hover:text-neutral-700 text-lg"
              >
                ✕
              </button>
            </div>

            {/* User Meta Strip */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Referral Code</span>
                <span className="font-mono font-bold text-rose-700">
                  {selectedUserForOrders.myReferralCode || 'None'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Total Orders</span>
                <span className="font-bold text-neutral-900">
                  {selectedUserForOrders.ordersCount}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Total Spent</span>
                <span className="font-black text-emerald-700">
                  ${selectedUserForOrders.totalSpent.toFixed(2)} CAD
                </span>
              </div>
            </div>

            {/* Orders list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Order History ({selectedUserForOrders.orders.length})
              </h4>
              {selectedUserForOrders.orders.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                  This user hasn't placed any orders yet.
                </div>
              ) : (
                selectedUserForOrders.orders.map((o: Order) => (
                  <div
                    key={o.id}
                    className="p-4 bg-white border border-neutral-200 rounded-xl shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-950">{o.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800">
                          {o.status}
                        </span>
                        {o.isFreeShipping && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Free Shipping
                          </span>
                        )}
                      </div>
                      <div className="font-black text-sm text-neutral-950">
                        ${o.total.toFixed(2)} CAD
                      </div>
                    </div>

                    <div className="text-neutral-600 text-[11px]">
                      Date: {new Date(o.createdAt).toLocaleDateString()} • Items: {o.items.length} item(s)
                    </div>

                    {/* Carrier tracking details */}
                    {o.trackingNumber && (
                      <div className="p-2 bg-amber-50/70 border border-amber-200 rounded text-[11px] text-amber-900 flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Carrier: <strong>{o.shippingCompany || 'Canada Post'}</strong></span>
                        <span>•</span>
                        <span>Tracking: <strong className="font-mono">{o.trackingNumber}</strong></span>
                      </div>
                    )}

                    {/* Items preview */}
                    <div className="space-y-1 pt-1">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-neutral-600 text-[11px]">
                          <span>
                            {it.quantity}x {it.title} ({it.colorName}, {it.size})
                          </span>
                          <span className="font-semibold text-neutral-900">
                            ${(it.price * it.quantity).toFixed(2)} CAD
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setSelectedUserForOrders(null)}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
