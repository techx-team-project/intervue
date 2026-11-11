import CandidateConnectThreadSlot from '@/components/candidate/connect/CandidateConnectThreadSlot';
import { parseConnectRouteId } from '@/utils/connect-chat';

export default async function CandidateConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CandidateConnectThreadSlot connectionId={parseConnectRouteId(id)} />;
}
