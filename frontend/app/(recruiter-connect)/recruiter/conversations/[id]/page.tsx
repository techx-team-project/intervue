import ConnectThreadSlot from '@/components/recruiter/connect/ConnectThreadSlot';
import { parseConnectRouteKey } from '@/utils/connect-chat';

export default async function RecruiterConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConnectThreadSlot routeKey={parseConnectRouteKey(id)} />;
}
