import React, { useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';

export const WHATSAPP_NUMBER = '+16479823641';
export const WHATSAPP_DISPLAY = '+1 (647) 982-3641';
export const WHATSAPP_LINK = 'https://wa.me/16479823641?text=Hello%20Zezo%20Shop%2C%20I%20need%20help%20with%20my%20order';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
      <a
        id="floating-whatsapp-btn"
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-950/25 hover:shadow-xl hover:shadow-emerald-950/40 hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {/* Subtle pulsing background ring */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none"
          style={{ animationDuration: '2.5s' }}
        />

        {/* WhatsApp Icon */}
        <div className="relative z-10 flex items-center justify-center w-8 h-8 pointer-events-none drop-shadow-sm">
          <MessageCircle className="w-8 h-8 text-white fill-white" />
          <Phone className="w-4 h-4 text-[#25D366] fill-[#25D366] absolute transform rotate-12" />
        </div>

        {/* Tooltip on hover */}
        <div
          role="tooltip"
          className={`absolute right-[72px] top-1/2 -translate-y-1/2 bg-neutral-950 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap pointer-events-none transition-all duration-200 border border-neutral-800 flex items-center gap-2 ${
            isHovered
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-2'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>Chat with us on WhatsApp</span>

          {/* Little arrow caret pointing toward the button */}
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-950 border-t border-r border-neutral-800 rotate-45" />
        </div>
      </a>
    </div>
  );
};
