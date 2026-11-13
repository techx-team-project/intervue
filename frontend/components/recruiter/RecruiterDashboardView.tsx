import type { RecruiterDashboardData } from '@/types/recruiter';
import DashboardBannerCarousel from './DashboardBannerCarousel';
import DashboardHeader from './DashboardHeader';
import DashboardStatsRow from './DashboardStatsRow';
import PipelineFunnelCard from './PipelineFunnelCard';
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
      <DashboardHeader companyName={data.company.name} />
      <VerificationStatusBanner />
      <DashboardStatsRow stats={data.stats} />

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PipelineFunnelCard stages={data.pipeline} />
        </div>
        <div className="lg:col-span-2">
          <TodayPriorities items={data.priorities} />
        </div>
      </div>

      <RecentApplicationsTable applications={data.recentApplications} />
      <SuggestedServicePackages services={data.suggestedServices} />
      <DashboardBannerCarousel />
    </div>
  );
}
