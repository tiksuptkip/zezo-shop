import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  ChevronDown, 
  Truck, 
  RotateCcw,
  MessageCircle
} from 'lucide-react';
import { WHATSAPP_LINK, WHATSAPP_DISPLAY } from './WhatsAppFloatingButton';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartItemCount,
    cartSubtotal,
    wishlist,
    currentUser,
    selectedCategory,
    setSelectedCategory,
    setSelectedSubCategory,
    setSelectedProductId,
    searchQuery,
    setSearchQuery,
    freeShippingThreshold,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories: { key: Category; label: string; subCategories: string[] }[] = [
    {
      key: 'MEN',
      label: 'MEN',
      subCategories: ['Shirts', 'Blouses', 'T-Shirts', 'Pants', 'Shoes', 'Boots', 'Jackets'],
    },
    {
      key: 'WOMEN',
      label: 'WOMEN',
      subCategories: ['Blouses', 'T-Shirts', 'Pants', 'Dresses', 'Skirts', 'Shoes', 'Heels', 'Bags'],
    },
    {
      key: 'KIDS',
      label: 'KIDS',
      subCategories: ['Boys', 'Girls', 'Baby'],
    },
    {
      key: 'SALE',
      label: 'SALE',
      subCategories: ['Jackets', 'Dresses', 'Shoes', 'Shirts'],
    },
  ];

  const handleCategoryClick = (cat: Category, sub?: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(sub || null);
    setSelectedProductId(null);
    setCurrentView('shop');
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('shop');
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setSelectedProductId(null);
      setSearchOpen(false);
    }
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top Notification Announcement Bar */}
      <div className="bg-neutral-900 text-neutral-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 font-medium">
            <span className="inline-flex items-center justify-center bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              🍁 CANADA ONLY
            </span>
            <span>
              {cartSubtotal >= freeShippingThreshold ? (
                <strong className="text-emerald-400 font-semibold">
                  🎉 Congratulations! You unlocked FREE Canada-wide Shipping!
                </strong>
              ) : (
                <span>
                  <strong>FREE Shipping</strong> on Canadian orders over ${freeShippingThreshold} CAD
                  {cartSubtotal > 0 && (
                    <span className="text-neutral-400 ml-1">
                      (Add ${amountToFreeShipping.toFixed(2)} CAD more!)
                    </span>
                  )}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-300 text-[11px]">
            <span className="hidden md:inline-flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-neutral-400" />
              Cash on Delivery (COD)
            </span>
            <button
              onClick={() => setCurrentView('return-policy')}
              className="hover:text-white transition-colors underline underline-offset-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-neutral-400" />
              14-Day Return Policy
            </button>
            <span className="font-semibold text-neutral-200">CAD $</span>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <button
              id="store-logo-btn"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubCategory(null);
                setSelectedProductId(null);
                setSearchQuery('');
                setCurrentView('home');
              }}
              className="flex items-center gap-2 group text-left"
            >
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 font-['Cabinet_Grotesk'] group-hover:text-rose-600 transition-colors">
                  Zezo Shop
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-500 -mt-1">
                  Canada Fashion
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Categories Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key && currentView === 'shop';
              const isSale = cat.key === 'SALE';

              return (
                <div key={cat.key} className="relative group">
                  <button
                    id={`nav-cat-${cat.key.toLowerCase()}`}
                    onClick={() => handleCategoryClick(cat.key)}
                    className={`px-3 py-2 text-sm font-bold tracking-wide rounded-md transition-colors flex items-center gap-1 ${
                      isSale
                        ? 'text-rose-600 hover:text-rose-700 font-extrabold'
                        : isSelected
                        ? 'text-neutral-950 bg-neutral-100'
                        : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  {/* Dropdown Menu for Subcategories */}
                  <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-neutral-200 p-2.5">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 mb-1">
                        {cat.label} Categories
                      </div>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => handleCategoryClick(cat.key)}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors flex items-center justify-between"
                        >
                          <span>All {cat.label}</span>
                          <span className="text-[10px] text-neutral-400 font-normal">View All</span>
                        </button>
                        {cat.subCategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => handleCategoryClick(cat.key, sub)}
                            className="w-full text-left px-3 py-1.5 text-xs text-neutral-600 rounded-lg hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                id="search-input-header"
                type="text"
                placeholder="Search coats, boots, dresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 text-neutral-900 text-sm rounded-full pl-9 pr-4 py-2 border border-transparent focus:border-neutral-300 focus:bg-white focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Action Icons Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-neutral-700 hover:text-neutral-950 md:hidden rounded-full hover:bg-neutral-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => setCurrentView('account')}
              className="relative p-2 text-neutral-700 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account */}
            <button
              id="header-user-btn"
              onClick={() => setCurrentView('account')}
              className="flex items-center gap-2 p-2 text-neutral-700 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-colors"
              title={currentUser ? currentUser.fullName : 'Sign In'}
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="hidden xl:inline text-xs font-semibold text-neutral-800 max-w-[100px] truncate">
                  {currentUser.fullName.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Cart Button with Count Badge */}
            <button
              id="header-cart-btn"
              onClick={() => setCurrentView('cart')}
              className="flex items-center gap-2 bg-neutral-950 text-white hover:bg-neutral-800 px-3.5 py-2 rounded-full transition-colors shadow-sm"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">
                ${cartSubtotal.toFixed(2)} CAD
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input when expanded */}
        {searchOpen && (
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search coats, boots, dresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-neutral-100 text-neutral-900 text-sm rounded-full pl-9 pr-4 py-2 border border-neutral-300 focus:bg-white focus:outline-none"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="font-extrabold text-xl text-neutral-950">Zezo Shop</div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {categories.map((cat) => (
                  <div key={cat.key} className="space-y-2">
                    <button
                      onClick={() => handleCategoryClick(cat.key)}
                      className={`text-base font-bold w-full text-left flex items-center justify-between ${
                        cat.key === 'SALE' ? 'text-rose-600' : 'text-neutral-900'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-xs text-neutral-400">View All</span>
                    </button>
                    <div className="grid grid-cols-2 gap-1.5 pl-2">
                      {cat.subCategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleCategoryClick(cat.key, sub)}
                          className="text-left text-xs py-1 text-neutral-600 hover:text-neutral-950"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
                    <MessageCircle className="w-3 h-3 fill-white" />
                  </div>
                  <span>Chat on WhatsApp</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Online
                </span>
              </a>

              <button
                onClick={() => {
                  setCurrentView('return-policy');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs font-semibold text-neutral-700 hover:text-neutral-950 py-1"
              >
                14-Day Canadian Return Policy
              </button>
              <div className="text-[11px] text-neutral-400">
                Canada Only • Currency: CAD $
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
