import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { WHATSAPP_LINK, WHATSAPP_DISPLAY } from './WhatsAppFloatingButton';

export const WhatsAppAnnouncementBar: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('zezo_whatsapp_bar_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('zezo_whatsapp_bar_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed) return null;

  return (
    <div
      id="whatsapp-announcement-bar"
      className="bg-black text-white text-xs py-2 px-4 border-b border-neutral-800 relative z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left / Center: Prompt message */}
        <div className="flex-1 flex items-center justify-center sm:justify-start">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1.5 transition-colors group cursor-pointer text-center sm:text-left"
          >
            <span className="text-neutral-200">
              Need Help? Chat with us on WhatsApp:{' '}
              <strong className="text-white font-bold group-hover:text-emerald-400 transition-colors">
                {WHATSAPP_DISPLAY}
              </strong>
            </span>
          </a>
        </div>

        {/* Right side: WhatsApp Icon Link & Dismiss Button */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            id="whatsapp-top-bar-link"
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open WhatsApp Chat"
            title="Chat with us on WhatsApp"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all transform hover:scale-105 shadow-sm text-[11px] font-semibold"
          >
            <div className="relative flex items-center justify-center w-3.5 h-3.5">
              <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
              <Phone className="w-1.5 h-1.5 text-[#25D366] fill-[#25D366] absolute transform rotate-12" />
            </div>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button
            id="dismiss-whatsapp-bar-btn"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            title="Dismiss"
            className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
