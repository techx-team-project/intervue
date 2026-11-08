import {
  BrainCircuit,
  ClipboardList,
  Cloud,
  Code2,
  GraduationCap,
  Layers,
  Lock,
  Palette,
  Server,
  ShieldCheck,
  Smartphone,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type HomeCategory = { id: string; label: string; keyword: string; icon: LucideIcon };

export const HOME_CATEGORIES: HomeCategory[] = [
  { id: 'backend', label: 'Backend', keyword: 'Backend', icon: Server },
  { id: 'frontend', label: 'Frontend', keyword: 'Frontend', icon: Code2 },
  { id: 'fullstack', label: 'Fullstack', keyword: 'Fullstack', icon: Layers },
  { id: 'mobile', label: 'Mobile', keyword: 'Mobile', icon: Smartphone },
  { id: 'devops', label: 'DevOps / Cloud', keyword: 'DevOps', icon: Cloud },
  { id: 'data-ai', label: 'Data / AI', keyword: 'Data', icon: BrainCircuit },
  { id: 'qa', label: 'QA / Tester', keyword: 'Tester', icon: ShieldCheck },
  { id: 'ui-ux', label: 'UI / UX', keyword: 'UI/UX', icon: Palette },
  { id: 'ba', label: 'Business Analyst', keyword: 'Business Analyst', icon: ClipboardList },
  { id: 'pm', label: 'Project Manager', keyword: 'Project Manager', icon: Users },
  { id: 'security', label: 'An toàn thông tin', keyword: 'Security', icon: Lock },
  { id: 'fresher', label: 'Intern / Fresher', keyword: 'Fresher', icon: GraduationCap },
];
