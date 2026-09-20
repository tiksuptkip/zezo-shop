import React from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, RotateCcw, ShieldCheck, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK, WHATSAPP_DISPLAY } from './WhatsAppFloatingButton';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useStore();

  const canadianProvinces = [
    'Ontario (ON)',
    'Quebec (QC)',
    'British Columbia (BC)',
    'Alberta (AB)',
    'Manitoba (MB)',
    'Saskatchewan (SK)',
    'Nova Scotia (NS)',
    'New Brunswick (NB)',
    'Newfoundland & Labrador (NL)',
    'Prince Edward Island (PE)',
    'Yukon (YT)',
    'Northwest Territories (NT)',
    'Nunavut (NU)',
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Canada Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-rose-500 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Canada-Wide Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Direct shipping to all 10 provinces & 3 territories with live provincial rates. 
                <strong className="text-white font-semibold ml-1">FREE shipping over $1000 CAD.</strong>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Cash on Delivery (COD)</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Zero advance payment risk. Inspect package upon arrival and pay in Canadian Dollars directly to your courier.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">14-Day Return Policy</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Hassle-free returns within 14 days. Customer covers return shipping courier fees per our transparent Canadian policy.
              </p>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="text-2xl font-black text-white font-['Cabinet_Grotesk'] tracking-tight">
              Zezo Shop
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Canada's dedicated modern apparel destination. Premium coats, bespoke shirts, dresses, denim, footwear, and accessories tailored for life across Canada.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Montreal • Toronto • Vancouver (Canada)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>support@zezoshop.ca</span>
              </div>
              <a
                id="footer-whatsapp-contact"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-emerald-400 transition-colors group pt-1"
                aria-label="Chat with Zezo Shop on WhatsApp"
              >
                <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <MessageCircle className="w-3 h-3 text-white fill-white" />
                    <Phone className="w-1.5 h-1.5 text-[#25D366] fill-[#25D366] absolute transform rotate-12" />
                  </div>
                </div>
                <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {WHATSAPP_DISPLAY}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                  WhatsApp
                </span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Categories
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('MEN');
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Men's Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('WOMEN');
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Women's Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('KIDS');
                    setCurrentView('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Kids & Baby
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('SALE');
                    setCurrentView('shop');
                  }}
                  className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                >
                  Clearance & Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('return-policy')}
                  className="text-neutral-300 hover:text-white transition-colors underline underline-offset-2"
                >
                  Canadian Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('checkout')}
                  className="hover:text-white transition-colors"
                >
                  Shipping Rates by Province
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-white transition-colors"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-medium"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                  WhatsApp Customer Chat
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Shipping Coverage */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Provinces Served
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {canadianProvinces.map((prov) => (
                <span
                  key={prov}
                  className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded"
                >
                  {prov.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © 2026 Zezo Shop Canada Inc. All rights reserved. English Only.
          </div>
          <div className="flex items-center gap-4">
            <span>Currency: CAD $</span>
            <span>•</span>
            <span>Payment: Cash on Delivery</span>
            <span>•</span>
            <button
              onClick={() => setCurrentView('return-policy')}
              className="hover:text-white"
            >
              Return Rules
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
