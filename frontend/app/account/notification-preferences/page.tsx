import NotificationPreferencesView from '@/components/common/NotificationPreferencesView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tuỳ chọn thông báo | InterVue',
  description: 'Chọn loại thông báo bạn muốn nhận từ InterVue',
};

export default function CandidateNotificationPreferencesPage() {
  return <NotificationPreferencesView realm="candidate" />;
}
