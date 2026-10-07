import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
    <html lang="vi" className={inter.variable}>
      <body className="text-navy min-h-screen bg-[#f4f5f5] antialiased">{children}</body>
    </html>
  );
}
