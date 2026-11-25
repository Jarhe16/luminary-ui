import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';

// Arayus brand fonts, loaded only for the Arayus homepage preview.
const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
});
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arayus | AI compliance review for RIAs, banks & trust companies',
  description:
    'Bring risk to light. A clause-level first pass on ADV brochures, fund prospectuses and offering documents in under 60 seconds.',
};

export default function ArayusLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${cormorant.variable} ${inter.variable}`}>{children}</div>;
}
