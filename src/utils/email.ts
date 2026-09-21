import emailjs from '@emailjs/browser';
import { Order } from '../types';

// EmailJS Configuration - can be set via env variables or custom dashboard settings
export const EMAILJS_CONFIG = {
  serviceId: (typeof process !== 'undefined' && process.env?.VITE_EMAILJS_SERVICE_ID) || 'service_zezo_shop',
  confirmationTemplateId: (typeof process !== 'undefined' && process.env?.VITE_EMAILJS_CONFIRM_TEMPLATE) || 'template_order_confirm',
  shippingTemplateId: (typeof process !== 'undefined' && process.env?.VITE_EMAILJS_SHIPPING_TEMPLATE) || 'template_order_shipped',
  publicKey: (typeof process !== 'undefined' && process.env?.VITE_EMAILJS_PUBLIC_KEY) || '',
};

// Simple global notification bus for in-app feedback toasts
type EmailNotificationListener = (notif: {
  type: 'confirmation' | 'shipping';
  to: string;
  subject: string;
  orderId: string;
  trackingNumber?: string;
  shippingCompany?: string;
  simulated: boolean;
  timestamp: string;
}) => void;

const listeners: EmailNotificationListener[] = [];

export const onEmailSent = (listener: EmailNotificationListener) => {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx >= 0) listeners.splice(idx, 1);
  };
};

const notifyEmailSent = (data: {
  type: 'confirmation' | 'shipping';
  to: string;
  subject: string;
  orderId: string;
  trackingNumber?: string;
  shippingCompany?: string;
  simulated: boolean;
}) => {
  const notif = { ...data, timestamp: new Date().toLocaleTimeString() };
  listeners.forEach((fn) => {
    try {
      fn(notif);
    } catch (e) {
      console.error(e);
    }
  });
};

/**
 * Send order confirmation email: "تم استلام طلبك #123 - شكرا لك"
 */
export const sendOrderConfirmation = async (order: Order): Promise<{
  success: boolean;
  simulated: boolean;
  message: string;
}> => {
  const recipientEmail = order.customerEmail || order.email || 'customer@zezo.ca';
  const subject = `تم استلام طلبك #${order.id} - شكرا لك`;

  const templateParams = {
    to_email: recipientEmail,
    to_name: order.customerName,
    order_id: order.id,
    subject: subject,
    order_total: `$${(order.finalTotal ?? order.total).toFixed(2)} CAD`,
    payment_method: order.paymentMethod || 'Cash on Delivery (COD)',
    shipping_province: order.shippingAddress?.province || order.address?.province || 'Canada',
    items_count: order.items.length,
    items_summary: order.items.map((it) => `${it.title} (${it.size}, Qty: ${it.quantity})`).join(', '),
    created_at: new Date(order.createdAt).toLocaleString('en-CA'),
    message_arabic: `تم استلام طلبك بنجاح! رقم الطلب: ${order.id}. يرجى تجهيز المبلغ المطلوب نقداً عند استلام الطلب من مندوب التوصيل.`,
  };

  // If public key is not provided or set to dummy value, simulate via console.log and toast
  const isConfigured = Boolean(
    EMAILJS_CONFIG.publicKey && 
    EMAILJS_CONFIG.publicKey !== 'MY_EMAILJS_PUBLIC_KEY' &&
    EMAILJS_CONFIG.publicKey.length > 5
  );

  if (isConfigured) {
    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.confirmationTemplateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );
      console.log('✅ [EmailJS] Order Confirmation sent successfully:', response.status, response.text);
      notifyEmailSent({
        type: 'confirmation',
        to: recipientEmail,
        subject,
        orderId: order.id,
        simulated: false,
      });
      return {
        success: true,
        simulated: false,
        message: `Confirmation email sent to ${recipientEmail}`,
      };
    } catch (error) {
      console.warn('⚠️ [EmailJS] Send failed, falling back to simulated dispatch:', error);
    }
  }

  // Simulation mode (standard MVP requirement):
  const emailLog = `
================= 📧 EMAIL SYSTEM: ORDER CONFIRMATION =================
To: ${recipientEmail}
Subject: ${subject}
Order ID: #${order.id}
Customer: ${order.customerName} (${order.customerPhone || order.phone || ''})
Destination: ${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.province || ''}
Total Due (COD): $${(order.finalTotal ?? order.total).toFixed(2)} CAD
Items: ${templateParams.items_summary}
Arabic Note: تم استلام طلبك #${order.id} - شكرا لك لاختيارك متجر Zezo Shop Canada!
========================================================================
  `;
  console.log(emailLog);

  // Notify UI
  notifyEmailSent({
    type: 'confirmation',
    to: recipientEmail,
    subject,
    orderId: order.id,
    simulated: true,
  });

  return {
    success: true,
    simulated: true,
    message: `Email would be sent to: ${recipientEmail}`,
  };
};

