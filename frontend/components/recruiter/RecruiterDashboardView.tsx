import type { RecruiterDashboardData } from '@/types/recruiter';
import DashboardBannerCarousel from './DashboardBannerCarousel';
import DashboardStatsRow from './DashboardStatsRow';
import PipelineFunnelCard from './PipelineFunnelCard';
import QuickActionsRow from './QuickActionsRow';
import RecentApplicationsTable from './RecentApplicationsTable';
import SuggestedServicePackages from './SuggestedServicePackages';
import TodayPriorities from './TodayPriorities';
import VerificationStatusBanner from './VerificationStatusBanner';

interface RecruiterDashboardViewProps {
  data: RecruiterDashboardData;
}

export default function RecruiterDashboardView({ data }: RecruiterDashboardViewProps) {
  return (
    <div className="space-y-6">
      <DashboardBannerCarousel />
      <VerificationStatusBanner verification={data.verification} />

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PipelineFunnelCard stages={data.pipeline} />
        </div>
        <div className="lg:col-span-1">
          <TodayPriorities items={data.priorities} />
        </div>
      </div>

      <DashboardStatsRow stats={data.stats} />
      <QuickActionsRow />
      <SuggestedServicePackages services={data.suggestedServices} />
      <RecentApplicationsTable applications={data.recentApplications} />
    </div>
  );
}
