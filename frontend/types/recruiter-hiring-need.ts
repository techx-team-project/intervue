import type { RecruiterNeedsFormData } from '@/schemas/recruiter.schema';

export interface HiringNeed extends Omit<RecruiterNeedsFormData, 'consultation'> {
  id: string;
}
