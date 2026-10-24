import type {
  BusinessDocumentType,
  CompanyDetailData,
  RecruiterVerificationProfile,
  VerificationLevelNumber,
} from '@/types/recruiter-company';

export const MOCK_AVAILABLE_COMPANIES: CompanyDetailData[] = [
  {
    id: 'comp-fpt',
    businessType: 'ENTERPRISE',
    name: 'CÔNG TY TNHH PHẦN MỀM FPT (FPT SOFTWARE)',
    tradingName: 'FPT Software',
    taxCode: '0101778163',
    industry: 'Công nghệ thông tin / Phần mềm',
    website: 'https://fpt-software.com',
    market: 'Toàn cầu (Global)',
    targetCustomers: 'Doanh nghiệp (B2B)',
    size: '1000+ nhân sự',
    email: 'recruitment@fpt.com',
    phoneNumber: '024 7300 7300',
    address: 'Tòa nhà FPT, Phố Duy Tân, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    description:
      'FPT Software là công ty công nghệ và chuyển đổi số hàng đầu Việt Nam và khu vực, cung cấp dịch vụ công nghệ cho hơn 1.000 khách hàng toàn cầu.',
    benefits:
      '• Thưởng tháng 13 + thưởng hiệu quả kinh doanh\n• Gói bảo hiểm sức khỏe cao cấp FPT Care\n• Cơ hội làm việc onsite tại Nhật Bản, Mỹ, Đức, Singapore',
    logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'comp-viettel',
    businessType: 'ENTERPRISE',
    name: 'TẬP ĐOÀN CÔNG NGHIỆP - VIỄN THÔNG QUÂN ĐỘI (VIETTEL)',
    tradingName: 'Viettel Group',
    taxCode: '0100109106',
    industry: 'Viễn thông & Công nghệ số',
    website: 'https://viettel.com.vn',
    market: 'Toàn quốc & Quốc tế',
    targetCustomers: 'B2B & B2C',
    size: '1000+ nhân sự',
    email: 'tuyendung@viettel.com.vn',
    phoneNumber: '024 6255 6789',
    address: 'Số 01 Trần Hữu Dực, Mỹ Đình 2, Nam Từ Liêm, Hà Nội',
    description:
      'Tập đoàn công nghệ viễn thông hàng đầu Việt Nam, kiến tạo xã hội số với hạ tầng mạng lưới và các giải pháp số tiên tiến.',
    benefits:
      '• Lương thưởng cạnh tranh top đầu ngành viễn thông\n• Môi trường kỷ luật, thách thức và phát triển vượt bậc\n• Đào tạo thạc sĩ/chứng chỉ quốc tế do tập đoàn tài trợ',
    logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80',
    photos: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80'],
  },
  {
    id: 'comp-vng',
    businessType: 'ENTERPRISE',
    name: 'CÔNG TY CỔ PHẦN VNG',
    tradingName: 'VNG Corporation',
    taxCode: '0303565011',
    industry: 'Internet & Trò chơi trực tuyến',
    website: 'https://vng.com.vn',
    market: 'Đông Nam Á',
    targetCustomers: 'Người tiêu dùng (B2C)',
    size: '1000+ nhân sự',
    email: 'careers@vng.com.vn',
    phoneNumber: '028 3962 3888',
    address: 'Z06 Đường số 13, Khu chế xuất Tân Thuận, Quận 7, TP. Hồ Chí Minh',
    description: 'Kỳ lân công nghệ đầu tiên tại Việt Nam, sở hữu hệ sinh thái Zalo, VNGGames, ZaloPay và VNG Cloud.',
    benefits:
      '• Văn phòng VNG Campus chuẩn quốc tế, hồ bơi, phòng gym miễn phí\n• Bữa ăn sáng và trưa dinh dưỡng tại căng tin công ty\n• Thưởng cổ phần ESOP và đánh giá tăng lương 2 lần/năm',
    logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    photos: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80'],
  },
  {
    id: 'comp-misa',
    businessType: 'ENTERPRISE',
    name: 'CÔNG TY CỔ PHẦN MISA',
    tradingName: 'MISA JSC',
    taxCode: '0101243150',
    industry: 'Phần mềm kế toán & Quản trị doanh nghiệp',
    website: 'https://misa.vn',
    market: 'Toàn quốc',
    targetCustomers: 'Doanh nghiệp & Hộ kinh doanh',
    size: '500-999 nhân sự',
    email: 'hr@misa.com.vn',
    phoneNumber: '024 3795 9595',
    address: 'Tầng 9, Tòa nhà Technosoft, Phố Duy Tân, Cầu Giấy, Hà Nội',
    description:
      'Doanh nghiệp tiên phong phát triển phần mềm quản lý tài chính kế toán và chuyển đổi số cho hàng trăm nghìn tổ chức.',
    benefits:
      '• Lương tháng 13 + thưởng doanh số hấp dẫn\n• Chế độ du lịch hàng năm, teambuilding sôi nổi\n• Lộ trình thăng tiến rõ ràng theo cấp bậc chuyên môn',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
    photos: [],
  },
  {
    id: 'comp-pickle',
    businessType: 'ENTERPRISE',
    name: 'CÔNG TY TNHH PICKLE LAB VIỆT NAM',
    tradingName: 'Pickle Lab Vietnam',
    taxCode: '0111533349',
    industry: 'Công nghệ thông tin & Dịch vụ phần mềm',
    website: 'https://picklelab.io',
    market: 'Quốc tế',
    targetCustomers: 'Khách hàng toàn cầu (B2B)',
    size: '10-24 nhân sự',
    email: 'hello@picklelab.io',
    phoneNumber: '0988 123 456',
    address: '129D Nguyễn Trãi, Phường Khương Trung, Quận Thanh Xuân, Hà Nội',
    description: 'Studio phát triển sản phẩm phần mềm hiện đại, chuyên sâu về AI Automation và nền tảng đám mây.',
    benefits:
      '• Môi trường startup linh hoạt, hybrid working\n• Thiết bị làm việc Macbook Pro M3\n• Thưởng dự án theo từng quý',
    logoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&auto=format&fit=crop&q=80',
    photos: [],
  },
];

