import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MapPin, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MANDATORY_RETURN_POLICY_TEXT } from '../data/returnPolicy';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingZones,
    freeShippingThreshold,
    calculateShippingCost,
    placeOrder,
    currentUser,
    setCurrentView,
  } = useStore();

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900">Your cart is empty.</h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2 bg-neutral-950 text-white rounded-lg text-sm font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Pre-fill address if user has saved addresses
  const defaultSavedAddress = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0];

  const [fullName, setFullName] = useState<string>(
    defaultSavedAddress?.fullName || currentUser?.fullName || 'Liam Campbell'
  );
  const [email, setEmail] = useState<string>(
    currentUser?.email || 'liam.campbell@zezo.ca'
  );
  const [phone, setPhone] = useState<string>(
    defaultSavedAddress?.phone || currentUser?.phone || '+1 (416) 555-0144'
  );
  const [street, setStreet] = useState<string>(
    defaultSavedAddress?.street || '240 Bay Street'
  );
  const [apt, setApt] = useState<string>(
    defaultSavedAddress?.apt || 'Suite 1804'
  );
  const [city, setCity] = useState<string>(
    defaultSavedAddress?.city || 'Toronto'
  );
  // Canadian Province state: defaults to Ontario or saved
  const [province, setProvince] = useState<string>(
    defaultSavedAddress?.province || 'Ontario'
  );
  const [postalCode, setPostalCode] = useState<string>(
    defaultSavedAddress?.postalCode || 'M5J 2N8'
  );

  const [returnAcknowledged, setReturnAcknowledged] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Referral code state
  const [referralCodeInput, setReferralCodeInput] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('referred_by') || '';
    }
    return '';
  });
  const [appliedReferral, setAppliedReferral] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('referred_by') || '';
    }
    return '';
  });
  const [referralMsg, setReferralMsg] = useState<string>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('referred_by')) {
      return 'Referral code applied! $10 CAD discount unlocked.';
    }
    return '';
  });

  // Real-time calculation based on selected province & subtotal
  const { cost: liveShippingCost, isFree, zoneName, estimatedDays } = calculateShippingCost(
    province,
    cartSubtotal
  );

  const discountAmount = appliedReferral ? Math.min(10, cartSubtotal) : 0;
  const orderTotal = Math.max(0, cartSubtotal + liveShippingCost - discountAmount);

  const handleApplyReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const code = referralCodeInput.trim().toUpperCase();
    if (!code) {
      setAppliedReferral('');
      setReferralMsg('');
      return;
    }
    setAppliedReferral(code);
    setReferralMsg(`Referral code "${code}" applied! You received $10 CAD discount.`);
    if (typeof window !== 'undefined') {
      localStorage.setItem('referred_by', code);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !street.trim() || !city.trim() || !postalCode.trim()) {
      setFormError('Please fill out all required Canadian shipping address fields.');
      return;
    }

    if (!returnAcknowledged) {
      setFormError('Please acknowledge the Canadian Return Policy before placing your order.');
      return;
    }

    setIsSubmitting(true);

    const shippingAddress: Address = {
      fullName: fullName.trim(),
      street: street.trim(),
      apt: apt.trim() || undefined,
      city: city.trim(),
      province,
      postalCode: postalCode.trim().toUpperCase(),
      phone: phone.trim(),
    };

    setTimeout(() => {
      placeOrder({
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        address: shippingAddress,
        returnAcknowledged: true,
        discount: discountAmount,
        referredBy: appliedReferral || undefined,
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400">
          <span className="text-neutral-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">1</span>
            Cart
          </span>
          <ChevronRight className="w-4 h-4 text-neutral-300" />
          <span className="text-neutral-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">2</span>
            Address & Shipping
          </span>
          <ChevronRight className="w-4 h-4 text-neutral-300" />
          <span className="text-neutral-400 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[10px]">3</span>
            Order Complete
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: Customer Address & COD Payment (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Delivery Address Section */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="text-base font-extrabold text-neutral-950 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-neutral-700" />
                  1. Delivery Address (Canada Only)
                </h2>
                <span className="text-xs text-neutral-500 font-medium">All fields required</span>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Full Name
                  </label>
                  <input
                    id="checkout-fullname-input"
                    type="text"
                    required
                    value={fullName ?? ''}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Liam Campbell"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Email Address (For Order Confirmation)
                  </label>
                  <input
                    id="checkout-email-input"
                    type="email"
                    required
                    value={email ?? ''}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. liam@example.ca"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Canadian Phone Number (For Courier SMS / Call)
                  </label>
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    required
                    value={phone ?? ''}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (416) 555-0144"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Street Address
                  </label>
                  <input
                    id="checkout-street-input"
                    type="text"
                    required
                    value={street ?? ''}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 240 Bay Street"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Apartment / Suite / Unit (Optional)
                  </label>
                  <input
                    id="checkout-apt-input"
                    type="text"
                    value={apt ?? ''}
                    onChange={(e) => setApt(e.target.value)}
                    placeholder="e.g. Suite 1804"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    City
                  </label>
                  <input
                    id="checkout-city-input"
                    type="text"
                    required
                    value={city ?? ''}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Toronto"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>

                {/* PROVINCE DROPDOWN - CRITICAL FOR LIVE RATE CALCULATION */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center justify-between">
                    <span>Province / Territory</span>
                    <span className="text-rose-600 font-semibold text-[11px]">*Updates shipping</span>
                  </label>
                  <select
                    id="checkout-province-select"
                    value={province ?? 'Ontario'}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950 font-semibold"
                  >
                    {shippingZones.map((zone) => (
                      <option key={zone.id} value={zone.provinceName}>
                        {zone.provinceName} ({zone.provinceCode}) — ${zone.shippingCost} CAD
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Postal Code (e.g. M5J 2N8)
                  </label>
                  <input
                    id="checkout-postalcode-input"
                    type="text"
                    required
                    value={postalCode ?? ''}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. M5J 2N8"
                    className="w-full text-sm bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-950 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD: Cash on Delivery ONLY */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h2 className="text-base font-extrabold text-neutral-950 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  2. Payment Method
                </h2>
                <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  COD ONLY
                </span>
              </div>

              {/* Exact COD Text as requested */}
              <div className="p-4 rounded-xl border-2 border-neutral-950 bg-neutral-50 flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-neutral-950">
                    Pay when you receive your order (Cash on Delivery)
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    No online credit card required. Hand Canadian Dollars (CAD) directly to the delivery courier when your parcel arrives at your address.
                  </p>
                </div>
              </div>
            </div>

            {/* MANDATORY RETURN POLICY ACKNOWLEDGMENT */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>Canadian Return Policy Confirmation</span>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-amber-300 text-xs font-semibold text-neutral-900 leading-relaxed">
                "{MANDATORY_RETURN_POLICY_TEXT}"
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={returnAcknowledged}
                  onChange={(e) => setReturnAcknowledged(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-neutral-950 rounded border-neutral-300 focus:ring-neutral-950"
                />
                <span className="text-xs text-amber-950 leading-relaxed">
                  I understand that if I return this order, I will be responsible for covering the return shipping cost based on my province's rate.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('cart')}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-950 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Cart
              </button>

              <button
                id="place-order-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="py-4 px-8 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl font-extrabold text-sm transition-all shadow-lg active:scale-[0.99] flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Generating Order...</span>
                ) : (
                  <>
                    <span>Place Order (Cash on Delivery)</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Order Summary & Provincial Shipping (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-neutral-950 uppercase tracking-wide border-b border-neutral-100 pb-3">
              Order Summary ({cart.length} items)
            </h2>

            {/* Items Mini List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
              {cart.map((item) => {
                const itemPrice = item.product.discountPrice ?? item.product.originalPrice;
                return (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-14 object-cover rounded-md border border-neutral-200"
                      />
                      <div>
                        <div className="font-bold text-neutral-900 line-clamp-1">
                          {item.product.title}
                        </div>
                        <div className="text-neutral-500 text-[11px]">
                          Qty: {item.quantity} • {item.selectedColor.name} • {item.selectedSize}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-extrabold text-neutral-900 shrink-0">
                      ${(itemPrice * item.quantity).toFixed(2)} CAD
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Referral / Promo Code Box */}
            <div className="pt-2">
              <form onSubmit={handleApplyReferral} className="flex gap-2">
                <input
                  id="checkout-referral-input"
                  type="text"
                  placeholder="Referral Code (e.g. ZEZO-8888)"
                  value={referralCodeInput ?? ''}
                  onChange={(e) => setReferralCodeInput(e.target.value)}
                  className="flex-1 text-xs bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 uppercase font-mono focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>
              {referralMsg && (
                <p className="mt-1.5 text-[11px] text-emerald-700 font-semibold">
                  ✓ {referralMsg}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-3 border-t border-neutral-200 text-sm">
              <div className="flex justify-between text-neutral-700">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-950">
                  ${cartSubtotal.toFixed(2)} CAD
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Referral Discount ({appliedReferral})</span>
                  <span>-${discountAmount.toFixed(2)} CAD</span>
                </div>
              )}

              {/* Dynamic Provincial Shipping Cost line */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-neutral-800 font-medium">
                    Shipping ({zoneName})
                  </span>
                  <div className="text-[11px] text-neutral-500">
                    Est: {estimatedDays}
                  </div>
                </div>

                <div className="text-right">
                  {isFree ? (
                    <div>
                      <span className="text-xs line-through text-neutral-400 mr-1.5">
                        ${shippingZones.find((z) => z.provinceName === province)?.shippingCost || 20} CAD
                      </span>
                      <span className="text-emerald-600 font-black text-sm">
                        $0.00 CAD (FREE)
                      </span>
                    </div>
                  ) : (
                    <span className="font-extrabold text-neutral-950">
                      ${liveShippingCost.toFixed(2)} CAD
                    </span>
                  )}
                </div>
              </div>

              {/* FREE SHIPPING CELEBRATION BANNER */}
              {isFree ? (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Congratulations! You got FREE shipping (Order ≥ $1000 CAD).</span>
                </div>
              ) : (
                <div className="text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  Tip: Orders of <strong>$1000 CAD or more</strong> automatically receive <strong>$0 FREE shipping</strong> anywhere in Canada.
                </div>
              )}

              {/* Total Calculation */}
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-black text-neutral-950">
                    Total Due on Delivery
                  </span>
                  <div className="text-[11px] text-neutral-500">
                    Cash on Delivery (No online payment)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-neutral-950">
                    ${orderTotal.toFixed(2)}{' '}
                    <span className="text-xs font-bold text-neutral-500">CAD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Security Callouts */}
            <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-neutral-700" />
                <span>Tracked courier delivery to {province}, Canada.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Cash on Delivery: Hand cash directly to courier driver.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
