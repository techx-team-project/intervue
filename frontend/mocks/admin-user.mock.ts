// TEMP: replace with API
import { USER_SEGMENTS } from '@/constants/admin-user';
import { ROLES } from '@/constants/auth';
import { countSegment } from '@/lib/admin-user';
import type {
  AdminAccountListData,
  AdminAccountListItem,
  AdminUserActivityEntry,
  AdminUserActivityKind,
  AdminUserDetail,
  AdminUserLinkedRecord,
  AdminUserListData,
  AdminUserListItem,
  AdminUserRoleGrant,
  AdminUserSegmentCount,
  AdminUserSession,
  AdminUserStatus,
} from '@/types/admin-user';
import type { AdminPermission } from '@/types/admin';
import type { RoleType } from '@/types/auth';

const DAY_MS = 86_400_000;
const NOW = Date.now();
const MOCK_FETCH_DELAY_MS = 900;

const CURRENT_ADMIN_ID = 838025;
const PLATFORM_ADMIN = 'Phạm Hoàng Tuấn';

function daysAgo(days: number): string {
  return new Date(NOW - days * DAY_MS).toISOString();
}

function daysAhead(days: number): string {
  return new Date(NOW + days * DAY_MS).toISOString();
}

interface UserSeed {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  roles: RoleType[];
  joinedDaysAgo: number;
  sessions: number;
  emailVerified?: false;
  status?: Exclude<AdminUserStatus, 'ACTIVE'>;
  lockReason?: string;
  lockDetail?: string;
  lockedDaysAgo?: number;
  recruiterExpiresInDays?: number;
  adminExpiresInDays?: number;
  tokenReuse?: true;
  address?: string;
}