const INITIAL_VERIFICATION_PROFILE: RecruiterVerificationProfile = {
  level: 1,
  levelLabel: 'Cấp 1/3: Tài khoản cơ bản',
  completionPercent: 0,
  stepsCompleted: 0,
  stepsTotal: 5,
  recruiterName: 'Nguyễn Minh Phúc',
  recruiterEmail: 'candidate.recruiter@intervue.test',
  recruiterCode: '838025',
  updatedAt: new Date().toISOString(),
  nextStepLabel: 'Xác thực số điện thoại',
  company: {
    id: 'comp-techx',
    name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX GLOBAL',
    taxCode: '0318928391',
    address: 'Tầng 12, Keangnam Landmark 72, Phạm Hùng, Cầu Giấy, Hà Nội',
    industry: 'Công nghệ thông tin / Phần mềm',
    size: '100-499 nhân sự',
    isCompleted: false,
    logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
  },
  phone: {
    phoneNumber: '',
    isVerified: false,
  },
  license: {
    status: 'NOT_SUBMITTED',
  },
  candidateAgreement: {
    type: 'STANDARD_TEMPLATE',
    status: 'NOT_SUBMITTED',
  },
  platformAgreement: {
    isAgreed: false,
    version: 'v2.1',
  },
  checklist: [
    {
      id: 'phone',
      order: 1,
      title: 'Xác thực số điện thoại',
      description: 'Gia tăng tính bảo mật cho tài khoản nhà tuyển dụng qua xác thực OTP số điện thoại.',
      status: 'not_started',
      badgeLabel: 'Bảo mật tài khoản',
      actionLabel: 'Xác thực ngay',
    },
    {
      id: 'company',
      order: 2,
      title: 'Cập nhật thông tin công ty',
      description: 'Liên kết thông tin doanh nghiệp, mã số thuế và trụ sở chính xác thực.',
      status: 'not_started',
      badgeLabel: 'Hồ sơ doanh nghiệp',
      actionLabel: 'Cập nhật',
    },
    {
      id: 'license',
      order: 3,
      title: 'Cập nhật Giấy đăng ký doanh nghiệp',
      description: 'Đăng tải Giấy phép ĐKKD hoặc Giấy ủy quyền để xác thực pháp nhân tuyển dụng.',
      status: 'not_started',
      badgeLabel: 'Pháp lý',
      actionLabel: 'Đăng tải tài liệu',
    },
    {
      id: 'candidate_agreement',
      order: 4,
      title: 'Cập nhật Thỏa thuận xử lý DLCN với ứng viên',
      description: 'Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân của ứng viên nộp CV.',
      status: 'not_started',
      badgeLabel: 'Dữ liệu cá nhân',
      actionLabel: 'Xem thỏa thuận',
    },
    {
      id: 'platform_agreement',
      order: 5,
      title: 'Đồng ý Thỏa thuận xử lý DLCN với InterVue',
      description: 'Xác nhận điều khoản trao đổi dữ liệu tuyển dụng minh bạch với nền tảng InterVue.',
      status: 'not_started',
      badgeLabel: 'Điều khoản nền tảng',
      actionLabel: 'Xác nhận ngay',
    },
  ],
};

