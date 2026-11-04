import type {
  AdminBusinessVerificationDetailResource,
  AdminBusinessVerificationListResource,
  BusinessDocumentResource,
  BusinessVerificationSummaryResource,
  CompanyVerificationStatus,
  DocumentReviewStatus,
} from '@/types/recruiter-company';

export type { BusinessDocumentResource };

export interface ExtendedBusinessDocument extends BusinessDocumentResource {
  companyId?: number;
  submittedBy?: number;
  storagePublicId?: string;
}

export interface VerificationAuditLogItem {
  id: string;
  action: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'INFO_REQUESTED' | 'REVOKED';
  actorName: string;
  actorRole: string;
  timestamp: string;
  reason?: string;
  notes?: string;
}

export interface ExtendedVerificationDetail extends Omit<AdminBusinessVerificationDetailResource, 'document'> {
  document: ExtendedBusinessDocument;
  auditLogs: VerificationAuditLogItem[];
  waitingHours: number;
  isSlaOverdue: boolean;
  sampleScanUrl: string;
  totalPages?: number;
  governanceWarning?: string;
}

export interface ManagedCompanyItem {
  id: number;
  name: string;
  tradingName?: string;
  taxCode: string;
  businessType: 'ENTERPRISE' | 'HOUSEHOLD';
  industry: string;
  address: string;
  verificationStatus: CompanyVerificationStatus;
  verifiedAt?: string;
  memberCount: number;
  ownerName: string;
  ownerEmail: string;
  activeJobCount: number;
  createdAt: string;
}