const USER_SEEDS: UserSeed[] = [
  {
    id: 838025,
    name: 'Nguyễn Minh Phúc',
    email: 'phuc.recruiter@intervue.vn',
    phone: '0901234567',
    roles: [ROLES.RECRUITER, ROLES.ADMIN],
    joinedDaysAgo: 301,
    sessions: 2,
    address: 'Cau Giay, Hanoi',
  },
  {
    id: 100412,
    name: 'Phạm Hoàng Tuấn',
    email: 'tuan.pham@intervue.vn',
    phone: '0812665001',
    roles: [ROLES.ADMIN],
    joinedDaysAgo: 420,
    sessions: 1,
    address: 'District 1, Ho Chi Minh City',
  },
  {
    id: 100876,
    name: 'Đỗ Thu Hà',
    email: 'ha.do@intervue.vn',
    phone: '0903881245',
    roles: [ROLES.ADMIN],
    joinedDaysAgo: 268,
    sessions: 1,
  },
  {
    id: 101233,
    name: 'Vũ Thành Long',
    email: 'long.vu@intervue.vn',
    phone: '0917554210',
    roles: [ROLES.ADMIN],
    joinedDaysAgo: 96,
    sessions: 1,
    adminExpiresInDays: 18,
  },
  {
    id: 101488,
    name: 'Trịnh Bảo Ngọc',
    email: 'ngoc.trinh@intervue.vn',
    phone: '0988112043',
    roles: [ROLES.ADMIN],
    joinedDaysAgo: 54,
    sessions: 0,
    status: 'LOCKED',
    lockReason: 'Security incident — credentials compromised',
    lockDetail: 'Password reuse found in an external breach dump. Locked until a new password and 2FA are set.',
    lockedDaysAgo: 2,
  },
  {
    id: 204117,
    name: 'Lê Quốc Huy',
    email: 'huy.le@fpt-software.vn',
    phone: '0905667811',
    roles: [ROLES.CANDIDATE, ROLES.RECRUITER],
    joinedDaysAgo: 188,
    sessions: 3,
    address: 'Hai Chau, Da Nang',
  },
  {
    id: 204298,
    name: 'Trần Khánh Linh',
    email: 'linh.tran@vng.com.vn',
    phone: '0937220114',
    roles: [ROLES.RECRUITER],
    joinedDaysAgo: 142,
    sessions: 2,
  },
  {
    id: 204551,
    name: 'Hoàng Nhật Nam',
    email: 'nam.hoang@tiki.vn',
    phone: '0969338102',
    roles: [ROLES.RECRUITER],
    joinedDaysAgo: 121,
    sessions: 1,
    recruiterExpiresInDays: 12,
  },
  {
    id: 204790,
    name: 'Bùi Phương Thảo',
    email: 'thao.bui@momo.vn',
    phone: '0912884507',
    roles: [ROLES.RECRUITER],
    joinedDaysAgo: 88,
    sessions: 2,
    tokenReuse: true,
  },
  {
    id: 205002,
    name: 'Đặng Trung Hiếu',
    email: 'hieu.dang@shopee.vn',
    phone: null,
    roles: [ROLES.RECRUITER],
    joinedDaysAgo: 61,
    sessions: 0,
    emailVerified: false,
  },
  {
    id: 205318,
    name: 'Nguyễn Hải Yến',
    email: 'yen.nguyen@kms-technology.com',
    phone: '0944120338',
    roles: [ROLES.CANDIDATE, ROLES.RECRUITER],
    joinedDaysAgo: 47,
    sessions: 1,
  },
  {
    id: 301044,
    name: 'Trần Minh Anh',
    email: 'minhanh.tran@gmail.com',
    phone: '0908771206',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 17,
    sessions: 2,
    address: 'Thanh Xuan, Hanoi',
  },
  {
    id: 301190,
    name: 'Phan Gia Bảo',
    email: 'giabao.phan@gmail.com',
    phone: '0933410277',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 23,
    sessions: 1,
  },
  {
    id: 301355,
    name: 'Lý Thanh Trúc',
    email: 'thanhtruc.ly@gmail.com',
    phone: '0977224518',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 29,
    sessions: 1,
  },
  {
    id: 301502,
    name: 'Võ Đình Khang',
    email: 'dinhkhang.vo@outlook.com',
    phone: null,
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 31,
    sessions: 0,
    emailVerified: false,
  },
  {
    id: 301744,
    name: 'Ngô Mỹ Duyên',
    email: 'myduyen.ngo@gmail.com',
    phone: '0901553280',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 38,
    sessions: 1,
  },
  {
    id: 301918,
    name: 'Chu Tiến Đạt',
    email: 'tiendat.chu@gmail.com',
    phone: '0916702334',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 44,
    sessions: 0,
    status: 'LOCKED',
    lockReason: 'Spam or mass unsolicited contact',
    lockDetail: 'Sent the same template message to 180 recruiters in one hour.',
    lockedDaysAgo: 6,
  },
  {
    id: 302077,
    name: 'Đinh Khánh Hòa',
    email: 'khanhhoa.dinh@gmail.com',
    phone: '0922448016',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 52,
    sessions: 2,
  },
  {
    id: 302234,
    name: 'Tạ Hoàng Sơn',
    email: 'hoangson.ta@gmail.com',
    phone: '0935118740',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 58,
    sessions: 1,
    tokenReuse: true,
  },
  {
    id: 302491,
    name: 'Mai Thuỳ Dương',
    email: 'thuyduong.mai@gmail.com',
    phone: '0987330125',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 66,
    sessions: 1,
  },
  {
    id: 302658,
    name: 'Hồ Anh Quân',
    email: 'anhquan.ho@gmail.com',
    phone: null,
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 73,
    sessions: 0,
    emailVerified: false,
  },
  {
    id: 302815,
    name: 'Lâm Diệu Linh',
    email: 'dieulinh.lam@gmail.com',
    phone: '0903997412',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 81,
    sessions: 1,
  },
  {
    id: 303060,
    name: 'Cao Nhật Trường',
    email: 'nhattruong.cao@gmail.com',
    phone: '0948221065',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 94,
    sessions: 0,
    status: 'LOCKED',
    lockReason: 'Fraudulent or fake identity documents',
    lockDetail: 'Submitted an ID card that belongs to another person. eKYC attempt 3 of 3.',
    lockedDaysAgo: 11,
  },
  {
    id: 303277,
    name: 'Phùng Kim Chi',
    email: 'kimchi.phung@gmail.com',
    phone: '0911604339',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 103,
    sessions: 1,
  },
  {
    id: 303418,
    name: 'Dương Tấn Phát',
    email: 'tanphat.duong@gmail.com',
    phone: null,
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 118,
    sessions: 0,
    emailVerified: false,
  },
  {
    id: 303690,
    name: 'Nguyễn Bích Ngân',
    email: 'bichngan.nguyen@gmail.com',
    phone: '0962775104',
    roles: [ROLES.CANDIDATE],
    joinedDaysAgo: 134,
    sessions: 1,
  },
];

