import JobPostFormView from '@/components/recruiter/job-posts/JobPostFormView';
import PageHeader from '@/components/recruiter/PageHeader';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { ROUTES } from '@/constants/routes';

export default function CreateJobPostPage() {
  return (
    <>
      <Breadcrumb
        showHome={false}
        items={[{ label: 'Tin tuyển dụng', href: ROUTES.RECRUITER_JOBS }, { label: 'Tạo mới' }]}
        className="mb-3"
      />
      <PageHeader title="Đăng tin tuyển dụng mới" />
      <JobPostFormView mode="create" />
    </>
  );
}