const INITIAL_COMPANY_DETAIL: CompanyDetailData = {
  id: 'comp-techx',
  businessType: 'ENTERPRISE',
  name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TECHX GLOBAL',
  tradingName: 'TechX Global',
  taxCode: '0318928391',
  industry: 'Công nghệ thông tin / Phần mềm',
  website: 'https://techx.io',
  market: 'Toàn quốc & Quốc tế',
  targetCustomers: 'Doanh nghiệp (B2B)',
  size: '100-499 nhân sự',
  email: 'hr@techx.io',
  phoneNumber: '024 3999 8888',
  address: 'Tầng 12, Keangnam Landmark 72, Phạm Hùng, Cầu Giấy, Hà Nội',
  description:
    'TechX Global là công ty công nghệ tiên phong phát triển các nền tảng AI và giải pháp số thông minh cho doanh nghiệp hàng đầu.',
  benefits:
    '• Lương tháng 13 + thưởng dự án theo KPIs\n• Bảo hiểm sức khỏe VIP cho nhân viên và người thân\n• Teambuilding hàng năm tại resort cao cấp',
  logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
  photos: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
  ],
};

const STORAGE_KEY_PROFILE = 'intervue_recruiter_profile_v2';
const STORAGE_KEY_COMPANY = 'intervue_recruiter_company_detail_v2';

function loadStoredProfile(): RecruiterVerificationProfile {
  if (typeof window === 'undefined') {
    return JSON.parse(JSON.stringify(INITIAL_VERIFICATION_PROFILE));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load verification profile from localStorage', e);
  }
  return JSON.parse(JSON.stringify(INITIAL_VERIFICATION_PROFILE));
}

function saveStoredProfile(profile: RecruiterVerificationProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save verification profile to localStorage', e);
  }
}

function loadStoredCompany(): CompanyDetailData {
  if (typeof window === 'undefined') {
    return JSON.parse(JSON.stringify(INITIAL_COMPANY_DETAIL));
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPANY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load company detail from localStorage', e);
  }
  return JSON.parse(JSON.stringify(INITIAL_COMPANY_DETAIL));
}

function saveStoredCompany(data: CompanyDetailData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_COMPANY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save company detail to localStorage', e);
  }
}

