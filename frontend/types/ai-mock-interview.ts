export type MockInterviewStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export type MockInterviewFocusArea = 'TECHNICAL' | 'BEHAVIORAL' | 'SYSTEM_DESIGN' | 'MIXED';

export interface StartMockInterviewRequest {
  targetRole: string;
  seniorityLevel: string;
  focusArea: MockInterviewFocusArea;
  questionCount: number;
}

export interface SubmitMockAnswerRequest {
  answer: string;
}

export interface SubmitMockFollowUpRequest {
  followUpAnswer: string;
}

export interface MockInterviewQuestionResource {
  id: number;
  questionOrder: number;
  category: string;
  questionText: string;
  candidateAnswer?: string | null;
  answeredAt?: string | null;
  followUpQuestion?: string | null;
  followUpAnswer?: string | null;
  followUpAnsweredAt?: string | null;
  feedback?: string | null;
  score?: number | null;
  idealAnswer?: string | null;
}

export interface MockInterviewSummaryResource {
  id: number;
  targetRole: string;
  seniorityLevel: string;
  focusArea: MockInterviewFocusArea;
  questionCount: number;
  currentQuestionIndex: number;
  status: MockInterviewStatus;
  overallScore?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockInterviewDetailResource {
  id: number;
  candidateId: number;
  targetRole: string;
  seniorityLevel: string;
  focusArea: MockInterviewFocusArea;
  questionCount: number;
  currentQuestionIndex: number;
  status: MockInterviewStatus;
  overallScore?: number | null;
  overallFeedback?: string | null;
  strengths: string[];
  improvements: string[];
  questions: MockInterviewQuestionResource[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmitAnswerResultResource {
  questionId: number;
  questionOrder: number;
  needsFollowUp: boolean;
  followUpQuestion?: string | null;
  feedback?: string | null;
  score?: number | null;
  idealAnswer?: string | null;
  sessionCompleted: boolean;
  nextQuestion?: MockInterviewQuestionResource | null;
  completedSession?: MockInterviewDetailResource | null;
}