function buildRoleGrants(seed: UserSeed): AdminUserRoleGrant[] {
  return seed.roles.map((role) => {
    if (role === ROLES.CANDIDATE) {
      return { role, grantedAt: daysAgo(seed.joinedDaysAgo), grantedByName: null, expiresAt: null };
    }

    if (role === ROLES.RECRUITER) {
      return {
        role,
        grantedAt: daysAgo(Math.max(1, seed.joinedDaysAgo - 2)),
        grantedByName: null,
        expiresAt: seed.recruiterExpiresInDays ? daysAhead(seed.recruiterExpiresInDays) : null,
      };
    }

    return {
      role,
      grantedAt: daysAgo(Math.max(1, seed.joinedDaysAgo - 14)),
      grantedByName: PLATFORM_ADMIN,
      expiresAt: seed.adminExpiresInDays ? daysAhead(seed.adminExpiresInDays) : null,
    };
  });
}

function buildListItem(seed: UserSeed): AdminUserListItem {
  return {
    id: seed.id,
    name: seed.name,
    email: seed.email,
    phone: seed.phone,
    image: null,
    status: seed.status ?? 'ACTIVE',
    emailVerifiedAt: seed.emailVerified === false ? null : daysAgo(Math.max(0, seed.joinedDaysAgo - 1)),
    roles: buildRoleGrants(seed),
    activeSessionCount: seed.sessions,
    hasTokenReuseIncident: seed.tokenReuse === true,
    createdAt: daysAgo(seed.joinedDaysAgo),
    lock: seed.lockReason
      ? {
          reason: seed.lockReason,
          detail: seed.lockDetail ?? null,
          at: daysAgo(seed.lockedDaysAgo ?? 1),
          byName: PLATFORM_ADMIN,
        }
      : null,
    lockImpact: {
      activeSessionCount: seed.sessions,
      publishedJobPostCount: seed.roles.includes(ROLES.RECRUITER) ? (seed.id % 5) + 1 : 0,
      applicationsInProgressCount: seed.roles.includes(ROLES.CANDIDATE) ? seed.id % 3 : 0,
    },
  };
}

const DEVICE_LABELS = ['Chrome on Windows', 'Safari on iPhone', 'Chrome on macOS', 'Edge on Windows'];
const IP_ADDRESSES = ['14.161.28.104', '113.161.74.22', '171.252.154.9', '27.72.102.58'];

