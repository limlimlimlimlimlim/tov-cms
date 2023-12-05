import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import AppContainer from '../component/app-container/app-container';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LG 에너지솔루셩',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script src="https://unpkg.com/konva@9/konva.min.js" />
        <AppContainer>{children}</AppContainer>
      </body>
    </html>
  );
}