let inMemoryProfile: RecruiterVerificationProfile = loadStoredProfile();
let inMemoryCompany: CompanyDetailData = loadStoredCompany();

function recalculateProfile(profile: RecruiterVerificationProfile): RecruiterVerificationProfile {
  let completed = 0;

  // 1. Phone
  const phoneItem = profile.checklist.find((i) => i.id === 'phone');
  if (profile.phone.isVerified) {
    completed++;
    if (phoneItem) {
      phoneItem.status = 'approved';
      phoneItem.actionLabel = 'Đã xác thực';
      phoneItem.completedAt = profile.phone.verifiedAt || 'Hôm nay';
    }
  } else if (phoneItem) {
    phoneItem.status = 'not_started';
    phoneItem.actionLabel = 'Xác thực ngay';
  }

  // 2. Company
  const compItem = profile.checklist.find((i) => i.id === 'company');
  if (profile.company.isCompleted) {
    completed++;
    if (compItem) {
      compItem.status = 'approved';
      compItem.actionLabel = 'Đã cập nhật';
      compItem.completedAt = 'Hôm nay';
    }
  } else if (compItem) {
    compItem.status = 'not_started';
    compItem.actionLabel = 'Cập nhật';
  }

  // 3. License
  const licenseItem = profile.checklist.find((i) => i.id === 'license');
  if (licenseItem) {
    if (profile.license.status === 'APPROVED') {
      completed++;
      licenseItem.status = 'approved';
      licenseItem.actionLabel = 'Đã phê duyệt';
      licenseItem.completedAt = profile.license.reviewedAt || 'Hôm nay';
    } else if (profile.license.status === 'PENDING_REVIEW') {
      completed++;
      licenseItem.status = 'in_review';
      licenseItem.actionLabel = 'Đang chờ duyệt';
      licenseItem.completedAt = profile.license.submittedAt || 'Hôm nay';
    } else if (profile.license.status === 'REJECTED') {
      licenseItem.status = 'rejected';
      licenseItem.actionLabel = 'Gửi lại hồ sơ';
      licenseItem.rejectionReason = profile.license.rejectionReason;
    } else {
      licenseItem.status = 'not_started';
      licenseItem.actionLabel = 'Đăng tải tài liệu';
    }
  }

  // 4. Candidate agreement
  const candItem = profile.checklist.find((i) => i.id === 'candidate_agreement');
  if (candItem) {
    if (profile.candidateAgreement.status === 'AGREED') {
      completed++;
      candItem.status = 'approved';
      candItem.actionLabel = 'Đã đồng ý';
      candItem.completedAt = profile.candidateAgreement.agreedAt || 'Hôm nay';
    } else if (profile.candidateAgreement.status === 'PENDING_REVIEW') {
      completed++;
      candItem.status = 'in_review';
      candItem.actionLabel = 'Đang duyệt';
    } else {
      candItem.status = 'not_started';
      candItem.actionLabel = 'Xem thỏa thuận';
    }
  }

  // 5. Platform agreement
  const platItem = profile.checklist.find((i) => i.id === 'platform_agreement');
  if (platItem) {
    if (profile.platformAgreement.isAgreed) {
      completed++;
      platItem.status = 'approved';
      platItem.actionLabel = 'Đã xác nhận';
      platItem.completedAt = profile.platformAgreement.agreedAt || 'Hôm nay';
    } else {
      platItem.status = 'not_started';
      platItem.actionLabel = 'Xác nhận ngay';
    }
  }

  profile.stepsCompleted = completed;
  profile.completionPercent = Math.round((completed / profile.stepsTotal) * 100);

  // Level
  let level: VerificationLevelNumber = 1;
  let levelLabel = 'Cấp 1/3: Tài khoản cơ bản';
  if (completed >= 5 || profile.license.status === 'APPROVED') {
    level = 3;
    levelLabel = 'Cấp 3/3: Doanh nghiệp đã xác thực';
  } else if (completed >= 2 || profile.phone.isVerified) {
    level = 2;
    levelLabel = 'Cấp 2/3: Nhà tuyển dụng tiêu chuẩn';
  }

  profile.level = level;
  profile.levelLabel = levelLabel;

  // Next step label
  const nextIncomplete = profile.checklist.find((i) => i.status !== 'approved' && i.status !== 'in_review');
  profile.nextStepLabel = nextIncomplete ? nextIncomplete.title : 'Đã hoàn tất tất cả bước';

  return profile;
}

