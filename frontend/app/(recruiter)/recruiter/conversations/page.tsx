import ConnectView from '@/components/recruiter/connect/ConnectView';
import PageHeader from '@/components/recruiter/PageHeader';

export default function RecruiterConversationsPage() {
  return (
    <>
      <PageHeader
        title="InterVue Connect"
        description="Trò chuyện trực tiếp với ứng viên đã ứng tuyển vào công ty bạn."
      />
      <ConnectView />
    </>
  );
}
