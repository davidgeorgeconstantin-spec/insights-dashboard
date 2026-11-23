import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import { Sidebar } from '@/components/layout/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'Insights — sales dashboard', template: '%s · Insights' },
  description: 'A sales analytics dashboard (learning project) with Recharts, TanStack Table, CSV export and dark mode. Uses generated demo data.',
  icons: { icon: '/insights-dashboard/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Providers>
          <Sidebar />
          <main className="px-4 pb-24 pt-6 md:ml-60 md:px-8 md:pb-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
