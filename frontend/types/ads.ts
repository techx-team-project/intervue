export type AdBookingStatus = 'RESERVED' | 'BOOKED' | 'RELEASED';
export type AdCreativeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdSlot {
  id: number;
  code: string;
  name: string;
  placement: string;
  description: string | null;
  width: number;
  height: number;
  pricePerWeek: number;
  packageSlug: string | null;
  houseImageUrl: string | null;
  houseTargetUrl: string | null;
  displayOrder: number;
  active: boolean;
}

export interface AdWeek {
  weekStart: string;
  weekEnd: string;
  available: boolean;
  mine: boolean;
}

export interface AdSlotCalendar {
  slot: AdSlot;
  weeks: AdWeek[];
}

export interface AdBooking {
  id: number;
  slotCode: string | null;
  slotName: string | null;
  width: number | null;
  height: number | null;
  weekStart: string;
  weekEnd: string;
  status: AdBookingStatus;
  running: boolean;
  creativeStatus: AdCreativeStatus | null;
  creativeImageUrl: string | null;
  creativeTargetUrl: string | null;
  rejectionReason: string | null;
  impressions: number;
  clicks: number;
}

export interface ServedAd {
  slotCode: string;
  width: number;
  height: number;
  imageUrl: string;
  targetUrl: string | null;
  altText: string | null;
  house: boolean;
  bookingId: number | null;
}

export interface AdminAdCreative {
  id: number;
  bookingId: number;
  slotCode: string | null;
  slotName: string | null;
  width: number | null;
  height: number | null;
  companyId: number | null;
  weekStart: string | null;
  weekEnd: string | null;
  imageUrl: string;
  targetUrl: string;
  altText: string | null;
  status: AdCreativeStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface SaveAdSlotInput {
  name: string;
  description?: string | null;
  pricePerWeek: number;
  houseImageUrl?: string | null;
  houseTargetUrl?: string | null;
  active: boolean;
  displayOrder: number;
}

export interface CreateAdSlotInput {
  code: string;
  name: string;
  placement: 'HOME' | 'JOBS';
  description?: string | null;
  width: number;
  height: number;
  pricePerWeek: number;
  servicePackageId?: number | null;
  houseImageUrl?: string | null;
  houseTargetUrl?: string | null;
  active: boolean;
  displayOrder: number;
}
