export type SocialPlatform = 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'whatsapp';

export type SocialChannel = {
  platform: SocialPlatform;
  label: string;
  handle: string;
  publicUrl: string;
  accountId?: string;
  publishingMode: 'direct-when-authorized' | 'manual' | 'conversation';
};

export const SOCIAL_CHANNELS: Record<SocialPlatform, SocialChannel> = {
  linkedin: {
    platform: 'linkedin',
    label: 'LinkedIn',
    handle: 'DDNZ Global Logistics & Supply Chain',
    publicUrl: 'https://www.linkedin.com/company/ddnz-global-logistics-supply-chain/',
    accountId: '103321777',
    publishingMode: 'direct-when-authorized',
  },
  facebook: {
    platform: 'facebook',
    label: 'Facebook',
    handle: 'DDNZ Commercial Kitchen',
    publicUrl: 'https://www.facebook.com/profile.php?id=61591563495916',
    accountId: '61591563495916',
    publishingMode: 'direct-when-authorized',
  },
  instagram: {
    platform: 'instagram',
    label: 'Instagram',
    handle: '@ddnz_commercial_kitchen',
    publicUrl: 'https://www.instagram.com/ddnz_commercial_kitchen/',
    publishingMode: 'direct-when-authorized',
  },
  tiktok: {
    platform: 'tiktok',
    label: 'TikTok',
    handle: '@ddnz_kitchen_equipment',
    publicUrl: 'https://www.tiktok.com/@ddnz_kitchen_equipment',
    publishingMode: 'manual',
  },
  whatsapp: {
    platform: 'whatsapp',
    label: 'WhatsApp',
    handle: '+852 6107 7362',
    publicUrl: 'https://wa.me/85261077362',
    accountId: '85261077362',
    publishingMode: 'conversation',
  },
};

export const PUBLIC_SOCIAL_CHANNELS = Object.values(SOCIAL_CHANNELS);

export const SOCIAL_PUBLISHING_PLATFORMS = [
  'linkedin',
  'facebook',
  'instagram',
  'tiktok',
] as const;

export type SocialPublishingPlatform = typeof SOCIAL_PUBLISHING_PLATFORMS[number];
