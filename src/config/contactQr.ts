export type ContactQrChannel = 'whatsapp' | 'wechat';

// Existing website assets. Keep the original QR pattern and quiet zones intact.
export const CONTACT_QR = {
  whatsapp: { label: 'WhatsApp', image: '/images/social/whatsapp-business-qr.jpg', width: 419, height: 435 },
  wechat: { label: 'WeChat', image: '/images/social/wechat-qr.jpg', width: 512, height: 512 },
} as const;
