export interface AvailableVoucher {
  id: string;
  type: 'premium' | 'education' | 'pro' | 'course';
  packageId: string;
  packageName: string;
  code: string;
  expiryDate: string;
  receivedDate: string;
  tagColor: string;
  tagBg: string;
  titleColor: string;
  badgeLabel: string;
  description: string;
}

export interface GiftFaqItem {
  q: string;
  a: string;
}

export interface GiftActivationResult {
  packageName: string;
  code: string;
  expiryText: string;
}
