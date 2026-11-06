import NotificationsListView from '@/components/common/NotificationsListView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông báo | InterVue',
  description: 'Xem thông báo về hồ sơ ứng tuyển, việc làm và tài khoản của bạn trên InterVue',
};

export default function CandidateNotificationsPage() {
  return <NotificationsListView realm="candidate" baseRoute="/notifications" pageTitle="Thông báo của bạn" />;
}
