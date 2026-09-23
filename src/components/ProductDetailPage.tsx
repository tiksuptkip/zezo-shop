import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductColor } from '../types';
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  ChevronRight, 
  ZoomIn, 
  Share2, 
  Minus, 
  Plus 
} from 'lucide-react';
import { MANDATORY_RETURN_POLICY_TEXT } from '../data/returnPolicy';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedCategory,
    freeShippingThreshold,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product?.colors[0] || { name: 'Standard', hex: '#000000' }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes[0] || 'M'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomCoords, setZoomCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [addedSuccessMessage, setAddedSuccessMessage] = useState<boolean>(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500">Product not found.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountAmount = product.discountPrice
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedColor, selectedSize, quantity);
    setAddedSuccessMessage(true);
    setTimeout(() => setAddedSuccessMessage(false), 3000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 flex-wrap">
        <button
          onClick={() => setCurrentView('home')}
          className="hover:text-neutral-950 transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <button
          onClick={() => {
            setSelectedCategory(product.category);
            setCurrentView('shop');
          }}
          className="hover:text-neutral-950 transition-colors font-medium"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-950 font-semibold truncate max-w-xs sm:max-w-md">
          {product.title}
        </span>
      </nav>

      {/* Main Grid: Gallery Left + Details Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: Image Gallery with Interactive Zoom */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails list */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-neutral-950 ring-2 ring-neutral-950/20'
                    : 'border-neutral-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.title} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Display Image with Zoom Functionality */}
          <div
            id="product-image-zoom-container"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative flex-1 aspect-[3/4] bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 cursor-crosshair shadow-sm select-none"
          >
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className={`w-full h-full object-cover transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                    }
                  : undefined
              }
            />

            {/* Hover Zoom Hint */}
            <div className="absolute bottom-3 right-3 bg-neutral-900/70 text-white text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 pointer-events-none">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Hover to zoom</span>
            </div>

            {/* Stock Alert Badge over Image */}
            {isLowStock && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                Only {product.stock} left in stock!
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">
                Sold Out / Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Product Buy Box & Options */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Badges */}
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span className="font-bold tracking-widest uppercase text-neutral-600">
                {product.category} • {product.subCategory}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                ★ {product.rating.toFixed(1)}{' '}
                <span className="text-neutral-400 font-normal">
                  ({product.reviewCount} customer reviews)
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price display with BOLD RED discount */}
            <div className="mt-3 flex items-baseline gap-3">
              {product.discountPrice ? (
                <>
                  <span className="text-base sm:text-lg line-through text-neutral-400 font-medium">
                    ${product.originalPrice.toFixed(2)} CAD
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-red-600">
                    ${product.discountPrice.toFixed(2)}{' '}
                    <span className="text-sm font-bold">CAD</span>
                  </span>
                  <span className="bg-red-50 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
                    Save {discountAmount}%
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
                  ${product.originalPrice.toFixed(2)}{' '}
                  <span className="text-sm font-bold text-neutral-500">CAD</span>
                </span>
              )}
            </div>
          </div>

          {/* Description & Material */}
          <div className="space-y-2 py-3 border-y border-neutral-200">
            <p className="text-sm text-neutral-700 leading-relaxed">
              {product.description}
            </p>
            <div className="text-xs text-neutral-600">
              <span className="font-bold text-neutral-900">Material & Composition:</span>{' '}
              {product.material}
            </div>
          </div>

          {/* Color Selector (Circles) */}
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              Color:{' '}
              <span className="font-semibold text-neutral-600 capitalize">
                {selectedColor.name}
              </span>
            </label>
            <div className="flex items-center gap-3">
              {product.colors.map((color, idx) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                      isSelected
                        ? 'border-neutral-950 scale-110 ring-2 ring-neutral-950/20'
                        : 'border-neutral-300 hover:border-neutral-500'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="block w-full h-full rounded-full shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className={`w-3.5 h-3.5 ${
                            color.hex === '#FFFFFF' || color.hex.toLowerCase() === '#f8f9fa'
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <label className="font-bold text-neutral-900 uppercase tracking-wider">
                Select Size: <span className="text-neutral-600">{selectedSize}</span>
              </label>
              <span className="text-neutral-400 font-medium">Canada True to Fit</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-10 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                        : 'bg-white text-neutral-800 border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STOCK LOGIC:
              Admin adds 10 items, if 5 sold, show automatically "Only 5 left in stock!" in red. 
              If 0, show Out of Stock.
          */}
          <div className="rounded-lg p-3 bg-neutral-50 border border-neutral-200">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-neutral-600 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                <span>Out of Stock — This product is currently unavailable.</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-red-600 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span>Only {product.stock} left in stock! Order soon before it sells out.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>In Stock ({product.stock} units available at Canada Warehouse)</span>
              </div>
            )}
          </div>

          {/* Quantity and Add to Cart Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity (+/-) */}
              <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-3 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-3 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                id="add-to-cart-detail-btn"
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-lg font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-neutral-950 text-white hover:bg-neutral-800 active:scale-[0.99]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-lg border transition-colors shadow-xs ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {addedSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold p-3 rounded-lg flex items-center justify-between animate-fadeIn">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Added {quantity} × "{product.title}" to your cart!
                </span>
                <button
                  onClick={() => setCurrentView('cart')}
                  className="underline font-bold text-emerald-950 hover:text-emerald-700"
                >
                  View Cart
                </button>
              </div>
            )}
          </div>

          {/* Reassurance Features (COD, Canadian Shipping, Return Policy) */}
          <div className="pt-4 border-t border-neutral-200 space-y-3 text-xs text-neutral-600">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">Cash on Delivery (COD):</strong> Pay when your package arrives at your Canadian door.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900">Canadian Provincial Shipping:</strong> Calculated automatically at checkout based on your province. 
                <span className="text-emerald-700 font-semibold ml-1">FREE over ${freeShippingThreshold} CAD!</span>
              </div>
            </div>

            {/* Return Policy Notice Highlight */}
            <div className="flex items-start gap-3 bg-amber-50/70 p-3 rounded-lg border border-amber-200/80">
              <RotateCcw className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-amber-900">
                <strong className="font-bold">Return Policy Notice:</strong> {MANDATORY_RETURN_POLICY_TEXT}
                <div className="mt-1">
                  <button
                    onClick={() => setCurrentView('return-policy')}
                    className="text-amber-800 underline font-semibold text-[11px]"
                  >
                    Read full 14-day Canadian Return Policy →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Canadian Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-950">
              More from {product.category}
            </h2>
            <button
              onClick={() => {
                setSelectedCategory(product.category);
                setCurrentView('shop');
              }}
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 underline"
            >
              View Category
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => {
              const relLowStock = p.stock > 0 && p.stock <= 5;
              const relOutOfStock = p.stock <= 0;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProductId(p.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-white rounded-xl border border-neutral-200 p-3 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] rounded-lg bg-neutral-100 overflow-hidden mb-2 relative">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {relLowStock && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Only {p.stock} left!
                      </span>
                    )}
                    {relOutOfStock && (
                      <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Sold Out
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 group-hover:text-rose-600 line-clamp-1">
                      {p.title}
                    </h4>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      {p.discountPrice ? (
                        <>
                          <span className="text-[10px] line-through text-neutral-400">
                            ${p.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-xs font-extrabold text-red-600">
                            ${p.discountPrice.toFixed(2)} CAD
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-neutral-900">
                          ${p.originalPrice.toFixed(2)} CAD
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