// 6 Realistic Dossiers
export const INITIAL_MOCK_DOSSIERS: ExtendedVerificationDetail[] = [
  {
    document: {
      id: 1,
      companyId: 101,
      submittedBy: 11,
      documentType: 'BUSINESS_LICENSE',
      reviewStatus: 'PENDING_REVIEW',
      storagePublicId: 'sample-erc-techx',
      originalFileName: 'GPKD_TechX_Global_Signed_2026.pdf',
      fileSizeBytes: 2450000,
      contentType: 'application/pdf',
      submittedAt: '2026-11-04T09:00:00Z',
      submittedByMe: false,
    },
    company: {
      id: 101,
      name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX GLOBAL',
      tradingName: 'TechX Global Corporation',
      taxCode: '0318928391',
      businessType: 'ENTERPRISE',
      industry: 'Software Development & IT Solutions',
      address: 'Tầng 12, Keangnam Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội',
      website: 'https://techx.vn',
      verificationStatus: 'PENDING_VERIFICATION',
      verified: false,
      memberCount: 2,
    },
    submitter: {
      id: 1001,
      userId: 11,
      email: 'hoangtuan@techx.vn',
      fullName: 'Phạm Hoàng Tuấn',
      role: 'OWNER',
      status: 'ACTIVE',
      joinedAt: '2026-10-15T08:00:00Z',
      phoneVerified: true,
      userAgreementAccepted: true,
      canPublish: false,
    },
    members: [
      {
        id: 1001,
        userId: 11,
        email: 'hoangtuan@techx.vn',
        fullName: 'Phạm Hoàng Tuấn',
        role: 'OWNER',
        status: 'ACTIVE',
        joinedAt: '2026-10-15T08:00:00Z',
        phoneVerified: true,
        userAgreementAccepted: true,
        canPublish: false,
      },
      {
        id: 1002,
        userId: 12,
        email: 'recruiter.lan@techx.vn',
        fullName: 'Nguyễn Hương Lan',
        role: 'MEMBER',
        status: 'ACTIVE',
        joinedAt: '2026-10-20T09:30:00Z',
        phoneVerified: true,
        userAgreementAccepted: true,
        canPublish: false,
      },
    ],
    companyDocuments: [],
    waitingHours: 3,
    isSlaOverdue: false,
    sampleScanUrl: '/images/recruiter/illustration-erc.png',
    totalPages: 2,
    auditLogs: [
      {
        id: 'log-1',
        action: 'SUBMITTED',
        actorName: 'Phạm Hoàng Tuấn',
        actorRole: 'Company Owner',
        timestamp: '2026-11-04T09:00:00Z',
        notes: 'Submitted initial Enterprise Registration Certificate (ERC) for corporate verification.',
      },
    ],
  },
  {
    document: {
      id: 2,
      companyId: 102,
      submittedBy: 21,
      documentType: 'BUSINESS_LICENSE',
      reviewStatus: 'PENDING_REVIEW',
      storagePublicId: 'sample-erc-vng',
      originalFileName: 'DangKyKinhDoanh_VNG_Software.pdf',
      fileSizeBytes: 1850000,
      contentType: 'application/pdf',
      submittedAt: '2026-11-03T18:00:00Z',
      submittedByMe: false,
    },
    company: {
      id: 102,
      name: 'CÔNG TY TNHH PHÁT TRIỂN PHẦN MỀM VNG TECH',
      tradingName: 'VNG Tech Software Ltd.',
      taxCode: '0108392102',
      businessType: 'ENTERPRISE',
      industry: 'Game & Internet Platforms',
      address: 'Tòa nhà VNG Campus, Đường 19, KCX Tân Thuận, Quận 7, TP. Hồ Chí Minh',
      website: 'https://vng.com.vn',
      verificationStatus: 'PENDING_VERIFICATION',
      verified: false,
      memberCount: 2,
    },
    submitter: {
      id: 2001,
      userId: 21,
      email: 'bao.le@vng.com.vn',
      fullName: 'Lê Văn Bảo',
      role: 'MEMBER',
      status: 'ACTIVE',
      joinedAt: '2026-10-18T10:00:00Z',
      phoneVerified: true,
      userAgreementAccepted: true,
      canPublish: false,
    },
    members: [
      {
        id: 2000,
        userId: 20,
        email: 'director.tran@vng.com.vn',
        fullName: 'Trần Minh Đức (Tổng Giám Đốc)',
        role: 'OWNER',
        status: 'ACTIVE',
        joinedAt: '2026-10-01T08:00:00Z',
        phoneVerified: true,
        userAgreementAccepted: true,
        canPublish: true,
      },
      {
        id: 2001,
        userId: 21,
        email: 'bao.le@vng.com.vn',
        fullName: 'Lê Văn Bảo (HR Specialist)',
        role: 'MEMBER',
        status: 'ACTIVE',
        joinedAt: '2026-10-18T10:00:00Z',
        phoneVerified: true,
        userAgreementAccepted: true,
        canPublish: false,
      },
    ],
    companyDocuments: [],
    waitingHours: 18,
    isSlaOverdue: false,
    sampleScanUrl: '/images/recruiter/illustration-erc.png',
    totalPages: 3,
    governanceWarning:
      'The submitter is registered as a MEMBER, but submitted an Enterprise Registration Certificate (ERC). Platform policy restricts ERC submissions to company OWNERs. Members must submit a signed Letter of Authorization (LOA).',
    auditLogs: [
      {
        id: 'log-2',
        action: 'SUBMITTED',
        actorName: 'Lê Văn Bảo',
        actorRole: 'HR Member',
        timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        notes: 'Submitted business credentials.',
      },
    ],
  },
  {
    document: {
      id: 3,
      companyId: 103,
      submittedBy: 31,
      documentType: 'LETTER_OF_AUTHORIZATION',
      reviewStatus: 'PENDING_REVIEW',
      storagePublicId: 'sample-loa-fpt',
      originalFileName: 'GiayUyQuyen_FPT_TranThiThuThao_Signed.pdf',
      fileSizeBytes: 3200000,
      contentType: 'application/pdf',
      submittedAt: '2026-11-03T08:00:00Z', // 28 hours ago -> Overdue!
      submittedByMe: false,
    },
    company: {
      id: 103,
      name: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN ĐẦU TƯ FPT SOFTWARE',
      tradingName: 'FPT Software Corporation',
      taxCode: '0101248141',
      businessType: 'ENTERPRISE',
      industry: 'IT Services & Digital Transformation',
      address: 'FPT Tower, Số 10 Phạm Văn Bạch, Dịch Vọng, Q. Cầu Giấy, Hà Nội',
      website: 'https://fptsoftware.com',
      verificationStatus: 'PENDING_VERIFICATION',
      verified: false,
      memberCount: 2,
    },
    submitter: {
      id: 3001,
      userId: 31,
      email: 'thao.ttt@fpt.com',
      fullName: 'Trần Thị Thu Thảo',
      role: 'MEMBER',
      status: 'ACTIVE',
      joinedAt: '2026-10-12T07:45:00Z',
      phoneVerified: true,
      userAgreementAccepted: true,
      canPublish: false,
    },
    members: [
      {
        id: 3000,
        userId: 30,
        email: 'khoa.nv@fpt.com',
        fullName: 'Nguyễn Văn Khoa',
        role: 'OWNER',
        status: 'ACTIVE',
        joinedAt: '2026-09-01T08:00:00Z',
        phoneVerified: true,
        userAgreementAccepted: true,
        canPublish: true,
      },
      {
        id: 3001,
        userId: 31,
        email: 'thao.ttt@fpt.com',
        fullName: 'Trần Thị Thu Thảo (TA Lead)',
        role: 'MEMBER',
        status: 'ACTIVE',
        joinedAt: '2026-10-12T07:45:00Z',
        phoneVerified: true,
        userAgreementAccepted: true,
        canPublish: false,
      },
    ],
    companyDocuments: [],
    waitingHours: 28,
    isSlaOverdue: true,
    sampleScanUrl: '/images/recruiter/illustration-loa.png',
    totalPages: 2,
    auditLogs: [
      {
        id: 'log-3',
        action: 'SUBMITTED',
        actorName: 'Trần Thị Thu Thảo',
        actorRole: 'Talent Acquisition Lead',
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        notes: 'Submitted Letter of Authorization signed by CEO Nguyen Van Khoa with official company red stamp.',
      },
    ],
  },
  {
    document: {
      id: 4,
      companyId: 104,
      submittedBy: 41,
      documentType: 'LETTER_OF_AUTHORIZATION',
      reviewStatus: 'MORE_INFO_REQUIRED',
      storagePublicId: 'sample-loa-viettel',
      originalFileName: 'LOA_Viettel_AI_Solutions.pdf',
      fileSizeBytes: 4100000,
      contentType: 'application/pdf',
      submittedAt: '2026-11-01T11:00:00Z',
      reviewedAt: '2026-11-02T09:15:00Z',
      reviewReason:
        'Document scan has excessive glare over the corporate stamp; director signature is unreadable. Please upload a clear PDF scan along with the authorized representative’s National Citizen ID (CCCD).',
      submittedByMe: false,
    },
    company: {
      id: 104,
      name: 'CÔNG TY TNHH GIẢI PHÁP SỐ VIETTEL AI',
      tradingName: 'Viettel AI Solutions',
      taxCode: '0100109106',
      businessType: 'ENTERPRISE',
      industry: 'Artificial Intelligence & Cloud Computing',
      address: 'Số 1 Giang Văn Minh, Phường Kim Mã, Quận Ba Đình, Hà Nội',
      website: 'https://viettel.vn',
      verificationStatus: 'PENDING_VERIFICATION',
      verified: false,
      memberCount: 1,
    },
    submitter: {
      id: 4001,
      userId: 41,
      email: 'quan.nm@viettel.com.vn',
      fullName: 'Nguyễn Minh Quân',
      role: 'MEMBER',
      status: 'ACTIVE',
      joinedAt: '2026-10-25T14:20:00Z',
      phoneVerified: false,
      userAgreementAccepted: true,
      canPublish: false,
    },
    members: [
      {
        id: 4001,
        userId: 41,
        email: 'quan.nm@viettel.com.vn',
        fullName: 'Nguyễn Minh Quân',
        role: 'MEMBER',
        status: 'ACTIVE',
        joinedAt: '2026-10-25T14:20:00Z',
        phoneVerified: false,
        userAgreementAccepted: true,
        canPublish: false,
      },
    ],
    companyDocuments: [],
    waitingHours: 48,
    isSlaOverdue: false,
    sampleScanUrl: '/images/recruiter/illustration-loa.png',
    totalPages: 2,
    auditLogs: [
      {
        id: 'log-4a',
        action: 'SUBMITTED',
        actorName: 'Nguyễn Minh Quân',
        actorRole: 'HR Member',
        timestamp: '2026-11-01T11:00:00Z',
        notes: 'Submitted LOA document.',
      },
      {
        id: 'log-4b',
        action: 'INFO_REQUESTED',
        actorName: 'Admin Sarah Nguyen',
        actorRole: 'Compliance Officer',
        timestamp: '2026-11-02T09:15:00Z',
        reason: 'Document scan has glare over seal; requested higher resolution original PDF scan.',
      },
    ],
  },
  {
    document: {
      id: 5,
      companyId: 105,
      submittedBy: 51,
      documentType: 'BUSINESS_LICENSE',
      reviewStatus: 'APPROVED',
      storagePublicId: 'sample-erc-mobifone',
      originalFileName: 'GiayPhepKinhDoanh_MobiFoneGlobal_Official.pdf',
      fileSizeBytes: 2100000,
      contentType: 'application/pdf',
      submittedAt: '2026-10-28T08:30:00Z',
      reviewedAt: '2026-10-29T10:00:00Z',
      expiresAt: '2030-01-01T00:00:00Z',
      submittedByMe: false,
    },
    company: {
      id: 105,
      name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ MOBIFONE GLOBAL',
      tradingName: 'MobiFone Global Technology',
      taxCode: '0102692912',
      businessType: 'ENTERPRISE',
      industry: 'Telecommunications & Cloud Networking',
      address: 'Tòa nhà MobiFone, Lô VP1, Phường Yên Hòa, Quận Cầu Giấy, Hà Nội',
      website: 'https://mobifoneglobal.vn',
      verificationStatus: 'VERIFIED',
      verified: true,
      memberCount: 1,
    },
    submitter: {
      id: 5001,
      userId: 51,
      email: 'thang.vd@mobifone.vn',
      fullName: 'Vũ Đức Thắng',
      role: 'OWNER',
      status: 'ACTIVE',
      joinedAt: '2026-10-20T08:00:00Z',
      phoneVerified: true,
      userAgreementAccepted: true,
      canPublish: true,
    },
    members: [
      {
        id: 5001,
        userId: 51,
        email: 'thang.vd@mobifone.vn',
        fullName: 'Vũ Đức Thắng',
        role: 'OWNER',
        status: 'ACTIVE',
        joinedAt: '2026-10-20T08:00:00Z',
        phoneVerified: true,
        userAgreementAccepted: true,
        canPublish: true,
      },
    ],
    companyDocuments: [],
    waitingHours: 0,
    isSlaOverdue: false,
    sampleScanUrl: '/images/recruiter/illustration-erc.png',
    totalPages: 4,
    auditLogs: [
      {
        id: 'log-5a',
        action: 'SUBMITTED',
        actorName: 'Vũ Đức Thắng',
        actorRole: 'Company Owner',
        timestamp: '2026-10-28T08:30:00Z',
        notes: 'Submitted ERC.',
      },
      {
        id: 'log-5b',
        action: 'APPROVED',
        actorName: 'Admin Alex Tran',
        actorRole: 'Compliance Lead',
        timestamp: '2026-10-29T10:00:00Z',
        notes: 'Verified corporate registration with National Business Portal. Granted recruitment publishing rights.',
      },
    ],
  },
  {
    document: {
      id: 6,
      companyId: 106,
      submittedBy: 61,
      documentType: 'LETTER_OF_AUTHORIZATION',
      reviewStatus: 'APPROVED',
      storagePublicId: 'sample-loa-ssi',
      originalFileName: 'UyQuyenTuyenDung_SSI_Securities_2025.pdf',
      fileSizeBytes: 2900000,
      contentType: 'application/pdf',
      submittedAt: '2025-11-10T09:00:00Z',
      reviewedAt: '2025-11-11T14:00:00Z',
      expiresAt: '2026-11-09T12:00:00Z', // Expires in 5 days!
      submittedByMe: false,
    },
    company: {
      id: 106,
      name: 'CÔNG TY CỔ PHẦN CHỨNG KHOÁN SSI',
      tradingName: 'SSI Securities Corporation',
      taxCode: '0301955130',
      businessType: 'ENTERPRISE',
      industry: 'Financial Services & FinTech',
      address: '72 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      website: 'https://ssi.com.vn',
      verificationStatus: 'VERIFIED',
      verified: true,
      memberCount: 2,
    },
    submitter: {
      id: 6001,
      userId: 61,
      email: 'nam.dh@ssi.com.vn',
      fullName: 'Đặng Hoàng Nam',
      role: 'MEMBER',
      status: 'ACTIVE',
      joinedAt: '2025-11-05T08:00:00Z',
      phoneVerified: true,
      userAgreementAccepted: true,
      canPublish: true,
    },
    members: [
      {
        id: 6001,
        userId: 61,
        email: 'nam.dh@ssi.com.vn',
        fullName: 'Đặng Hoàng Nam',
        role: 'MEMBER',
        status: 'ACTIVE',
        joinedAt: '2025-11-05T08:00:00Z',
        phoneVerified: true,
        userAgreementAccepted: true,
        canPublish: true,
      },
    ],
    companyDocuments: [],
    waitingHours: 0,
    isSlaOverdue: false,
    sampleScanUrl: '/images/recruiter/illustration-loa.png',
    totalPages: 2,
    auditLogs: [
      {
        id: 'log-6a',
        action: 'SUBMITTED',
        actorName: 'Đặng Hoàng Nam',
        actorRole: 'Talent Acquisition Lead',
        timestamp: '2025-11-10T09:00:00Z',
      },
      {
        id: 'log-6b',
        action: 'APPROVED',
        actorName: 'Admin Sarah Nguyen',
        actorRole: 'Compliance Officer',
        timestamp: '2025-11-11T14:00:00Z',
        notes: 'Approved for 1 year period.',
      },
    ],
  },
];

