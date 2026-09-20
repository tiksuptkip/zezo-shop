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
  Search
} from 'lucide-react';

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
    markOrderAsReturned,
    users,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    setCurrentView,
    resetToDemoData,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'shipping' | 'orders' | 'users' | 'lowstock'
  >('overview');

  // Admin login states
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [loginError, setLoginError] = useState<string>('');

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
    setPTitle(prod.title);
    setPDesc(prod.description);
    setPMaterial(prod.material);
    setPCategory(prod.category);
    setPSubCategory(prod.subCategory);
    setPOriginalPrice(prod.originalPrice);
    setPDiscountPrice(prod.discountPrice ? String(prod.discountPrice) : '');
    setPStock(prod.stock);
    setPImages(prod.images.join('\n'));
    setPColors(prod.colors.map((c) => `${c.name} (${c.hex})`).join(', '));
    setPSizes(prod.sizes.join(', '));
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
                type="email"
                disabled
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
                value={adminPassword}
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
          <span>Users ({users.length})</span>
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
                type="text"
                value={productSearch}
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
                              type="number"
                              min="0"
                              value={p.stock}
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
                type="number"
                value={thresholdInput}
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

          <div className="space-y-4">
            {orders.map((order) => {
              const statusColors: Record<OrderStatus, string> = {
                Processing: 'bg-blue-50 text-blue-800 border-blue-200',
                Shipped: 'bg-amber-50 text-amber-800 border-amber-200',
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
                      <div className="flex items-center gap-2">
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
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        Customer: <strong>{order.customerName}</strong> ({order.customerEmail}) • Phone: {order.customerPhone}
                      </div>
                      <div className="text-xs text-neutral-500">
                        Destination: {order.shippingAddress.street}, {order.shippingAddress.city}, <strong>{order.shippingAddress.province}</strong> ({order.shippingAddress.postalCode})
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
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

      {/* ================= TAB: USERS ================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Registered Canadian Shoppers ({users.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Canadian Phone</th>
                    <th className="py-3 px-4">Saved Addresses</th>
                    <th className="py-3 px-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-neutral-950">
                        {u.fullName}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{u.email}</td>
                      <td className="py-3 px-4 text-neutral-600">{u.phone}</td>
                      <td className="py-3 px-4 text-neutral-600">
                        {u.addresses.length} saved
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
                  type="text"
                  required
                  value={pTitle}
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
                  required
                  rows={3}
                  value={pDesc}
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
                    value={pCategory}
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
                    type="text"
                    required
                    value={pSubCategory}
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
                    type="text"
                    required
                    value={pMaterial}
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
                    type="number"
                    step="0.01"
                    required
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(Number(e.target.value))}
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-red-600 mb-1">
                    Discount Price (CAD) *Bold Red
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pDiscountPrice}
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
                    type="number"
                    min="0"
                    required
                    value={pStock}
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
                  rows={2}
                  required
                  value={pImages}
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
                    type="text"
                    value={pColors}
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
                    type="text"
                    value={pSizes}
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
                  type="text"
                  required
                  value={zoneName}
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
                    type="text"
                    required
                    value={zoneCode}
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
                    type="number"
                    step="0.01"
                    required
                    value={zoneCost}
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
                  type="text"
                  required
                  value={zoneDays}
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
    </div>
  );
};
