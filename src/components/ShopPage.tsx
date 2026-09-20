import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Category } from '../types';
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronRight, 
  X, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

const CATEGORY_SUBCATEGORIES: Record<Category, string[]> = {
  MEN: ['All', 'Shirts', 'Blouses', 'T-Shirts', 'Pants', 'Shoes', 'Boots', 'Jackets'],
  WOMEN: ['All', 'Blouses', 'T-Shirts', 'Pants', 'Dresses', 'Skirts', 'Shoes', 'Heels', 'Bags'],
  KIDS: ['All', 'Boys', 'Girls', 'Baby'],
  SALE: ['All', 'Jackets', 'Dresses', 'Boots', 'Shirts', 'Pants'],
};

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    searchQuery,
    setSearchQuery,
    setCurrentView,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const activeCat: Category = selectedCategory || 'MEN';

  // Subcategories available for active category
  const availableSubCategories: string[] = CATEGORY_SUBCATEGORIES[activeCat] || ['All'];

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Category match
    if (selectedCategory) {
      if (selectedCategory === 'SALE') {
        if (!p.discountPrice || p.discountPrice >= p.originalPrice) {
          if (p.category !== 'SALE') return false;
        }
      } else if (p.category !== selectedCategory) {
        return false;
      }
    }

    // Subcategory match
    if (selectedSubCategory && selectedSubCategory !== 'All') {
      if (p.subCategory.toLowerCase() !== selectedSubCategory.toLowerCase()) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchMat = p.material.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchMat) return false;
    }

    // In stock filter
    if (inStockOnly && p.stock <= 0) {
      return false;
    }

    return true;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice ?? a.originalPrice;
    const priceB = b.discountPrice ?? b.originalPrice;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500">
        <button onClick={() => setCurrentView('home')} className="hover:text-neutral-950">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="font-bold text-neutral-900">{selectedCategory}</span>
        {selectedSubCategory !== 'All' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-700">{selectedSubCategory}</span>
          </>
        )}
      </nav>

      {/* Category Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              {selectedCategory === 'SALE' ? 'Sale & Special Promotions' : `${selectedCategory}'s Collection`}
            </h1>
            {selectedCategory === 'SALE' && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase">
                Up to 50% Off
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Showing {sortedProducts.length} items in CAD. Free Shipping on orders ≥ $1000 CAD.
          </p>
        </div>

        {/* Category switcher pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['MEN', 'WOMEN', 'KIDS', 'SALE'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubCategory('All');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wide transition-colors shrink-0 ${
                selectedCategory === cat
                  ? cat === 'SALE'
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-950 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {availableSubCategories.map((sub: string) => (
          <button
            key={sub}
            onClick={() => setSelectedSubCategory(sub)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors shrink-0 border ${
              selectedSubCategory === sub
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Controls Bar: Sort, Stock Filter, Search indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-white border border-neutral-200 rounded-xl shadow-2xs">
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-neutral-800">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950"
            />
            <span>In Stock Only</span>
          </label>

          {searchQuery && (
            <div className="flex items-center gap-1 bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
              <span>Search: "{searchQuery}"</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-red-600 font-bold ml-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-neutral-500">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-950 font-bold"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High (CAD)</option>
            <option value="price-desc">Price: High to Low (CAD)</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl p-8">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-900">
            No products match your current filters
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, changing subcategory, or clearing the in-stock filter.
          </p>
          <button
            onClick={() => {
              setSelectedSubCategory('All');
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="mt-4 px-5 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