export const INITIAL_MOCK_COMPANIES: ManagedCompanyItem[] = [
  {
    id: 101,
    name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX GLOBAL',
    tradingName: 'TechX Global',
    taxCode: '0318928391',
    businessType: 'ENTERPRISE',
    industry: 'Software & IT Solutions',
    address: 'Tầng 12, Keangnam Landmark 72, Nam Từ Liêm, Hà Nội',
    verificationStatus: 'PENDING_VERIFICATION',
    memberCount: 2,
    ownerName: 'Phạm Hoàng Tuấn',
    ownerEmail: 'hoangtuan@techx.vn',
    activeJobCount: 4,
    createdAt: '2026-10-15',
  },
  {
    id: 102,
    name: 'CÔNG TY TNHH PHÁT TRIỂN PHẦN MỀM VNG TECH',
    tradingName: 'VNG Tech',
    taxCode: '0108392102',
    businessType: 'ENTERPRISE',
    industry: 'Game & Internet Platforms',
    address: 'VNG Campus, KCX Tân Thuận, Quận 7, TP. HCM',
    verificationStatus: 'PENDING_VERIFICATION',
    memberCount: 5,
    ownerName: 'Trần Minh Đức',
    ownerEmail: 'director.tran@vng.com.vn',
    activeJobCount: 12,
    createdAt: '2026-10-01',
  },
  {
    id: 103,
    name: 'CÔNG TY CỔ PHẦN TẬP ĐOÀN ĐẦU TƯ FPT SOFTWARE',
    tradingName: 'FPT Software',
    taxCode: '0101248141',
    businessType: 'ENTERPRISE',
    industry: 'IT Services & Digital Transformation',
    address: 'FPT Tower, 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
    verificationStatus: 'PENDING_VERIFICATION',
    memberCount: 14,
    ownerName: 'Nguyễn Văn Khoa',
    ownerEmail: 'khoa.nv@fpt.com',
    activeJobCount: 38,
    createdAt: '2026-09-01',
  },
  {
    id: 104,
    name: 'CÔNG TY TNHH GIẢI PHÁP SỐ VIETTEL AI',
    tradingName: 'Viettel AI Solutions',
    taxCode: '0100109106',
    businessType: 'ENTERPRISE',
    industry: 'AI & Cloud Computing',
    address: 'Số 1 Giang Văn Minh, Ba Đình, Hà Nội',
    verificationStatus: 'PENDING_VERIFICATION',
    memberCount: 3,
    ownerName: 'Nguyễn Minh Quân',
    ownerEmail: 'quan.nm@viettel.com.vn',
    activeJobCount: 2,
    createdAt: '2026-10-25',
  },
  {
    id: 105,
    name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ MOBIFONE GLOBAL',
    tradingName: 'MobiFone Global',
    taxCode: '0102692912',
    businessType: 'ENTERPRISE',
    industry: 'Telecommunications',
    address: 'Tòa nhà MobiFone, Lô VP1, Cầu Giấy, Hà Nội',
    verificationStatus: 'VERIFIED',
    verifiedAt: '2026-10-29',
    memberCount: 8,
    ownerName: 'Vũ Đức Thắng',
    ownerEmail: 'thang.vd@mobifone.vn',
    activeJobCount: 15,
    createdAt: '2026-10-20',
  },
  {
    id: 106,
    name: 'CÔNG TY CỔ PHẦN CHỨNG KHOÁN SSI',
    tradingName: 'SSI Securities',
    taxCode: '0301955130',
    businessType: 'ENTERPRISE',
    industry: 'Financial Services & FinTech',
    address: '72 Nguyễn Huệ, Bến Nghé, Quận 1, TP. HCM',
    verificationStatus: 'VERIFIED',
    verifiedAt: '2025-11-11',
    memberCount: 12,
    ownerName: 'Đặng Hoàng Nam',
    ownerEmail: 'nam.dh@ssi.com.vn',
    activeJobCount: 9,
    createdAt: '2025-11-05',
  },
];

