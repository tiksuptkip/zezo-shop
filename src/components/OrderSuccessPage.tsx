import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  Banknote, 
  RotateCcw, 
  Calendar, 
  ArrowRight, 
  Printer,
  MessageCircle
} from 'lucide-react';
import { MANDATORY_RETURN_POLICY_TEXT } from '../data/returnPolicy';

export const OrderSuccessPage: React.FC = () => {
  const { lastPlacedOrder, setCurrentView } = useStore();

  if (!lastPlacedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900">No active order found.</h2>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2 bg-neutral-950 text-white rounded-lg text-sm font-semibold"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  // Calculate delivery date 3-5 business days from now
  const orderDate = new Date(lastPlacedOrder.createdAt);
  const deliveryStart = new Date(orderDate);
  deliveryStart.setDate(orderDate.getDate() + 3);
  const deliveryEnd = new Date(orderDate);
  deliveryEnd.setDate(orderDate.getDate() + 5);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Badge */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
          Thank You! Your Order is Confirmed
        </h1>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto">
          We've received your order and our Canadian fulfillment center is preparing your package for shipment.
        </p>
      </div>

      {/* Order Summary Box */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        {/* Header Bar */}
        <div className="bg-neutral-900 text-white p-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
              Order Reference Number
            </div>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-white mt-0.5">
              {lastPlacedOrder.id}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
              Estimated Delivery
            </div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 sm:justify-end mt-0.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(deliveryStart)} – {formatDate(deliveryEnd)}</span>
            </div>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Important COD Cash Notice */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Banknote className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 space-y-1">
              <div className="font-extrabold text-sm">
                Cash on Delivery (COD) Payment Due: ${lastPlacedOrder.total.toFixed(2)} CAD
              </div>
              <p className="leading-relaxed">
                Please prepare the exact amount of <strong>${lastPlacedOrder.total.toFixed(2)} CAD</strong> in cash for the courier when your package arrives at your doorstep.
              </p>
            </div>
          </div>

          {/* CRITICAL RETURN POLICY TEXT REQUIREMENT */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-800 space-y-1">
              <div className="font-extrabold text-neutral-950">
                Canadian Return Policy
              </div>
              <p className="font-medium text-neutral-900 leading-relaxed">
                "{MANDATORY_RETURN_POLICY_TEXT}"
              </p>
              <p className="text-[11px] text-neutral-500">
                Returns must be in unused condition with all original tags attached within 14 days of delivery.
              </p>
            </div>
          </div>

          {/* Shipping Address & Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Shipping Destination (Canada)
              </h3>
              <div className="text-sm font-semibold text-neutral-900">
                {lastPlacedOrder.shippingAddress.fullName}
              </div>
              <div className="text-xs text-neutral-600 mt-1 space-y-0.5">
                <div>{lastPlacedOrder.shippingAddress.street} {lastPlacedOrder.shippingAddress.apt}</div>
                <div>{lastPlacedOrder.shippingAddress.city}, {lastPlacedOrder.shippingAddress.province} {lastPlacedOrder.shippingAddress.postalCode}</div>
                <div>Phone: {lastPlacedOrder.shippingAddress.phone}</div>
                <div>Email: {lastPlacedOrder.customerEmail}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                Payment & Fulfillment
              </h3>
              <div className="text-xs text-neutral-700 space-y-1">
                <div>Payment Method: <strong>{lastPlacedOrder.paymentMethod}</strong></div>
                <div>Order Status: <span className="inline-block px-2 py-0.5 bg-neutral-900 text-white font-bold rounded-sm text-[10px] uppercase">{lastPlacedOrder.status}</span></div>
                <div>Shipping Method: <strong>Canadian Provincial Courier</strong></div>
                {lastPlacedOrder.isFreeShipping && (
                  <div className="text-emerald-700 font-bold">
                    ✓ FREE Shipping Applied (Order ≥ $1000 CAD)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="pt-4 border-t border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Items Ordered
            </h3>
            <div className="divide-y divide-neutral-100">
              {lastPlacedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-14 object-cover rounded-lg border border-neutral-200"
                    />
                    <div>
                      <div className="font-bold text-neutral-900">{item.title}</div>
                      <div className="text-neutral-500 text-[11px]">
                        Color: {item.colorName} • Size: {item.size} • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-extrabold text-neutral-950 text-sm">
                    ${(item.price * item.quantity).toFixed(2)} CAD
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-bold text-neutral-900">
                ${lastPlacedOrder.subtotal.toFixed(2)} CAD
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping Fee ({lastPlacedOrder.shippingAddress.province})</span>
              <span className="font-bold text-neutral-900">
                {lastPlacedOrder.isFreeShipping ? (
                  <span className="text-emerald-700 font-extrabold">$0.00 CAD FREE</span>
                ) : (
                  `$${lastPlacedOrder.shippingCost.toFixed(2)} CAD`
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm">
              <span className="font-extrabold text-neutral-950">Total Amount Due</span>
              <span className="text-xl font-black text-neutral-950">
                ${lastPlacedOrder.total.toFixed(2)} CAD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Order Support */}
      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="font-bold text-neutral-900 text-sm">Need help with Order #{lastPlacedOrder.id}?</div>
            <p className="text-neutral-600">Chat directly with our Canadian dispatch team on WhatsApp: +1 (647) 982-3641</p>
          </div>
        </div>
        <a
          href={`https://wa.me/16479823641?text=Hello%20Zezo%20Shop%2C%20I%20have%20a%20question%20about%20my%20order%20%23${encodeURIComponent(lastPlacedOrder.id)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg transition-colors shrink-0 shadow-sm flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          Chat on WhatsApp
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => setCurrentView('account')}
          className="w-full sm:w-auto px-6 py-3 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-colors"
        >
          View in My Account
        </button>
        <button
          onClick={() => setCurrentView('shop')}
          className="w-full sm:w-auto px-8 py-3 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
