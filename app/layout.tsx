import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIZ CARD",
  description: "Business card design and export workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
