import NotificationDetailView from '@/components/common/NotificationDetailView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết thông báo | InterVue',
  description: 'Nội dung chi tiết của thông báo',
};

export default function CandidateNotificationDetailPage() {
  return <NotificationDetailView realm="candidate" baseRoute="/notifications" />;
}
