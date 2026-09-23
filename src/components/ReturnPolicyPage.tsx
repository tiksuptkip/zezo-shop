import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Truck, 
  HelpCircle, 
  ChevronRight, 
  FileText, 
  Mail, 
  Phone,
  MessageCircle
} from 'lucide-react';
import { MANDATORY_RETURN_POLICY_TEXT, RETURN_POLICY_DETAILS } from '../data/returnPolicy';
import { WHATSAPP_LINK, WHATSAPP_DISPLAY } from './WhatsAppFloatingButton';

export const ReturnPolicyPage: React.FC = () => {
  const { setCurrentView, shippingZones } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
        <button onClick={() => setCurrentView('home')} className="hover:text-neutral-950">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-950 font-bold">Canadian Return Policy (/return-policy)</span>
      </nav>

      {/* Main Header */}
      <div className="border-b border-neutral-200 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-3">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Canada Market Policies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
          Zezo Shop Return & Exchange Policy
        </h1>
        <p className="text-base text-neutral-600 mt-2 max-w-2xl">
          Everything you need to know about returning merchandise across Canada, return shipping fee responsibilities, and our 14-day policy.
        </p>
      </div>

      {/* Mandatory Highlight Box */}
      <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 mb-12 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Core Policy Statement
            </div>
            <div className="text-base sm:text-lg font-black text-amber-950">
              "{MANDATORY_RETURN_POLICY_TEXT}"
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              If an item is returned due to personal preference, buyer's remorse, or improper fit, the customer is responsible for covering the return shipping courier cost back to our fulfillment depot.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-extrabold text-sm">
            14D
          </div>
          <h3 className="font-extrabold text-neutral-950 text-base">
            14-Day Return Window
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            All return requests must be initiated within 14 calendar days from the date your order was marked delivered by the carrier.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-extrabold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-extrabold text-neutral-950 text-base">
            Unused & Original Condition
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Merchandise must be unworn, unwashed, unaltered, and with all original brand tags, labels, and hygiene seals intact.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 font-extrabold">
            <Truck className="w-5 h-5 text-neutral-700" />
          </div>
          <h3 className="font-extrabold text-neutral-950 text-base">
            Customer Pays Return Shipping
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Return shipping fees correspond to standard provincial rates and will be deducted from your Cash on Delivery refund.
          </p>
        </div>
      </div>

      {/* Provincial Return Courier Cost Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 mb-12 shadow-xs">
        <h2 className="text-lg font-extrabold text-neutral-950 mb-2 flex items-center gap-2">
          <Truck className="w-5 h-5 text-neutral-700" />
          Return Shipping Fee Schedule by Canadian Province
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          When an order is returned, the system calculates the return courier cost according to your shipping province:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Canadian Province / Territory</th>
                <th className="py-3 px-4">Province Code</th>
                <th className="py-3 px-4">Customer Return Shipping Fee (CAD)</th>
                <th className="py-3 px-4">Transit Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {shippingZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-neutral-900">
                    {zone.provinceName}
                  </td>
                  <td className="py-3 px-4 text-neutral-500 font-mono">
                    {zone.provinceCode}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-red-600">
                    ${zone.shippingCost.toFixed(2)} CAD
                  </td>
                  <td className="py-3 px-4 text-neutral-600">
                    {zone.estimatedDays}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash on Delivery (COD) Refund Steps */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 mb-12">
        <h2 className="text-lg font-extrabold mb-4">
          How Cash on Delivery (COD) Refunds Work
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          <p>
            Because your purchase was paid in cash upon delivery to the courier driver, refunds for approved returns are processed safely and directly:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-neutral-800 p-4 rounded-xl space-y-1">
              <strong className="text-white block font-bold">1. Interac e-Transfer (Direct to Canadian Bank)</strong>
              <p className="text-xs text-neutral-400">
                After our inspection team confirms the item is unused with tags, we send an Interac e-Transfer to your registered Canadian email/mobile number within 3-5 business days.
              </p>
            </div>
            <div className="bg-neutral-800 p-4 rounded-xl space-y-1">
              <strong className="text-white block font-bold">2. Zezo Shop Digital Store Credit</strong>
              <p className="text-xs text-neutral-400">
                Receive instant store credit with an additional 5% bonus applicable immediately to any future apparel order.
              </p>
            </div>
          </div>
          <div className="pt-2 text-xs text-neutral-400">
            * Note: The provincial return shipping fee will be deducted from the total refund amount as outlined in our policy.
          </div>
        </div>
      </div>

      {/* Contact Canada Support */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-bold text-neutral-950">
            Need to start a return or exchange?
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Our Canadian support team in Montreal and Toronto is available Monday to Friday, 9am - 6pm EST.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#25D366] text-white rounded-lg text-xs font-bold hover:bg-[#20bd5a] flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            WhatsApp: {WHATSAPP_DISPLAY}
          </a>
          <a
            href="mailto:support@zezoshop.ca"
            className="px-4 py-2 bg-neutral-950 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            support@zezoshop.ca
          </a>
        </div>
      </div>
    </div>
  );
};