// Helper to convert detail to list item
export function detailToListResource(detail: ExtendedVerificationDetail): AdminBusinessVerificationListResource {
  return {
    id: detail.document.id,
    documentType: detail.document.documentType,
    reviewStatus: detail.document.reviewStatus,
    originalFileName: detail.document.originalFileName,
    submittedAt: detail.document.submittedAt,
    reviewedAt: detail.document.reviewedAt,
    expiresAt: detail.document.expiresAt,
    companyId: detail.company.id,
    companyName: detail.company.name,
    companyTaxCode: detail.company.taxCode,
    companyVerificationStatus: detail.company.verificationStatus,
    submittedByUserId: detail.submitter.userId,
    submittedByName: detail.submitter.fullName,
    submittedByEmail: detail.submitter.email,
  };
}

export const MOCK_SYSTEM_NOW_MS = new Date('2026-11-04T12:00:00Z').getTime();

export function isDocumentExpiringWithinDays(
  expiresAt?: string,
  reviewStatus?: DocumentReviewStatus,
  days = 30,
): boolean {
  if (!expiresAt || reviewStatus !== 'APPROVED') return false;
  const expTime = new Date(expiresAt).getTime();
  const windowMs = days * 24 * 3600 * 1000;
  return expTime > MOCK_SYSTEM_NOW_MS && expTime - MOCK_SYSTEM_NOW_MS <= windowMs;
}

