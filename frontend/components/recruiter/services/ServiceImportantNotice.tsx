import InfoNotice from '@/components/common/InfoNotice';
import { SERVICE_IMPORTANT_NOTICE } from '@/constants/service-package';

export default function ServiceImportantNotice() {
  return <InfoNotice title={SERVICE_IMPORTANT_NOTICE.title}>{SERVICE_IMPORTANT_NOTICE.body}</InfoNotice>;
}
