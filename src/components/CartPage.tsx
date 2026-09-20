import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MANDATORY_RETURN_POLICY_TEXT } from '../data/returnPolicy';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    freeShippingThreshold,
    shippingZones,
    calculateShippingCost,
    setCurrentView,
    setSelectedProductId,
  } = useStore();

  const [selectedProvince, setSelectedProvince] = useState<string>('Ontario');

  const { cost: estimatedShippingCost, isFree, zoneName } = calculateShippingCost(
    selectedProvince,
    cartSubtotal
  );

  const amountNeededForFree = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const grandTotal = cartSubtotal + estimatedShippingCost;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-neutral-500 mt-2 max-w-md mx-auto">
          Explore our latest Canadian apparel collections with fast Cash on Delivery anywhere in Canada.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setCurrentView('shop')}
            className="px-6 py-3 bg-neutral-950 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors shadow-md"
          >
            Start Shopping Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
        <button onClick={() => setCurrentView('home')} className="hover:text-neutral-950">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-950 font-bold">Shopping Cart ({cart.length} items)</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight mb-8">
        Your Shopping Bag
      </h1>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-8 shadow-xs">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
          <div className="flex items-center gap-2">
            <Truck className={`w-4 h-4 ${isFree ? 'text-emerald-600' : 'text-neutral-700'}`} />
            {isFree ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Congratulations! You got FREE shipping across Canada!
              </span>
            ) : (
              <span className="text-neutral-800">
                Add <strong className="text-rose-600 font-bold">${amountNeededForFree.toFixed(2)} CAD</strong> more to get <strong>FREE Canada-wide Shipping</strong> (Threshold: ${freeShippingThreshold} CAD)
              </span>
            )}
          </div>
          <span className="text-neutral-500 font-bold">{progressPercent}%</span>
        </div>

        {/* Progress bar track */}
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFree ? 'bg-emerald-500' : 'bg-neutral-900'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs font-semibold text-neutral-500">
            <span>ITEM DESCRIPTION</span>
            <button
              onClick={clearCart}
              className="text-neutral-500 hover:text-red-600 transition-colors underline"
            >
              Clear Cart
            </button>
          </div>

          <div className="divide-y divide-neutral-200">
            {cart.map((item) => {
              const unitPrice = item.product.discountPrice ?? item.product.originalPrice;
              const itemTotal = unitPrice * item.quantity;
              const maxStock = item.product.stock;

              return (
                <div
                  key={item.id}
                  className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      onClick={() => {
                        setSelectedProductId(item.productId);
                        setCurrentView('product');
                      }}
                      className="w-20 h-24 object-cover rounded-xl border border-neutral-200 cursor-pointer shrink-0"
                    />

                    <div className="space-y-1">
                      <h3
                        onClick={() => {
                          setSelectedProductId(item.productId);
                          setCurrentView('product');
                        }}
                        className="font-bold text-sm text-neutral-950 hover:text-rose-600 transition-colors cursor-pointer line-clamp-1"
                      >
                        {item.product.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-neutral-600">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-3 h-3 rounded-full border border-neutral-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                        <span>•</span>
                        <span>Size: <strong>{item.selectedSize}</strong></span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 pt-0.5">
                        {item.product.discountPrice ? (
                          <>
                            <span className="text-xs line-through text-neutral-400">
                              ${item.product.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-sm font-extrabold text-red-600">
                              ${item.product.discountPrice.toFixed(2)} CAD
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-neutral-900">
                            ${item.product.originalPrice.toFixed(2)} CAD
                          </span>
                        )}
                      </div>

                      {/* Stock Warning if near limit */}
                      {item.product.stock <= 5 && (
                        <div className="text-[11px] font-bold text-red-600">
                          Only {item.product.stock} left in stock!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Actions Right */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 self-center">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-neutral-600 hover:bg-neutral-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className="p-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total for this line */}
                    <div className="text-right min-w-[90px]">
                      <div className="text-sm font-extrabold text-neutral-950">
                        ${itemTotal.toFixed(2)} CAD
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        (${unitPrice.toFixed(2)} each)
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 underline"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        {/* RIGHT: Order Summary & Shipping Calculator (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-neutral-950 uppercase tracking-wide border-b border-neutral-100 pb-3">
              Order Summary
            </h2>

            {/* Subtotal */}
            <div className="flex justify-between text-sm text-neutral-700">
              <span>Items Subtotal</span>
              <span className="font-bold text-neutral-950">
                ${cartSubtotal.toFixed(2)} CAD
              </span>
            </div>

            {/* Province Shipping Selector Preview */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-100">
              <label className="block text-xs font-bold text-neutral-800 flex items-center justify-between">
                <span>Shipping to (Canadian Province):</span>
                <span className="text-neutral-400 text-[11px] font-normal">CAD Rates</span>
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full text-xs font-medium bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
              >
                {shippingZones.map((zone) => (
                  <option key={zone.id} value={zone.provinceName}>
                    {zone.provinceName} ({zone.provinceCode}) — ${zone.shippingCost} CAD ({zone.estimatedDays})
                  </option>
                ))}
              </select>
            </div>

            {/* Shipping Cost Line */}
            <div className="flex justify-between text-sm items-center">
              <div>
                <span className="text-neutral-700">Estimated Shipping</span>
                <div className="text-[11px] text-neutral-400">
                  {zoneName}
                </div>
              </div>
              <div>
                {isFree ? (
                  <div className="text-right">
                    <span className="text-xs line-through text-neutral-400 mr-2">
                      ${shippingZones.find(z => z.provinceName === selectedProvince)?.shippingCost || 20} CAD
                    </span>
                    <span className="text-emerald-700 font-extrabold text-sm">
                      $0.00 CAD FREE
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-neutral-950">
                    ${estimatedShippingCost.toFixed(2)} CAD
                  </span>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
              <div>
                <span className="text-base font-extrabold text-neutral-950">Estimated Total</span>
                <div className="text-[11px] text-neutral-500">Payable via Cash on Delivery</div>
              </div>
              <span className="text-2xl font-black text-neutral-950">
                ${grandTotal.toFixed(2)} <span className="text-xs font-bold text-neutral-500">CAD</span>
              </span>
            </div>

            {/* Cash on Delivery Banner */}
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center gap-2.5 text-xs text-neutral-700">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Payment Method:</strong> Cash on Delivery (COD) Only. Pay in CAD upon delivery.
              </div>
            </div>

            {/* Return Policy Notice */}
            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong className="block font-bold mb-0.5">Return Policy:</strong>
              {MANDATORY_RETURN_POLICY_TEXT}
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={() => setCurrentView('checkout')}
              className="w-full py-4 px-6 bg-neutral-950 text-white hover:bg-neutral-800 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
