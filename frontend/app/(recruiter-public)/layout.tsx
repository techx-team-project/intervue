import { ReactNode } from 'react';

type RecruiterPublicLayoutProps = {
  children: ReactNode;
};

export default function RecruiterPublicLayout({ children }: RecruiterPublicLayoutProps) {
  return <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</div>;
}

