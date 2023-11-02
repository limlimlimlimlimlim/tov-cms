import type { Metadata } from 'next';
import './globals.css';
import { BuildingContextProvider } from './context/building';

export const metadata: Metadata = {
  title: ':: twin tower::',
  viewport:
    'width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <BuildingContextProvider>
        <body>{children}</body>
      </BuildingContextProvider>
    </html>
  );
}
