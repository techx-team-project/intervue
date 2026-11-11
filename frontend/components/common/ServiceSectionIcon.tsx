import { normalizeServiceSectionIconKey } from '@/lib/service-package-icons';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  Gift,
  Layers,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import type { CSSProperties } from 'react';

interface ServiceSectionIconProps {
  name?: string | null;
  className?: string;
  style?: CSSProperties;
  fallback?: 'none' | 'sparkles';
  fallbackClassName?: string;
}

/** Renders the curated Lucide icon matching a package section's stored icon key. */
export default function ServiceSectionIcon({
  name,
  className,
  style,
  fallback = 'none',
  fallbackClassName,
}: ServiceSectionIconProps) {
  const key = name?.trim() ? normalizeServiceSectionIconKey(name) : '';

  switch (key) {
    case 'sparkles':
      return <Sparkles className={className} style={style} aria-hidden />;
    case 'zap':
      return <Zap className={className} style={style} aria-hidden />;
    case 'award':
      return <Award className={className} style={style} aria-hidden />;
    case 'trending-up':
      return <TrendingUp className={className} style={style} aria-hidden />;
    case 'target':
      return <Target className={className} style={style} aria-hidden />;
    case 'megaphone':
      return <Megaphone className={className} style={style} aria-hidden />;
    case 'shield-check':
      return <ShieldCheck className={className} style={style} aria-hidden />;
    case 'gift':
      return <Gift className={className} style={style} aria-hidden />;
    case 'layers':
      return <Layers className={className} style={style} aria-hidden />;
    case 'users':
      return <Users className={className} style={style} aria-hidden />;
    case 'bar-chart-3':
      return <BarChart3 className={className} style={style} aria-hidden />;
    case 'clock':
      return <Clock className={className} style={style} aria-hidden />;
    case 'star':
      return <Star className={className} style={style} aria-hidden />;
    case 'check-circle-2':
      return <CheckCircle2 className={className} style={style} aria-hidden />;
    default:
      return fallback === 'sparkles' ? (
        <Sparkles className={fallbackClassName ?? className} style={style} aria-hidden />
      ) : null;
  }
}
