import AuthProvider from '@/providers/AuthProvider';
import QueryProvider from '@/providers/QueryProvider';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

type AppProvidersProps = { children: ReactNode };

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </QueryProvider>
  );
}
