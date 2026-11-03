import RecruiterLandingView from '@/components/recruiter/public/RecruiterLandingView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'InterVue for Employers – AI-assisted IT recruitment',
  description: 'Post IT jobs, receive applications and screen candidates faster with AI resume matching on InterVue.',
};

export default function RecruiterLandingPage() {
  return <RecruiterLandingView />;
}
