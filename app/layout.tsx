import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LancerPay | Track Clients. Send Invoices. Get Paid Faster.",
  description:
    "The financial operating system for freelancers who want faster invoicing, cleaner client tracking, and better payout visibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-background text-on-surface">{children}</body>
    </html>
  );
}
