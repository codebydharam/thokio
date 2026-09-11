import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'ThokIO | India-first wholesale marketplace', template: '%s | ThokIO' },
  description: 'Shop retail and wholesale products from verified Indian vendors with tracked delivery.',
  openGraph: { title: 'ThokIO | India-first wholesale marketplace', description: 'Shop retail and wholesale products from verified Indian vendors.', type: 'website' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
