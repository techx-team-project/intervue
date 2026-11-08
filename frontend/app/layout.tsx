import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Inter } from 'next/font/google';
import './globals.css';
import { SupportChatbot } from '@/components/support-chat';
import AppProviders from '@/providers/AppProviders';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-be-vietnam',
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'InterVue - IT Jobs, CV Builder & AI Interview Practice',
  description:
    'InterVue - An AI-assisted IT recruitment platform. Build ATS-ready CVs, practice interviews with AI and find your next job.',
  icons: {
    icon: '/intervue-logo.png',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.variable} ${beVietnamPro.variable}`}>
      <body className="text-navy bg-surface-container-low min-h-screen antialiased">
        <AppProviders>
          {children}
          <SupportChatbot />
        </AppProviders>
      </body>
    </html>
  );
}
