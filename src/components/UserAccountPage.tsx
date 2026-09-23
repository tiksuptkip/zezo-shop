import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Address, Order } from '../types';
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  ExternalLink, 
  ShoppingBag,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MANDATORY_RETURN_POLICY_TEXT } from '../data/returnPolicy';

export const UserAccountPage: React.FC = () => {
  const {
    currentUser,
    login,
    register,
    logout,
    orders,
    wishlist,
    products,
    addUserAddress,
    deleteUserAddress,
    addToCart,
    toggleWishlist,
    setSelectedProductId,
    setCurrentView,
    shippingZones,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState<string>('liam.campbell@zezo.ca');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [authMessage, setAuthMessage] = useState<string>('');

  // New Address form states
  const [showAddAddressModal, setShowAddAddressModal] = useState<boolean>(false);
  const [newStreet, setNewStreet] = useState<string>('');
  const [newApt, setNewApt] = useState<string>('');
  const [newCity, setNewCity] = useState<string>('');
  const [newProvince, setNewProvince] = useState<string>('Ontario');
  const [newPostalCode, setNewPostalCode] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');

  // Filter orders for current user (or show all if guest/demo)
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
          o.customerName.toLowerCase() === currentUser.fullName.toLowerCase()
      )
    : orders;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    login(loginEmail);
    setAuthMessage('Logged in successfully!');
    setLoginPassword('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regPhone) {
      setAuthMessage('Please fill all required registration fields.');
      return;
    }
    register({
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
    });
    setAuthMessage('Account created successfully!');
    setRegPassword('');
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostalCode || !newPhone) return;

    const newAddr: Address = {
      fullName: currentUser?.fullName || 'Liam Campbell',
      street: newStreet,
      apt: newApt || undefined,
      city: newCity,
      province: newProvince,
      postalCode: newPostalCode.toUpperCase(),
      phone: newPhone,
      isDefault: currentUser?.addresses.length === 0,
    };

    addUserAddress(newAddr);
    setShowAddAddressModal(false);
    setNewStreet('');
    setNewApt('');
    setNewCity('');
    setNewPostalCode('');
    setNewPhone('');
  };

  // IF NOT LOGGED IN: Display Login / Register Tabs
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-neutral-950 tracking-tight">
              Customer Account
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Sign in or create an account for Canada order tracking and addresses.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-neutral-200 mb-6">
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthMessage('');
              }}
              className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 ${
                authMode === 'login'
                  ? 'border-neutral-950 text-neutral-950'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setAuthMessage('');
              }}
              className={`flex-1 pb-3 text-xs font-bold transition-colors border-b-2 ${
                authMode === 'register'
                  ? 'border-neutral-950 text-neutral-950'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Register (Canada)
            </button>
          </div>

          {authMessage && (
            <div className="mb-4 p-3 bg-neutral-100 text-neutral-800 text-xs rounded-lg font-medium">
              {authMessage}
            </div>
          )}

          {authMode === 'login' ? (
            <form key="auth-login-form" onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Email Address
                </label>
                <input
                  id="login-email-input"
                  key="login-email-input"
                  type="email"
                  required
                  value={loginEmail ?? ''}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="liam.campbell@zezo.ca"
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Password (Optional for Demo)
                </label>
                <input
                  id="login-password-input"
                  key="login-password-input"
                  type="password"
                  value={loginPassword ?? ''}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                id="login-submit-btn"
                type="submit"
                className="w-full py-3 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-md"
              >
                Sign In to Account
              </button>

              <div className="pt-2">
                <button
                  id="quick-demo-login-btn"
                  type="button"
                  onClick={() => login('liam.campbell@zezo.ca')}
                  className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold transition-colors"
                >
                  ⚡ Quick Demo Login as Liam Campbell
                </button>
              </div>
            </form>
          ) : (
            <form key="auth-register-form" onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Full Name
                </label>
                <input
                  id="register-fullname-input"
                  key="register-fullname-input"
                  type="text"
                  required
                  value={regFullName ?? ''}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Email Address
                </label>
                <input
                  id="register-email-input"
                  key="register-email-input"
                  type="email"
                  required
                  value={regEmail ?? ''}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. sarah.j@outlook.ca"
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Canadian Phone Number
                </label>
                <input
                  id="register-phone-input"
                  key="register-phone-input"
                  type="tel"
                  required
                  value={regPhone ?? ''}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="e.g. +1 (604) 555-0199"
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  Password
                </label>
                <input
                  id="register-password-input"
                  key="register-password-input"
                  type="password"
                  required
                  value={regPassword ?? ''}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                className="w-full py-3 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-md"
              >
                Create Zezo Account
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // IF LOGGED IN: Show My Account Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center font-black text-xl">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              {currentUser.fullName}
            </h1>
            <div className="text-xs text-neutral-500 flex items-center gap-3 mt-0.5">
              <span>{currentUser.email}</span>
              <span>•</span>
              <span>{currentUser.phone}</span>
              <span>•</span>
              <span className="font-semibold text-rose-600 uppercase text-[10px]">
                Canada Member
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-red-600 border border-neutral-300 hover:border-red-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-neutral-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3.5 px-4 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-neutral-950 text-neutral-950'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3.5 px-4 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'border-neutral-950 text-neutral-950'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>My Addresses ({currentUser.addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3.5 px-4 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 shrink-0 flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'border-neutral-950 text-neutral-950'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlist.length})</span>
        </button>
      </div>

      {/* TAB 1: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl p-8">
              <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-neutral-900">No orders placed yet</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Explore our collections with Cash on Delivery across Canada!
              </p>
              <button
                onClick={() => setCurrentView('shop')}
                className="mt-4 px-5 py-2.5 bg-neutral-950 text-white text-xs font-bold rounded-xl"
              >
                Shop Now
              </button>
            </div>
          ) : (
            userOrders.map((order) => {
              const statusColors: Record<string, string> = {
                Processing: 'bg-blue-50 text-blue-800 border-blue-200',
                Shipped: 'bg-amber-50 text-amber-800 border-amber-200',
                Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                Returned: 'bg-red-50 text-red-800 border-red-200',
                Cancelled: 'bg-neutral-100 text-neutral-700 border-neutral-300',
              };

              return (
                <div
                  key={order.id}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs space-y-4 p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                    <div>
                      <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                        Order ID
                      </span>
                      <div className="font-mono font-extrabold text-sm text-neutral-950">
                        {order.id}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                          statusColors[order.status] || 'bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        ● {order.status}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-black text-neutral-950">
                          ${order.total.toFixed(2)} CAD
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          Cash on Delivery
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RETURN DETAILS IF RETURNED */}
                  {order.status === 'Returned' && order.returnedDetails && (
                    <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl text-xs space-y-1 text-red-950">
                      <div className="font-bold flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                        Order Marked as Returned
                      </div>
                      <p className="leading-relaxed">
                        Return shipping fee of <strong>${order.returnedDetails.returnShippingCost.toFixed(2)} CAD</strong> for {order.returnedDetails.calculatedProvince} applied as customer responsibility per policy.
                      </p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="divide-y divide-neutral-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-14 object-cover rounded-md border border-neutral-200"
                          />
                          <div>
                            <div className="font-bold text-neutral-900">{item.title}</div>
                            <div className="text-neutral-500 text-[11px]">
                              Qty: {item.quantity} • Color: {item.colorName} • Size: {item.size}
                            </div>
                          </div>
                        </div>
                        <div className="font-extrabold text-neutral-950 text-xs">
                          ${(item.price * item.quantity).toFixed(2)} CAD
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info Breakdown */}
                  <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-600 flex flex-col sm:flex-row justify-between gap-2">
                    <div>
                      <span className="font-bold text-neutral-900">Delivery Address:</span>{' '}
                      {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.province} ({order.shippingAddress.postalCode})
                    </div>
                    <div className="sm:text-right">
                      <span>Shipping Fee: </span>
                      {order.isFreeShipping ? (
                        <span className="text-emerald-600 font-bold">$0.00 CAD (FREE)</span>
                      ) : (
                        <span className="font-bold text-neutral-900">${order.shippingCost.toFixed(2)} CAD</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: MY ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-neutral-950">
              Saved Canadian Addresses
            </h2>
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-neutral-950">
                      {addr.fullName}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-neutral-100 text-neutral-700 font-bold px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-600 space-y-0.5">
                    <div>{addr.street} {addr.apt}</div>
                    <div>{addr.city}, {addr.province} {addr.postalCode}</div>
                    <div>Phone: {addr.phone}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 mt-4 flex justify-end">
                  <button
                    onClick={() => deleteUserAddress(idx)}
                    className="text-xs text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddAddressModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-bold text-base text-neutral-950">
                    Add New Canadian Address
                  </h3>
                  <button
                    onClick={() => setShowAddAddressModal(false)}
                    className="text-neutral-400 hover:text-neutral-700 text-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Street Address
                    </label>
                    <input
                      id="add-address-street-input"
                      type="text"
                      required
                      value={newStreet ?? ''}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="e.g. 1500 West Georgia St"
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">
                        Apartment / Suite
                      </label>
                      <input
                        id="add-address-apt-input"
                        type="text"
                        value={newApt ?? ''}
                        onChange={(e) => setNewApt(e.target.value)}
                        placeholder="Apt 4B"
                        className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">
                        City
                      </label>
                      <input
                        id="add-address-city-input"
                        type="text"
                        required
                        value={newCity ?? ''}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="Vancouver"
                        className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">
                        Canadian Province
                      </label>
                      <select
                        id="add-address-province-select"
                        value={newProvince ?? 'Ontario'}
                        onChange={(e) => setNewProvince(e.target.value)}
                        className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 font-semibold"
                      >
                        {shippingZones.map((z) => (
                          <option key={z.id} value={z.provinceName}>
                            {z.provinceName} ({z.provinceCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1">
                        Postal Code
                      </label>
                      <input
                        id="add-address-postal-input"
                        type="text"
                        required
                        value={newPostalCode ?? ''}
                        onChange={(e) => setNewPostalCode(e.target.value)}
                        placeholder="V6G 2Z6"
                        className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5 uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">
                      Phone Number (For Delivery SMS)
                    </label>
                    <input
                      id="add-address-phone-input"
                      type="tel"
                      required
                      value={newPhone ?? ''}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+1 (604) 555-0188"
                      className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg p-2.5"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(false)}
                      className="px-4 py-2 border border-neutral-300 rounded-lg font-bold text-neutral-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-neutral-950 text-white rounded-lg font-bold hover:bg-neutral-800"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl p-8">
              <Heart className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-neutral-900">Your wishlist is empty</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Save your favorite items to revisit anytime.
              </p>
              <button
                onClick={() => setCurrentView('shop')}
                className="mt-4 px-5 py-2.5 bg-neutral-950 text-white text-xs font-bold rounded-xl"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {wishlistProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] bg-neutral-100">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-rose-600 shadow-sm"
                      >
                        <Heart className="w-4 h-4 fill-rose-600" />
                      </button>
                    </div>

                    <div className="p-3 space-y-2">
                      <h4 className="font-bold text-xs text-neutral-900 line-clamp-1">
                        {product.title}
                      </h4>
                      <div className="flex items-baseline gap-1.5">
                        {product.discountPrice ? (
                          <>
                            <span className="text-[10px] line-through text-neutral-400">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-xs font-extrabold text-red-600">
                              ${product.discountPrice.toFixed(2)} CAD
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-neutral-900">
                            ${product.originalPrice.toFixed(2)} CAD
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setCurrentView('product');
                        }}
                        className="w-full py-2 bg-neutral-950 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        View & Select
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
