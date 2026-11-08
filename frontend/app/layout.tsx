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
  title: 'InterVue - CV xịn việc làm chất - Tạo CV & Luyện phỏng vấn AI',
  description:
    'InterVue - Hệ sinh thái công nghệ tuyển dụng & phỏng vấn AI thông minh tại Việt Nam. Tạo CV chuẩn ATS, luyện phỏng vấn 1:1 cùng AI và kết nối cơ hội việc làm mơ ước.',
  icons: {
    icon: '/intervue-logo.png',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" className={`${inter.variable} ${beVietnamPro.variable}`}>
      <body className="text-navy bg-surface-container-low min-h-screen antialiased">
        <AppProviders>
          {children}
          <SupportChatbot />
        </AppProviders>
      </body>
    </html>
  );
}
