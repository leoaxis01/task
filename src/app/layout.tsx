import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TASK 2.0 | Telangana Academy for Skill and Knowledge",
    template: "%s | TASK Telangana",
  },
  description:
    "AI-enabled skill, mentorship and employment ecosystem for Telangana youth — Department of ITE&C, Government of Telangana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