// Compute summary stats from dossiers
export function computeSummaryFromDossiers(
  dossiers: ExtendedVerificationDetail[],
): BusinessVerificationSummaryResource & {
  slaOverdueCount: number;
  expiringSoonCount: number;
} {
  let pending = 0;
  let infoReq = 0;
  let approved = 0;
  let rejected = 0;
  let revoked = 0;
  let expired = 0;
  let slaOverdue = 0;
  let expiringSoon = 0;

  for (const d of dossiers) {
    if (d.document.reviewStatus === 'PENDING_REVIEW') {
      pending++;
      if (d.isSlaOverdue) slaOverdue++;
    } else if (d.document.reviewStatus === 'MORE_INFO_REQUIRED') {
      infoReq++;
    } else if (d.document.reviewStatus === 'APPROVED') {
      approved++;
      if (isDocumentExpiringWithinDays(d.document.expiresAt, d.document.reviewStatus, 30)) {
        expiringSoon++;
      } else if (d.document.expiresAt && new Date(d.document.expiresAt).getTime() <= MOCK_SYSTEM_NOW_MS) {
        expired++;
      }
    } else if (d.document.reviewStatus === 'REJECTED') {
      rejected++;
    } else if (d.document.reviewStatus === 'REVOKED') {
      revoked++;
    }
  }

  return {
    total: dossiers.length,
    pendingReview: pending,
    moreInfoRequired: infoReq,
    approved,
    rejected,
    revoked,
    expired,
    slaOverdueCount: slaOverdue,
    expiringSoonCount: expiringSoon,
  };
}

