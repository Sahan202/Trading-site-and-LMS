import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.krishfxswinglab.com'),
  icons: {
    icon: '/krish-fx-logo.jpeg',
    shortcut: '/krish-fx-logo.jpeg',
    apple: '/krish-fx-logo.jpeg',
  },
  title: 'Krish FX Swing Lab | Build a Stronger Trading Future',
  description:
    'Learn swing trading through structured market analysis, practical guidance, and a clear approach to price action, risk management, and trading psychology.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Krish FX Swing Lab',
    title: 'Turn Your Trading Knowledge Into a Stronger Future',
    description:
      'Structured swing trading education and AMF mentorship with Krish FX Swing Lab.',
    images: [
      {
        url: '/share-preview-v2',
        width: 1200,
        height: 630,
        alt: 'Krish FX Swing Lab — Turn Your Trading Knowledge Into a Stronger Future',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turn Your Trading Knowledge Into a Stronger Future',
    description:
      'Structured swing trading education and AMF mentorship with Krish FX Swing Lab.',
    images: ['/share-preview-v2'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