export function getRecruiterVerificationProfile(): RecruiterVerificationProfile {
  inMemoryProfile = loadStoredProfile();
  const updated = recalculateProfile(inMemoryProfile);
  saveStoredProfile(updated);
  return updated;
}

export function getCompanyDetailData(): CompanyDetailData {
  inMemoryCompany = loadStoredCompany();
  return inMemoryCompany;
}

export function saveCompanyDetailData(partial: Partial<CompanyDetailData>): CompanyDetailData {
  inMemoryCompany = {
    ...loadStoredCompany(),
    ...partial,
  };
  saveStoredCompany(inMemoryCompany);

  // Update profile company summary
  inMemoryProfile = loadStoredProfile();
  inMemoryProfile.company = {
    id: inMemoryCompany.id,
    name: inMemoryCompany.name,
    taxCode: inMemoryCompany.taxCode,
    address: inMemoryCompany.address,
    industry: inMemoryCompany.industry,
    size: inMemoryCompany.size,
    isCompleted: true,
    logoUrl: inMemoryCompany.logoUrl,
  };
  const updated = recalculateProfile(inMemoryProfile);
  saveStoredProfile(updated);

  return inMemoryCompany;
}

export function chooseExistingCompany(companyId: string): CompanyDetailData {
  const found = MOCK_AVAILABLE_COMPANIES.find((c) => c.id === companyId);
  if (found) {
    inMemoryCompany = JSON.parse(JSON.stringify(found));
    saveStoredCompany(inMemoryCompany);

    inMemoryProfile = loadStoredProfile();
    inMemoryProfile.company = {
      id: found.id,
      name: found.name,
      taxCode: found.taxCode,
      address: found.address,
      industry: found.industry,
      size: found.size,
      isCompleted: true,
      logoUrl: found.logoUrl,
    };
    const updated = recalculateProfile(inMemoryProfile);
    saveStoredProfile(updated);
  }
  return inMemoryCompany;
}

export function verifyRecruiterPhone(phoneNumber: string): RecruiterVerificationProfile {
  inMemoryProfile = loadStoredProfile();
  inMemoryProfile.phone = {
    phoneNumber,
    isVerified: true,
    verifiedAt: 'Hôm nay',
  };
  const updated = recalculateProfile(inMemoryProfile);
  saveStoredProfile(updated);
  return updated;
}

export function submitRecruiterBusinessLicense(params: {
  documentType: BusinessDocumentType;
  fileName: string;
  fileSize: string;
}): RecruiterVerificationProfile {
  inMemoryProfile = loadStoredProfile();
  inMemoryProfile.license = {
    status: 'PENDING_REVIEW',
    documentType: params.documentType,
    fileName: params.fileName,
    fileSize: params.fileSize,
    submittedAt: 'Hôm nay',
  };
  const updated = recalculateProfile(inMemoryProfile);
  saveStoredProfile(updated);
  return updated;
}

export function acceptCandidateAgreement(params: {
  type: 'STANDARD_TEMPLATE' | 'CUSTOM_UPLOAD';
  customFileName?: string;
}): RecruiterVerificationProfile {
  inMemoryProfile = loadStoredProfile();
  inMemoryProfile.candidateAgreement = {
    type: params.type,
    status: params.type === 'STANDARD_TEMPLATE' ? 'AGREED' : 'PENDING_REVIEW',
    customFileName: params.customFileName,
    agreedAt: 'Hôm nay',
  };
  const updated = recalculateProfile(inMemoryProfile);
  saveStoredProfile(updated);
  return updated;
}

