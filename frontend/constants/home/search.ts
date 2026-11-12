import { VN_LOCATIONS } from '@/constants/vn-locations';

export const CITY_OPTIONS = [
  { value: '', label: 'All locations' },
  ...VN_LOCATIONS.map((city) => ({ value: city, label: city })),
];

export const POPULAR_KEYWORDS = [
  'Java',
  'React',
  'Node.js',
  'Python',
  'DevOps',
  'Flutter',
  'Business Analyst',
  'Tester',
  'UI/UX',
  'Data Engineer',
];

export const FEATURED_CITY_FILTERS = [
  { id: '', label: 'Latest' },
  { id: 'Hà Nội', label: 'Hanoi' },
  { id: 'TP. Hồ Chí Minh', label: 'Ho Chi Minh City' },
  { id: 'Đà Nẵng', label: 'Da Nang' },
];

export const TECH_STACK = [
  'Java',
  'React',
  'Node.js',
  'Python',
  'Spring Boot',
  'TypeScript',
  'DevOps',
  'Flutter',
  'Kotlin',
  '.NET',
  'Docker',
  'AWS',
  'Go',
  'Next.js',
  'SQL',
  'Kubernetes',
];

export const HERO_ROLE_WORDS = ['Backend', 'Frontend', 'Mobile', 'DevOps', 'Data', 'QA', 'UI/UX'];
