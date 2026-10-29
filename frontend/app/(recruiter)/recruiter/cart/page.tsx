import RecruiterCartView from '@/components/recruiter/cart/RecruiterCartView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Cart | InterVue Recruiter',
  description: 'Manage recruitment service packages, featured job postings, and AI candidate matching',
};

export default function RecruiterCartPage() {
  return <RecruiterCartView />;
}