export function acceptPlatformAgreement(): RecruiterVerificationProfile {
  inMemoryProfile = loadStoredProfile();
  inMemoryProfile.platformAgreement = {
    isAgreed: true,
    agreedAt: 'Hôm nay',
    version: 'v2.1',
  };
  const updated = recalculateProfile(inMemoryProfile);
  saveStoredProfile(updated);
  return updated;
}

export function setPresetVerificationLevel(level: VerificationLevelNumber): RecruiterVerificationProfile {
  inMemoryProfile = loadStoredProfile();
  if (level === 1) {
    inMemoryProfile = JSON.parse(JSON.stringify(INITIAL_VERIFICATION_PROFILE));
  } else if (level === 2) {
    inMemoryProfile.phone = { phoneNumber: '0896465810', isVerified: true, verifiedAt: 'Hôm qua' };
    inMemoryProfile.company.isCompleted = true;
    inMemoryProfile.candidateAgreement = { type: 'STANDARD_TEMPLATE', status: 'AGREED', agreedAt: 'Hôm qua' };
    inMemoryProfile.platformAgreement = { isAgreed: true, agreedAt: 'Hôm qua', version: 'v2.1' };
    inMemoryProfile.license = {
      status: 'PENDING_REVIEW',
      documentType: 'BUSINESS_LICENSE',
      fileName: 'TechX_GPKD_2026.pdf',
      fileSize: '1.8 MB',
      submittedAt: 'Hôm nay',
    };
  } else if (level === 3) {
    inMemoryProfile.phone = { phoneNumber: '0896465810', isVerified: true, verifiedAt: '12/10/2026' };
    inMemoryProfile.company.isCompleted = true;
    inMemoryProfile.candidateAgreement = { type: 'STANDARD_TEMPLATE', status: 'AGREED', agreedAt: '12/10/2026' };
    inMemoryProfile.platformAgreement = { isAgreed: true, agreedAt: '12/10/2026', version: 'v2.1' };
    inMemoryProfile.license = {
      status: 'APPROVED',
      documentType: 'BUSINESS_LICENSE',
      fileName: 'TechX_GPKD_2026.pdf',
      fileSize: '1.8 MB',
      submittedAt: '12/10/2026',
      reviewedAt: '13/10/2026',
    };
  }
  const updated = recalculateProfile(inMemoryProfile);
  saveStoredProfile(updated);
  return updated;
}

export function getNextStepUrl(profile: RecruiterVerificationProfile): { label: string; href: string } {
  if (!profile.phone.isVerified) {
    return { label: 'Xác thực số điện thoại', href: '/recruiter/company/verification/phone' };
  }
  if (!profile.company.isCompleted) {
    return { label: 'Cập nhật thông tin công ty', href: '/recruiter/company' };
  }
  if (profile.license.status !== 'APPROVED' && profile.license.status !== 'PENDING_REVIEW') {
    return { label: 'Cập nhật Giấy đăng ký doanh nghiệp', href: '/recruiter/company/verification/license' };
  }
  if (profile.candidateAgreement.status !== 'AGREED' && profile.candidateAgreement.status !== 'PENDING_REVIEW') {
    return { label: 'Cập nhật Thỏa thuận xử lý DLCN với ứng viên', href: '/recruiter/company/verification/agreements' };
  }
  if (!profile.platformAgreement.isAgreed) {
    return { label: 'Đồng ý Thỏa thuận xử lý DLCN với InterVue', href: '/recruiter/company/verification/agreements' };
  }
  return { label: 'Đăng tin tuyển dụng đầu tiên', href: '/recruiter/jobs/create' };
}