function buildSessions(seed: UserSeed): AdminUserSession[] {
  const sessions: AdminUserSession[] = [];

  for (let index = 0; index < seed.sessions; index += 1) {
    sessions.push({
      id: `rt-${seed.id}-${index + 1}`,
      createdAt: daysAgo(index * 3 + 1),
      expiresAt: daysAhead(14 - index * 3),
      revoked: false,
      replacedByTokenId: null,
      deviceLabel: DEVICE_LABELS[index % DEVICE_LABELS.length],
      ipAddress: IP_ADDRESSES[index % IP_ADDRESSES.length],
      isCurrent: index === 0,
    });
  }

  if (seed.tokenReuse) {
    sessions.push({
      id: `rt-${seed.id}-reuse`,
      createdAt: daysAgo(9),
      expiresAt: daysAgo(2),
      revoked: true,
      replacedByTokenId: `rt-${seed.id}-1`,
      deviceLabel: 'Unknown client',
      ipAddress: '45.119.83.17',
      isCurrent: false,
    });
  }

  if (seed.status === 'LOCKED') {
    sessions.push({
      id: `rt-${seed.id}-locked`,
      createdAt: daysAgo((seed.lockedDaysAgo ?? 1) + 4),
      expiresAt: daysAgo(seed.lockedDaysAgo ?? 1),
      revoked: true,
      replacedByTokenId: null,
      deviceLabel: DEVICE_LABELS[0],
      ipAddress: IP_ADDRESSES[1],
      isCurrent: false,
    });
  }

  return sessions;
}

function activityEntry(
  seed: UserSeed,
  kind: AdminUserActivityKind,
  summary: string,
  daysBack: number,
  actorName: string | null = null,
  reason: string | null = null,
): AdminUserActivityEntry {
  return { id: `act-${seed.id}-${kind}-${daysBack}`, kind, summary, actorName, reason, at: daysAgo(daysBack) };
}

function buildActivity(seed: UserSeed): AdminUserActivityEntry[] {
  const entries: AdminUserActivityEntry[] = [
    activityEntry(seed, 'accountCreated', 'Account registered as a candidate', seed.joinedDaysAgo),
  ];

  if (seed.emailVerified !== false) {
    entries.push(activityEntry(seed, 'emailVerified', 'Email address verified', Math.max(0, seed.joinedDaysAgo - 1)));
  }

  for (const grant of buildRoleGrants(seed)) {
    if (grant.role === ROLES.CANDIDATE) continue;
    entries.push(
      activityEntry(
        seed,
        'roleGranted',
        grant.expiresAt
          ? `${grant.role} role granted until ${new Date(grant.expiresAt).toISOString().slice(0, 10)}`
          : `${grant.role} role granted`,
        Math.max(1, seed.joinedDaysAgo - 14),
        grant.grantedByName,
      ),
    );
  }

  if (seed.tokenReuse) {
    entries.push(
      activityEntry(
        seed,
        'tokenReuseDetected',
        'Revoked refresh token presented again — every session was revoked',
        9,
        'System',
      ),
    );
  }

  if (seed.lockReason) {
    entries.push(
      activityEntry(seed, 'locked', 'Account locked', seed.lockedDaysAgo ?? 1, PLATFORM_ADMIN, seed.lockReason),
    );
    entries.push(
      activityEntry(
        seed,
        'sessionsRevoked',
        'All sessions revoked by the lock',
        seed.lockedDaysAgo ?? 1,
        PLATFORM_ADMIN,
      ),
    );
  }

  return entries.sort((left, right) => Date.parse(right.at) - Date.parse(left.at));
}

function buildLinkedRecords(seed: UserSeed): AdminUserLinkedRecord[] {
  const records: AdminUserLinkedRecord[] = [];
  const isCandidate = seed.roles.includes(ROLES.CANDIDATE);
  const isRecruiter = seed.roles.includes(ROLES.RECRUITER);

  if (isCandidate) {
    records.push({
      key: 'identityVerification',
      label: 'Identity verification',
      value: seed.lockReason?.startsWith('Fraudulent')
        ? 'Rejected — 3 of 3 attempts used'
        : seed.emailVerified === false
          ? 'Not submitted'
          : 'Approved',
      href: null,
    });
    records.push({
      key: 'applications',
      label: 'Applications',
      value: `${(seed.id % 7) + 1} submitted · ${seed.id % 3} in progress`,
      href: null,
    });
  }

  if (isRecruiter) {
    records.push({
      key: 'companyVerification',
      label: 'Company verification',
      value: seed.recruiterExpiresInDays ? 'Level 2 of 3 — standard recruiter' : 'Level 3 of 3 — verified enterprise',
      href: null,
    });
    records.push({
      key: 'jobPosts',
      label: 'Job posts',
      value: `${(seed.id % 5) + 1} published · ${seed.id % 2} pending review`,
      href: null,
    });
    records.push({
      key: 'savedCandidates',
      label: 'Saved candidates',
      value: `${(seed.id % 11) + 2} saved`,
      href: null,
    });
  }

  return records;
}

