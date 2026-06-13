import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AetherFlow | Autonomous Port Orchestration Platform",
  description: "Next-generation port operations platform powered by Gemini AI. Orchestrate global trade routes, container traffic, berth schedules, and automated port logistics.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-obsidian text-foreground font-outfit selection:bg-crimson selection:text-white">
        {children}
      </body>
    </html>
  );
}
