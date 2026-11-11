import ConnectView from '@/components/recruiter/connect/ConnectView';
import PageHeader from '@/components/recruiter/PageHeader';

export default function RecruiterConversationsPage() {
  return (
    <>
      <PageHeader
        title="InterVue Connect"
        description="Chat directly with candidates who applied to your company job postings."
      />
      <ConnectView />
    </>
  );
}
