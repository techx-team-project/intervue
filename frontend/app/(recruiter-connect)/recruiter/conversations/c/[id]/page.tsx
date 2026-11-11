import ConnectThreadSlot from '@/components/recruiter/connect/ConnectThreadSlot';
import { parseConnectRouteId } from '@/utils/connect-chat';

export default async function RecruiterConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConnectThreadSlot connectionId={parseConnectRouteId(id)} />;
}