function buildDetail(seed: UserSeed): AdminUserDetail {
  const listItem = buildListItem(seed);

  return {
    ...listItem,
    address: seed.address ?? null,
    termsAcceptedAt: daysAgo(seed.joinedDaysAgo),
    updatedAt: daysAgo(Math.min(seed.joinedDaysAgo, seed.lockedDaysAgo ?? 4)),
    twoFactorEnabled: seed.roles.includes(ROLES.ADMIN) && seed.id !== CURRENT_ADMIN_ID,
    sessions: buildSessions(seed),
    activity: buildActivity(seed),
    linkedRecords: buildLinkedRecords(seed),
  };
}

const USERS: AdminUserListItem[] = USER_SEEDS.map(buildListItem);

const ADMIN_PERMISSION_SETS: Record<number, AdminPermission[]> = {
  838025: ['users.manage', 'users.admins'],
  100412: [
    'users.manage',
    'users.admins',
    'verification.identity',
    'verification.business',
    'moderation.jobs',
    'moderation.reports',
    'catalogs.manage',
    'services.manage',
    'finance.manage',
    'support.manage',
    'content.manage',
  ],
  100876: ['finance.manage', 'services.manage'],
  101233: ['verification.identity', 'verification.business', 'moderation.jobs'],
  101488: ['support.manage', 'content.manage'],
};

function buildSegmentCounts(users: AdminUserListItem[]): AdminUserSegmentCount[] {
  return USER_SEGMENTS.map(({ segment }) => ({ segment, count: countSegment(users, segment) }));
}

export async function fetchAdminUserList(): Promise<AdminUserListData> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_FETCH_DELAY_MS));
  return { users: USERS, segmentCounts: buildSegmentCounts(USERS), currentAdminId: CURRENT_ADMIN_ID };
}

export async function fetchAdminUserDetail(id: number): Promise<AdminUserDetail | undefined> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_FETCH_DELAY_MS));
  const seed = USER_SEEDS.find((entry) => entry.id === id);
  return seed ? buildDetail(seed) : undefined;
}

export async function fetchAdminAccountList(): Promise<AdminAccountListData> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_FETCH_DELAY_MS));

  const accounts: AdminAccountListItem[] = USER_SEEDS.filter((seed) => seed.roles.includes(ROLES.ADMIN)).map((seed) => {
    const grant = buildRoleGrants(seed).find((entry) => entry.role === ROLES.ADMIN);

    return {
      id: seed.id,
      name: seed.name,
      email: seed.email,
      image: null,
      status: seed.status ?? 'ACTIVE',
      twoFactorEnabled: seed.id !== CURRENT_ADMIN_ID,
      permissions: ADMIN_PERMISSION_SETS[seed.id] ?? [],
      grantedByName: grant?.grantedByName ?? null,
      grantedAt: grant?.grantedAt ?? daysAgo(seed.joinedDaysAgo),
      expiresAt: grant?.expiresAt ?? null,
      isCurrentAdmin: seed.id === CURRENT_ADMIN_ID,
    };
  });

  return { accounts, currentAdminId: CURRENT_ADMIN_ID };
}

export function getAdminUserTotal(): number {
  return USERS.length;
}
