import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  Truck, 
  Banknote, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Percent, 
  Flame,
  ChevronRight
} from 'lucide-react';
import { MANDATORY_RETURN_POLICY_TEXT } from '../data/returnPolicy';

export const HomePage: React.FC = () => {
  const {
    products,
    setSelectedCategory,
    setSelectedSubCategory,
    setCurrentView,
    freeShippingThreshold,
  } = useStore();

  const saleProducts = products.filter((p) => p.category === 'SALE' || (p.discountPrice && p.discountPrice < p.originalPrice)).slice(0, 4);
  const featuredMen = products.filter((p) => p.category === 'MEN').slice(0, 4);
  const featuredWomen = products.filter((p) => p.category === 'WOMEN').slice(0, 4);
  const featuredKids = products.filter((p) => p.category === 'KIDS').slice(0, 4);

  const handleCategoryClick = (cat: 'MEN' | 'WOMEN' | 'KIDS' | 'SALE') => {
    setSelectedCategory(cat);
    setSelectedSubCategory('All');
    setCurrentView('shop');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* HERO BANNER */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        {/* Background Image Overlay with dark vignette */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
            alt="Zezo Shop Canadian Autumn Winter Apparel"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Canada Fall / Winter 2026 Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              Canadian Crafted Style.<br />
              <span className="text-neutral-300 font-light">Pay Upon Delivery.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal max-w-xl">
              Engineered for Canadian climates and cosmopolitan aesthetics. Pay with <strong className="text-white">Cash on Delivery (COD)</strong> anywhere from St. John's to Victoria.
            </p>

            {/* Special Promo Highlight */}
            <div className="p-4 rounded-xl bg-neutral-800/90 border border-neutral-700/80 max-w-lg text-xs space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Truck className="w-4 h-4" />
                <span>FREE Shipping on Orders Over ${freeShippingThreshold} CAD</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                Enjoy complimentary Canada-wide express courier delivery on qualifying premium orders.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-shop-men-btn"
                onClick={() => handleCategoryClick('MEN')}
                className="px-6 py-3.5 bg-white text-neutral-950 hover:bg-neutral-100 font-extrabold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
              >
                Explore Men
              </button>
              <button
                id="hero-shop-women-btn"
                onClick={() => handleCategoryClick('WOMEN')}
                className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-xs rounded-xl border border-neutral-600 shadow-lg transition-transform active:scale-95"
              >
                Explore Women
              </button>
              <button
                id="hero-shop-sale-btn"
                onClick={() => handleCategoryClick('SALE')}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Percent className="w-3.5 h-3.5" />
                View Sale Deals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CANADA TRUST PILLARS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border border-neutral-200 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <Banknote className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-neutral-950 uppercase tracking-wide">
                Cash on Delivery (COD)
              </h4>
              <p className="text-[11px] text-neutral-500">
                Pay when you receive your order
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <Truck className="w-5 h-5 text-neutral-800" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-neutral-950 uppercase tracking-wide">
                Coast-to-Coast Shipping
              </h4>
              <p className="text-[11px] text-neutral-500">
                10 Provinces & 3 Territories covered
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-neutral-950 uppercase tracking-wide">
                Free Shipping ≥ $1000 CAD
              </h4>
              <p className="text-[11px] text-neutral-500">
                Automatic $0 shipping at checkout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <RotateCcw className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-neutral-950 uppercase tracking-wide">
                14-Day Return Policy
              </h4>
              <p className="text-[11px] text-neutral-500">
                Customer covers return shipping fee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY EXPLORER TILES (MEN, WOMEN, KIDS, SALE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-neutral-950 tracking-tight">
              Main Collections
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Curated tailoring, casualwear, outerwear, and footwear for Canada.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* MEN */}
          <div
            onClick={() => handleCategoryClick('MEN')}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-xs border border-neutral-200"
          >
            <img
              src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80"
              alt="Men Apparel"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="text-xl font-black tracking-tight">MEN</h3>
              <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                Shirts, Pants, Boots, Jackets, Shoes
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white mt-2 group-hover:translate-x-1 transition-transform">
                Shop Men <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* WOMEN */}
          <div
            onClick={() => handleCategoryClick('WOMEN')}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-xs border border-neutral-200"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
              alt="Women Apparel"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="text-xl font-black tracking-tight">WOMEN</h3>
              <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                Blouses, Dresses, Skirts, Heels, Bags
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white mt-2 group-hover:translate-x-1 transition-transform">
                Shop Women <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* KIDS */}
          <div
            onClick={() => handleCategoryClick('KIDS')}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-xs border border-neutral-200"
          >
            <img
              src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80"
              alt="Kids Apparel"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="text-xl font-black tracking-tight">KIDS</h3>
              <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                Boys, Girls, Baby Essentials
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white mt-2 group-hover:translate-x-1 transition-transform">
                Shop Kids <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* SALE */}
          <div
            onClick={() => handleCategoryClick('SALE')}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer shadow-xs border-2 border-red-500"
          >
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
              alt="Sale Deals"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-black/40 to-transparent" />
            <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
              UP TO 50% OFF
            </div>
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="text-xl font-black tracking-tight text-red-300">SALE</h3>
              <p className="text-[11px] text-neutral-200 line-clamp-1 mt-0.5">
                Bold Red Discounts in CAD
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-200 mt-2 group-hover:translate-x-1 transition-transform">
                Explore Deals <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FLASH SALE / BOLD RED DISCOUNT SECTION */}
      {saleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-400 uppercase tracking-wider mb-1">
                  <Flame className="w-4 h-4 text-red-500 fill-red-500" />
                  <span>Limited Canadian Stock</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Flash Sale Highlights
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Promotional pricing with discounts in bold red. Cash on Delivery supported.
                </p>
              </div>

              <button
                onClick={() => handleCategoryClick('SALE')}
                className="self-start sm:self-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-md flex items-center gap-1.5"
              >
                <span>View All Sales</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {saleProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden text-neutral-900 shadow-sm">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED: MEN'S COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Men's Wardrobe Essentials
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Shirts, Blouses, T-Shirts, Pants, Boots, and Canadian Outerwear.
            </p>
          </div>
          <button
            onClick={() => handleCategoryClick('MEN')}
            className="text-xs font-bold text-neutral-900 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMen.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* FEATURED: WOMEN'S COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Women's New Arrivals
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Dresses, Blouses, Tailored Pants, Handbags, and Heels.
            </p>
          </div>
          <button
            onClick={() => handleCategoryClick('WOMEN')}
            className="text-xs font-bold text-neutral-900 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWomen.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* FEATURED: KIDS COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
              Kids & Juniors
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Boys, Girls, and Baby warm cotton wear designed to endure playtime.
            </p>
          </div>
          <button
            onClick={() => handleCategoryClick('KIDS')}
            className="text-xs font-bold text-neutral-900 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredKids.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* POLICY REMINDER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-100 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Transparency & Confidence
            </span>
            <h3 className="text-lg font-black text-neutral-950">
              Clear Canadian Return & Shipping Policies
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              "{MANDATORY_RETURN_POLICY_TEXT}" Products must be unused with original tags within 14 days. Free shipping activates automatically for orders over ${freeShippingThreshold} CAD.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('return-policy')}
            className="px-6 py-3 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shrink-0 shadow-sm"
          >
            Read Full Return Policy
          </button>
        </div>
      </section>
    </div>
  );
};
