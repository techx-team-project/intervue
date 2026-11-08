import { ReactNode } from 'react';

type RecruiterPublicLayoutProps = {
  children: ReactNode;
};

export default function RecruiterPublicLayout({ children }: RecruiterPublicLayoutProps) {
  return <div className="bg-surface-container-low text-on-surface min-h-screen antialiased">{children}</div>;
}
