import CandidateConnectThreadSlot from '@/components/candidate/connect/CandidateConnectThreadSlot';
import { parseConnectRouteKey } from '@/utils/connect-chat';

export default async function CandidateConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CandidateConnectThreadSlot routeKey={parseConnectRouteKey(id)} />;
}
