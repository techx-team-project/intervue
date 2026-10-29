import type {
  BusinessInvoiceInfo,
  DiscountVoucher,
  PersonalInvoiceInfo,
  RecruiterCartItem,
} from '@/types/recruiter-cart';

export const INITIAL_RECRUITER_CART_ITEMS: RecruiterCartItem[] = [
  {
    id: 'cart-item-top-max',
    code: 'TOP_MAX',
    name: 'TOP MAX',
    description:
      'Boost hiring speed with prime placement in Featured Jobs, AI candidate matching, premium guarantees and priority perks.',
    unitPrice: 7500000,
    quantity: 1,
    selected: false,
  },
  {
    id: 'cart-item-top-max-plus',
    code: 'TOP_MAX_PLUS',
    name: 'TOP MAX PLUS',
    description:
      'Boost hiring speed with prime placement in Featured Jobs, 2x Top Boosts, AI candidate matching, premium guarantees and priority perks.',
    unitPrice: 9650000,
    quantity: 1,
    selected: false,
  },
];

export const DEFAULT_BUSINESS_INVOICE: BusinessInvoiceInfo = {
  taxId: '0108982345',
  companyName: 'INTERVUE TECHNOLOGY VIETNAM JSC',
  companyAddress: '12th Floor, Keangnam Landmark 72, Nam Tu Liem, Hanoi',
  recipientEmail: 'finance@intervue.vn',
};

export const DEFAULT_PERSONAL_INVOICE: PersonalInvoiceInfo = {
  fullName: 'Nguyen Minh Phuc',
  taxOrIdentityNumber: '001201029384',
  personalAddress: 'No. 18, Alley 192 Le Trong Tan, Dinh Cong, Hoang Mai, Hanoi',
  recipientEmail: 'phuc.nguyen@intervue.vn',
};

export const AVAILABLE_VOUCHERS: DiscountVoucher[] = [
  {
    code: 'INTERVUE10',
    label: '10% off total order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 5000000,
    description: 'Applicable for any recruitment package order from 5,000,000 VND.',
  },
  {
    code: 'WELCOMEHR',
    label: '500,000 VND instant voucher',
    discountType: 'fixed',
    discountValue: 500000,
    minOrderValue: 7000000,
    description: 'Welcome promotion for newly verified employer accounts on InterVue.',
  },
  {
    code: 'TOPMAX15',
    label: '15% off TOP MAX / PLUS',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 10000000,
    description: 'Special tier discount for high-priority hiring combo orders.',
  },
];
