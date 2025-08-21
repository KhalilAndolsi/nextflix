import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: {
    default: "Nextflix",
    template: "%s | Nextflix",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
          <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
