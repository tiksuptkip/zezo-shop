import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, AlertCircle, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    setSelectedProductId,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const isLiked = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultColor = product.colors[0] || { name: 'Standard', hex: '#000000' };
    const defaultSize = product.sizes[0] || 'M';
    addToCart(product, defaultColor, defaultSize, 1);
  };

  const handleOpenDetail = () => {
    setSelectedProductId(product.id);
    setCurrentView('product');
  };

  return (
    <div
      onClick={handleOpenDetail}
      className="group relative bg-white rounded-xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Secondary image flip on hover if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.title} alternate angle`}
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.category === 'SALE' && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm tracking-wider">
              SALE
            </span>
          )}
          {product.isNew && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm tracking-wider">
              NEW
            </span>
          )}
          {isLowStock && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              Only {product.stock} left in stock!
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-neutral-800 text-neutral-200 text-[10px] font-bold px-2 py-0.5 rounded-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            isLiked
              ? 'bg-white text-rose-600'
              : 'bg-white/80 text-neutral-600 hover:text-neutral-950 hover:bg-white'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Hover Quick Action Buttons */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-1.5 ${
              isOutOfStock
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-neutral-950 text-white hover:bg-neutral-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Sold Out' : 'Quick Add'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetail();
            }}
            className="p-2 bg-white text-neutral-800 rounded-lg hover:bg-neutral-100 shadow-md"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">
              {product.category} • {product.subCategory}
            </span>
            <span className="text-[11px] text-neutral-400">
              ★ {product.rating} ({product.reviewCount})
            </span>
          </div>

          <h3 className="font-bold text-sm text-neutral-900 group-hover:text-rose-600 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
            {product.material}
          </p>
        </div>

        {/* Color preview circles */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.slice(0, 4).map((c, idx) => (
            <span
              key={idx}
              className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-neutral-400 font-medium">
              +{product.colors.length - 4}
            </span>
          )}
        </div>

        {/* Pricing: Show discount in BOLD RED as required */}
        <div className="pt-2 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-xs line-through text-neutral-400 font-medium">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="text-base font-extrabold text-red-600">
                  ${product.discountPrice.toFixed(2)} <span className="text-xs font-bold">CAD</span>
                </span>
              </>
            ) : (
              <span className="text-base font-extrabold text-neutral-900">
                ${product.originalPrice.toFixed(2)} <span className="text-xs font-bold text-neutral-500">CAD</span>
              </span>
            )}
          </div>

          {/* Stock Notification or indicator */}
          {isLowStock ? (
            <span className="text-[11px] font-bold text-red-600">
              Only {product.stock} left!
            </span>
          ) : isOutOfStock ? (
            <span className="text-[11px] font-semibold text-neutral-400">
              Out of stock
            </span>
          ) : (
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              In Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