const STORAGE_KEY_DOSSIERS = 'intervue_admin_mock_dossiers_v2';
const STORAGE_KEY_COMPANIES = 'intervue_admin_mock_companies_v2';
const EVENT_NAME = 'intervue_admin_mock_data_changed';

export function getStoredDossiers(): ExtendedVerificationDetail[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_DOSSIERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DOSSIERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DOSSIERS, JSON.stringify(INITIAL_MOCK_DOSSIERS));
      return INITIAL_MOCK_DOSSIERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_DOSSIERS;
  }
}

export function getStoredCompanies(): ManagedCompanyItem[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_COMPANIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPANIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(INITIAL_MOCK_COMPANIES));
      return INITIAL_MOCK_COMPANIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_COMPANIES;
  }
}

export function saveStoredDossiers(dossiers: ExtendedVerificationDetail[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_DOSSIERS, JSON.stringify(dossiers));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // ignore
  }
}

export function saveStoredCompanies(companies: ManagedCompanyItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(companies));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // ignore
  }
}

export function resetMockStorage(): { dossiers: ExtendedVerificationDetail[]; companies: ManagedCompanyItem[] } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_DOSSIERS, JSON.stringify(INITIAL_MOCK_DOSSIERS));
    localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(INITIAL_MOCK_COMPANIES));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
  return { dossiers: INITIAL_MOCK_DOSSIERS, companies: INITIAL_MOCK_COMPANIES };
}

