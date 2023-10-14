import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppContainer from "../components/app-container/app-container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LG Twin Tower CMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContainer>{children}</AppContainer>
      </body>
    </html>
  );
}