/**
 * Send shipping update email: "تم شحن طلبك #123 - رقم التتبع: XYZ - شركة الشحن: ..."
 */
export const sendShippingEmail = async (
  order: Order,
  trackingNumber: string,
  shippingCompany: string = 'Canada Post Courier'
): Promise<{
  success: boolean;
  simulated: boolean;
  message: string;
}> => {
  const recipientEmail = order.customerEmail || order.email || 'customer@zezo.ca';
  const company = shippingCompany.trim() || 'Canada Post';
  const tracking = trackingNumber.trim() || 'CP-CA-PENDING';
  const subject = `تم شحن طلبك #${order.id} - رقم التتبع: ${tracking} - شركة الشحن: ${company}`;

  const templateParams = {
    to_email: recipientEmail,
    to_name: order.customerName,
    order_id: order.id,
    subject: subject,
    tracking_number: tracking,
    shipping_company: company,
    total_due: `$${(order.finalTotal ?? order.total).toFixed(2)} CAD`,
    destination: `${order.shippingAddress?.province || order.address?.province || 'Canada'}`,
    message_arabic: `يسعدنا إعلامك بأنه تم شحن طلبك #${order.id}! رقم التتبع الخاص بك هو ${tracking} عبر شركة ${company}. يرجى إبقاء هاتفك متاحاً لتواصل مندوب الشحن معك.`,
  };

  const isConfigured = Boolean(
    EMAILJS_CONFIG.publicKey && 
    EMAILJS_CONFIG.publicKey !== 'MY_EMAILJS_PUBLIC_KEY' &&
    EMAILJS_CONFIG.publicKey.length > 5
  );

  if (isConfigured) {
    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.shippingTemplateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );
      console.log('✅ [EmailJS] Shipping email sent successfully:', response.status, response.text);
      notifyEmailSent({
        type: 'shipping',
        to: recipientEmail,
        subject,
        orderId: order.id,
        trackingNumber: tracking,
        shippingCompany: company,
        simulated: false,
      });
      return {
        success: true,
        simulated: false,
        message: `Shipping notification email sent to ${recipientEmail}`,
      };
    } catch (error) {
      console.warn('⚠️ [EmailJS] Send failed, falling back to simulated dispatch:', error);
    }
  }

  // Simulation mode:
  const emailLog = `
================= 🚚 EMAIL SYSTEM: ORDER SHIPPED =================
To: ${recipientEmail}
Subject: ${subject}
Order ID: #${order.id}
Customer: ${order.customerName}
Tracking Number: ${tracking}
Shipping Carrier: ${company}
Total to Collect on Delivery (COD): $${(order.finalTotal ?? order.total).toFixed(2)} CAD
Arabic Note: تم شحن طلبك #${order.id} - رقم التتبع: ${tracking} - شركة الشحن: ${company}
==================================================================
  `;
  console.log(emailLog);

  // Notify UI
  notifyEmailSent({
    type: 'shipping',
    to: recipientEmail,
    subject,
    orderId: order.id,
    trackingNumber: tracking,
    shippingCompany: company,
    simulated: true,
  });

  return {
    success: true,
    simulated: true,
    message: `Email would be sent to: ${recipientEmail}`,
  };
};