export function updateDossierInStore(
  documentId: number,
  action: 'APPROVE' | 'REJECT' | 'REQUEST_INFO' | 'REVOKE',
  payload: {
    expiresAt?: string;
    reason?: string;
    notes?: string;
    actorName?: string;
  },
): ExtendedVerificationDetail | null {
  const dossiers = getStoredDossiers();
  const companies = getStoredCompanies();
  const index = dossiers.findIndex((d) => d.document.id === documentId);
  if (index === -1) return null;

  const current = dossiers[index];
  const nowIso = new Date().toISOString();
  const actor = payload.actorName || 'Admin Hoang Tuan (Senior Compliance)';

  let nextReviewStatus: DocumentReviewStatus = current.document.reviewStatus;
  let nextCompanyStatus: CompanyVerificationStatus = current.company.verificationStatus;
  let logAction: VerificationAuditLogItem['action'] = 'SUBMITTED';
  let canPublish = current.submitter.canPublish;

  if (action === 'APPROVE') {
    nextReviewStatus = 'APPROVED';
    nextCompanyStatus = 'VERIFIED';
    logAction = 'APPROVED';
    canPublish = true;
  } else if (action === 'REJECT') {
    nextReviewStatus = 'REJECTED';
    nextCompanyStatus = 'REJECTED';
    logAction = 'REJECTED';
    canPublish = false;
  } else if (action === 'REQUEST_INFO') {
    nextReviewStatus = 'MORE_INFO_REQUIRED';
    nextCompanyStatus = 'PENDING_VERIFICATION';
    logAction = 'INFO_REQUESTED';
    canPublish = false;
  } else if (action === 'REVOKE') {
    nextReviewStatus = 'REVOKED';
    nextCompanyStatus = 'PENDING_VERIFICATION';
    logAction = 'REVOKED';
    canPublish = false;
  }

  const newLog: VerificationAuditLogItem = {
    id: `log-${Date.now()}`,
    action: logAction,
    actorName: actor,
    actorRole: 'Senior Compliance Officer',
    timestamp: nowIso,
    reason: payload.reason,
    notes:
      payload.notes ||
      (action === 'APPROVE' ? `Approved with validity until ${payload.expiresAt || 'Indefinite'}.` : payload.reason),
  };

  const updatedDossier: ExtendedVerificationDetail = {
    ...current,
    document: {
      ...current.document,
      reviewStatus: nextReviewStatus,
      reviewedAt: nowIso,
      expiresAt: payload.expiresAt || current.document.expiresAt,
      reviewReason: payload.reason || current.document.reviewReason,
    },
    company: {
      ...current.company,
      verificationStatus: nextCompanyStatus,
      verified: nextCompanyStatus === 'VERIFIED',
    },
    submitter: {
      ...current.submitter,
      canPublish,
    },
    members: current.members.map((m) => (m.userId === current.submitter.userId ? { ...m, canPublish } : m)),
    auditLogs: [newLog, ...(current.auditLogs || [])],
  };

  dossiers[index] = updatedDossier;
  saveStoredDossiers(dossiers);

  // Also sync the managed company list if companyId matches
  const compIndex = companies.findIndex((c) => c.id === current.company.id);
  if (compIndex !== -1) {
    companies[compIndex] = {
      ...companies[compIndex],
      verificationStatus: nextCompanyStatus,
      verifiedAt: nextCompanyStatus === 'VERIFIED' ? nowIso.split('T')[0] : companies[compIndex].verifiedAt,
    };
    saveStoredCompanies(companies);
  }

  return updatedDossier;
}
