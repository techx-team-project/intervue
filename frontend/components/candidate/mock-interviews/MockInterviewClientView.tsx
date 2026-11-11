'use client';

import { useState } from 'react';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { useMockInterviewDetail } from '@/hooks/useAiMockInterview';
import type { MockInterviewDetailResource } from '@/types/ai-mock-interview';
import MockInterviewSetupModal from './MockInterviewSetupModal';
import MockInterviewRoom from './MockInterviewRoom';
import MockInterviewResultView from './MockInterviewResultView';
import MockInterviewHistoryList from './MockInterviewHistoryList';
import { Sparkles, History, HelpCircle } from 'lucide-react';

export default function MockInterviewClientView() {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'ROOM' | 'RESULT' | 'HISTORY'>('HISTORY');

  const { data: sessionDetail, isLoading: isSessionLoading } = useMockInterviewDetail(activeSessionId);

  const handleSessionStarted = (newSession: MockInterviewDetailResource) => {
    setActiveSessionId(newSession.id);
    setActiveTab('ROOM');
  };

  const handleSessionUpdated = (updatedSession: MockInterviewDetailResource) => {
    if (updatedSession.status === 'COMPLETED') {
      setActiveTab('RESULT');
    }
  };

  const handleFinish = (completedSession: MockInterviewDetailResource) => {
    setActiveSessionId(completedSession.id);
    setActiveTab('RESULT');
  };

  const handleSelectHistorySession = (id: number) => {
    setActiveSessionId(id);
    setActiveTab('ROOM');
  };

  return (
    <div className="container-topcv space-y-6 py-6">
      <div className="border-b border-slate-200 pb-4">
        <Breadcrumb
          items={[{ label: 'Ứng viên', href: '/candidate/profile' }, { label: 'Phỏng vấn thử cùng AI' }]}
          showHome
          className="mb-3 text-xs"
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-navy flex items-center gap-2 text-2xl font-black">
              <Sparkles className="text-primary h-6 w-6" />
              AI Mock Interview
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Luyện phỏng vấn thử 1-1 với AI dựa trên CV thật và vị trí mục tiêu của bạn. Nhận điểm số, nhận xét và 3
              điểm mạnh, 3 điểm cải thiện.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'HISTORY' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('HISTORY')}
              leftIcon={<History className="h-4 w-4" />}
            >
              Lịch sử
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSetupOpen(true)}
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Phỏng vấn mới
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'HISTORY' && (
        <MockInterviewHistoryList
          onSelectSession={handleSelectHistorySession}
          onStartNew={() => setIsSetupOpen(true)}
        />
      )}

      {(activeTab === 'ROOM' || activeTab === 'RESULT') && (
        <>
          {isSessionLoading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : sessionDetail ? (
            sessionDetail.status === 'COMPLETED' || activeTab === 'RESULT' ? (
              <MockInterviewResultView
                session={sessionDetail}
                onStartNew={() => setIsSetupOpen(true)}
                onViewHistory={() => setActiveTab('HISTORY')}
              />
            ) : (
              <MockInterviewRoom
                session={sessionDetail}
                onSessionUpdated={handleSessionUpdated}
                onFinish={handleFinish}
              />
            )
          ) : (
            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Chưa chọn buổi phỏng vấn nào</p>
              <Button variant="primary" onClick={() => setIsSetupOpen(true)}>
                Bắt đầu buổi phỏng vấn mới
              </Button>
            </div>
          )}
        </>
      )}

      {/* Setup Modal */}
      <MockInterviewSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onSessionStarted={handleSessionStarted}
      />
    </div>
  );
}
