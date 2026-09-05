import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samar Baxtiyorov — Frontend Developer",
  description:
    "17 yoshli frontend developer. Real loyihalar quruvchi. SavdoAI, RestNova, Teacher AI — hammasi bir joyda.",
  keywords: ["Samar Baxtiyorov", "Frontend Developer", "Uzbekistan", "Next.js", "React"],
  authors: [{ name: "Samar Baxtiyorov" }],
  openGraph: {
    title: "Samar Baxtiyorov — Frontend Developer",
    description: "17 yoshli frontend developer. Real loyihalar quruvchi.",
    url: "https://camar.dev",
    siteName: "Samar Baxtiyorov",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samar Baxtiyorov",
    description: "17 yoshli frontend developer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
